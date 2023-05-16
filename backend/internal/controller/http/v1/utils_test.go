package v1

import (
	"testing"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/bitly/go-notify"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

var mockResponse *entity.NotifyData = &entity.NotifyData{Message: "test message"}

type mockProducer struct{}

func newMockProducer() *mockProducer {
	return &mockProducer{}
}

func (p *mockProducer) Produce(key string, value interface{}) error {
	go func() {
		notify.Post(key, mockResponse)
	}()
	return nil
}

func TestSendMessage(t *testing.T) {
	mockProducer := newMockProducer()
	messenger := newHTTPControllerMessenger(mockProducer, mockProducer, mockProducer)

	reqData := &entity.CreateKeypairRequest{Amount: 1}
	actualData, err := messenger.SendMessage(entity.EnvelopeChannel, reqData)
	assert.NoError(t, err)

	require.EqualValues(t, mockResponse, actualData)
}
