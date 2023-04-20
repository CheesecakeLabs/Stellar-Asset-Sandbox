package kafka

import (
	"encoding/json"
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/confluentinc/confluent-kafka-go/kafka"
)

type Producer struct {
	exec          *kafka.Producer
	HorizonTopic  string
	EnvelopeTopic string
	KeypairTopic  string
}

func (p *Producer) Produce(chanType string, key string, value interface{}) error {
	topic, err := p.getTopic(chanType)
	if err != nil {
		return fmt.Errorf("Producer - Produce - p.getTopic: %v\n", err)
	}

	v, err := json.Marshal(value)
	if err != nil {
		return fmt.Errorf("Producer - Produce - json.Marshal: %v\n", err)
	}

	err = p.exec.Produce(&kafka.Message{
		Key:            []byte(key),
		TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
		Value:          v,
	}, nil)
	if err != nil {
		return fmt.Errorf("Producer - Produce - p.exec.Produce: %v\n", err)
	}

	return nil
}

func (p *Producer) getTopic(chanType string) (topic string, err error) {
	switch chanType {
	case entity.HorizonChannel:
		topic = p.HorizonTopic
	case entity.EnvelopeChannel:
		topic = p.EnvelopeTopic
	case entity.CreateKeypairChannel:
		topic = p.KeypairTopic
	default:
		err = fmt.Errorf("invalid channel type")
	}
	return
}
