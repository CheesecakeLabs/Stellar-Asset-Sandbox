package v1

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/bitly/go-notify"
)

type HTTPControllerMessenger struct {
	pKp  entity.ProducerInterface
	pHor entity.ProducerInterface
	pEnv entity.ProducerInterface
}

func newHTTPControllerMessenger(pKp, pHor, pEnv entity.ProducerInterface) HTTPControllerMessenger {
	return HTTPControllerMessenger{pKp, pHor, pEnv}
}

func (m *HTTPControllerMessenger) SendMessage(chanName string, value interface{}) (*entity.NotifyData, error) {
	msgKey, err := m.generateHash()
	if err != nil {
		return &entity.NotifyData{}, fmt.Errorf("sendMessage - generateHash: %v", err)
	}

	channel := make(chan interface{})
	notify.Start(msgKey, channel)

	err = m.produce(chanName, msgKey, value)
	if err != nil {
		return &entity.NotifyData{}, fmt.Errorf("sendMessage - p.Produce: %v", err)
	}

	res := <-channel
	err = notify.Stop(msgKey, channel)
	if err != nil {
		return &entity.NotifyData{}, fmt.Errorf("sendMessage - notify.Stop: %v", err)
	}
	if notifyData, ok := res.(*entity.NotifyData); ok {
		switch msg := notifyData.Message.(type) {
		case entity.EnvelopeResponse:
			if msg.Error != nil {
				errorDetails := msg.Error.(map[string]interface{})
				errorDetailsJSON, err := json.Marshal(errorDetails)
				if err != nil {
					return notifyData, fmt.Errorf("error marshaling error details: %v", err)
				}
				return notifyData, fmt.Errorf(string(errorDetailsJSON))
			}
			return notifyData, nil
		default:
			return notifyData, nil
		}
	}

	return res.(*entity.NotifyData), nil
}

func (m *HTTPControllerMessenger) generateHash() (string, error) {
	randBytes := make([]byte, 32)
	_, err := rand.Read(randBytes)
	if err != nil {
		return "", err
	}
	hash := sha256.Sum256(randBytes)

	return fmt.Sprintf("%x", hash), nil
}

func (m *HTTPControllerMessenger) produce(chanName string, msgKey string, value interface{}) (err error) {
	switch chanName {
	case entity.CreateKeypairChannel:
		err = m.pKp.Produce(msgKey, value)
	case entity.HorizonChannel:
		err = m.pHor.Produce(msgKey, value)
	case entity.EnvelopeChannel:
		err = m.pEnv.Produce(msgKey, value)
	default:
		err = fmt.Errorf("invalid channel name")
	}
	return
}

func createLogDescription(transaction int, assetCode string, setFlags, clearFlags []string) string {
	switch transaction {
	case entity.CreateAsset:
		return fmt.Sprintf("Operation: Create Asset | Asset Code: %s", assetCode)
	case entity.MintAsset:
		return fmt.Sprintf("Operation: Mint | Asset Code: %s", assetCode)
	case entity.BurnAsset:
		return fmt.Sprintf("Operation: Burn | Asset Code: %s", assetCode)
	case entity.ClawbackAsset:
		return fmt.Sprintf("Operation: Clawback | Asset Code: %s", assetCode)
	case entity.TransferAsset:
		return fmt.Sprintf("Operation: Transfer | Asset Code: %s", assetCode)
	case entity.UpdateAuthFlags:
		if len(setFlags) == 0 {
			setFlags = []string{"none"}
		}
		if len(clearFlags) == 0 {
			clearFlags = []string{"none"}
		}
		return fmt.Sprintf("Operation: Update Auth Flags | Asset Code: %s | Set Flags: %s | Clear Flags: %s", assetCode, strings.Join(setFlags, ","), strings.Join(clearFlags, ","))
	default:
		return "Unrecognized transaction type"
	}
}

// Generate ID
func generateID() int {
	currentTimeInMillis := int(time.Now().UnixNano() / int64(time.Millisecond))
	return currentTimeInMillis
}
