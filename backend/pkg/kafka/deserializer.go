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
	case entity.HorizonChannel:
		return d.deserializeHorizonMessage(msg)
	case entity.EnvelopeChannel:
		return d.deserializeEnvelopeMessage(msg)
	case entity.SignChannel:
		return d.deserializeEnvelopSorobanTransaction(msg)
	case entity.SubmitTransactionChannel:
		return d.deserializeEnvelopeMessage(msg)
	default:
		return nil, fmt.Errorf("invalid channel name: %s", chanName)
	}
}

func (d *Deserializer) deserializeCreateKpMessage(msg *kafka.Message) (entity.CreateKeypairResponse, error) {
	data := entity.CreateKeypairResponse{}
	err := d.unmarshalMessage(msg, &data)
	if err != nil {
		return data, fmt.Errorf("failed to deserialize create keypair response: %w", err)
	}
	return data, nil
}

func (d *Deserializer) deserializeHorizonMessage(msg *kafka.Message) (entity.HorizonResponse, error) {
	data := entity.HorizonResponse{}
	err := d.unmarshalMessage(msg, &data)
	if err != nil {
		return data, fmt.Errorf("failed to deserialize horizon response: %w", err)
	}
	return data, nil
}

func (d *Deserializer) deserializeEnvelopeMessage(msg *kafka.Message) (entity.EnvelopeResponse, error) {
	data := entity.EnvelopeResponse{}
	err := d.unmarshalMessage(msg, &data)
	if err != nil {
		return data, fmt.Errorf("failed to deserialize envelope response: %w", err)
	}
	return data, nil
}

func (d *Deserializer) deserializeEnvelopSorobanTransaction(msg *kafka.Message) (entity.SignTransactionRequest, error) {
	data := entity.SignTransactionRequest{}
	err := d.unmarshalMessage(msg, &data)
	if err != nil {
		return data, fmt.Errorf("failed to deserialize envelope response: %w", err)
	}
	return data, nil
}

func (d *Deserializer) unmarshalMessage(msg *kafka.Message, v interface{}) error {
	if d.schemaEnabled {
		return d.exec.DeserializeInto(*msg.TopicPartition.Topic, msg.Value, v)
	}
	return json.Unmarshal(msg.Value, v)
}
