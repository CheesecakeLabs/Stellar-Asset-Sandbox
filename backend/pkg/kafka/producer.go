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
		//return fmt.Errorf("Producer - Produce - p.exec.Produce: %v", err)
		str1 := []byte(key)
		str2 := key
		str3 := value
		str4 := valueMarshalled
		return fmt.Errorf(fmt.Sprintf("%s%s%s%s", str1,
			str2, str3, str4), err)
	}

	return nil
}
