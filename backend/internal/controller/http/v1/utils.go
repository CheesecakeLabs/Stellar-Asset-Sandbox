package v1

import (
	"crypto/rand"
	"crypto/sha256"
	"fmt"

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
	notify.Stop(msgKey, channel)
	fmt.Println(res)
	if notifyData, ok := res.(*entity.NotifyData); ok {
		switch msg := notifyData.Message.(type) {
		case entity.EnvelopeResponse:
			if msg.StatusCode != 200 {
				return nil, fmt.Errorf("sendMessage - error response: %v", msg)
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
