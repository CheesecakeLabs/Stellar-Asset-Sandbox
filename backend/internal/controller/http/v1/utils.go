package v1

import (
	"crypto/rand"
	"crypto/sha256"
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/bitly/go-notify"
)

type HTTPControllerMessenger struct {
	p entity.ProducerInterface
}

func newHTTPControllerMessenger(p entity.ProducerInterface) HTTPControllerMessenger {
	return HTTPControllerMessenger{p}
}

func (m *HTTPControllerMessenger) SendMessage(chanType string, value interface{}) (*entity.NotifyData, error) {
	chanName, err := m.generateHash()
	if err != nil {
		return &entity.NotifyData{}, fmt.Errorf("sendMessage - generateHash: %v", err)
	}

	channel := make(chan interface{})
	notify.Start(chanName, channel)

	err = m.p.Produce(chanType, chanName, value)
	if err != nil {
		return &entity.NotifyData{}, fmt.Errorf("sendMessage - p.Produce: %v", err)
	}

	res := <-channel
	notify.Stop(chanName, channel)

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
