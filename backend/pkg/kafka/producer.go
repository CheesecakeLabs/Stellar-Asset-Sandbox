package kafka

import (
	"fmt"
	"time"

	"github.com/confluentinc/confluent-kafka-go/kafka"
)

type Producer struct {
	exec  *kafka.Producer
	Topic string
}

// Produce a message to Kafka Cluster
func (p *Producer) Produce(key string, value string) {
	err := p.exec.Produce(&kafka.Message{
		Key:            []byte(key),
		TopicPartition: kafka.TopicPartition{Topic: &p.Topic, Partition: kafka.PartitionAny},
		Value:          []byte(value),
	}, nil)
	if err != nil {
		if err.(kafka.Error).Code() == kafka.ErrQueueFull {
			// Producer queue is full, wait 1s for messages
			// to be delivered then try again.
			time.Sleep(time.Second)
		}
		fmt.Printf("Failed to produce message: %v\n", err)
	}
}
