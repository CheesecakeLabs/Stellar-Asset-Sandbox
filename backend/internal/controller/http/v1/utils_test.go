package v1

// import (
// 	"fmt"
// 	"testing"

// 	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
// 	"github.com/bitly/go-notify"
// 	"github.com/stretchr/testify/assert"
// 	"github.com/stretchr/testify/require"
// )

// type mockProducer struct{}

// func newMockProducer() *mockProducer {
// 	return &mockProducer{}
// }

// func (p *mockProducer) Produce(chanType string, key string, value interface{}) error {
// 	fmt.Println("oi")
// 	notify.Post(key, value)
// 	return nil
// }

// func TestSendMessage(t *testing.T) {
// 	mockProducer := newMockProducer()
// 	messenger := newHTTPControllerMessenger(mockProducer)

// 	expectedData := &entity.NotifyData{Message: "test message"}
// 	actualData, err := messenger.SendMessage("test", expectedData)
// 	assert.NoError(t, err)

// 	// Verify that the producer received the correct message

// 	// Verify that the messenger returned the correct data
// 	require.EqualValues(t, expectedData, actualData)
// }
