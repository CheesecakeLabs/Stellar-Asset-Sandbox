package kafka

import (
	"encoding/json"
	"fmt"

	"github.com/confluentinc/confluent-kafka-go/kafka"
)

type Producer struct {
	exec  *kafka.Producer
	Topic string
}

func (p *Producer) Produce(key string, value interface{}) error {
	valueMarshalled, err := json.Marshal(value)
	if err != nil {
		return fmt.Errorf("Producer - Produce - json.Marshal: %v", err)
	}

	err = p.exec.Produce(&kafka.Message{
		Key:            []byte(key),
		TopicPartition: kafka.TopicPartition{Topic: &p.Topic, Partition: kafka.PartitionAny},
		Value:          valueMarshalled,
	}, nil)

	if err != nil {
		return fmt.Errorf("Producer - Produce - p.exec.Produce: %v", err)
	}

	return nil
}
