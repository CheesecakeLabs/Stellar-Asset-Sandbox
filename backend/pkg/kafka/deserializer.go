package kafka

import (
	"encoding/json"
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/confluentinc/confluent-kafka-go/schemaregistry/serde/jsonschema"
)

type Deserializer struct {
	schemaEnabled bool
	exec          *jsonschema.Deserializer
	URL           string
}

func (d *Deserializer) DeserializeMessage(msg *kafka.Message, chanName string) (interface{}, error) {
	switch chanName {
	case entity.CreateKeypairChannel:
		return d.deserializeCreateKpMessage(msg)
	default:
		return nil, fmt.Errorf("invalid channel name: %s", chanName)
	}
}

func (d *Deserializer) deserializeCreateKpMessage(msg *kafka.Message) (entity.CreateKeypairResponse, error) {
	data := entity.CreateKeypairResponse{}
	err := d.unmarshalMessage(msg, &data)
	if err != nil {
		return data, fmt.Errorf("failed to deserialize envelope request: %w", err)
	}
	return data, nil
}

func (d *Deserializer) unmarshalMessage(msg *kafka.Message, v interface{}) error {
	if d.schemaEnabled {
		return d.exec.DeserializeInto(*msg.TopicPartition.Topic, msg.Value, v)
	}
	return json.Unmarshal(msg.Value, v)
}
