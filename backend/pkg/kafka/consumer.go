package kafka

import (
	"fmt"
	"os"

	"github.com/confluentinc/confluent-kafka-go/kafka"
)

type Consumer struct {
	exec   *kafka.Consumer
	Topics []string
}

// Consume a message from Kafka Cluster
func (s *Consumer) Consumer() (*kafka.Message, error) {
	ev := s.exec.Poll(100)
	if ev == nil {
		return nil, nil
	}

	switch e := ev.(type) {
	case *kafka.Message:
		return e, nil

	case kafka.Error:
		fmt.Fprintf(os.Stderr, "%% Error: %v: %v\n", e.Code(), e)
		if e.Code() == kafka.ErrAllBrokersDown {
			return nil, e
		}

	default:
		fmt.Printf("Ignored %v\n", e)
	}

	return nil, nil
}
