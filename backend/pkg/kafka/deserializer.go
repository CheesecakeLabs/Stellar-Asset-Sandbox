package kafka

import (
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/confluentinc/confluent-kafka-go/schemaregistry/serde/jsonschema"
)

type Deserializer struct {
	exec *jsonschema.Deserializer
	URL  string
}

// Deserialize a message check the transaction type and return the message
func (d *Deserializer) deserializeMessage(msg *kafka.Message) entity.ParserInput {
	data := entity.ParserInput{}

	err := d.exec.DeserializeInto(*msg.TopicPartition.Topic, msg.Value, &data)
	if err != nil {
		fmt.Printf("Failed to deserialize payload: %s\n", err)
	} else {
		return data
	}

	return entity.ParserInput{}
}
