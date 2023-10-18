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
	messenger := newHTTPControllerMessenger(mockProducer, mockProducer, mockProducer, mockProducer, mockProducer)

	reqData := &entity.CreateKeypairRequest{Amount: 1}
	actualData, err := messenger.SendMessage(entity.EnvelopeChannel, reqData)
	assert.NoError(t, err)

	require.EqualValues(t, mockResponse, actualData)
}

func TestCreateLogDescription(t *testing.T) {
	tests := []struct {
		name        string
		transaction int
		assetCode   string
		setFlags    []string
		clearFlags  []string
		expected    string
	}{
		{"Test Mint Asset", entity.MintAsset, "USDC", nil, nil, "Operation: Mint | Asset Code: USDC"},
		{"Test Burn Asset", entity.BurnAsset, "USDC", nil, nil, "Operation: Burn | Asset Code: USDC"},
		{"Test Update Auth Flags", entity.UpdateAuthFlags, "USDC", []string{"flag1"}, []string{"flag2"}, "Operation: Update Auth Flags | Asset Code: USDC | Set Flags: flag1 | Clear Flags: flag2"},
		{"Test Unrecognized Transaction", 999, "USDC", nil, nil, "Unrecognized transaction type"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			actual := createLogDescription(tt.transaction, tt.assetCode, tt.setFlags, tt.clearFlags)
			if actual != tt.expected {
				t.Errorf("expected: %v, actual: %v", tt.expected, actual)
			}
		})
	}
}
