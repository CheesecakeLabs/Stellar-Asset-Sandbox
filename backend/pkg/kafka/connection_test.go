package kafka

import (
	"fmt"
	"os"
	"testing"

	"github.com/CheesecakeLabs/token-factory-v2/backend/config"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/confluentinc/confluent-kafka-go/kafka"
)

func TestAttemptConnect(t *testing.T) {
	mockCluster, err := kafka.NewMockCluster(1)
	if err != nil {
		fmt.Printf("Failed to create MockCluster: %s\n", err)
		os.Exit(1)
	}
	defer mockCluster.Close()

	broker := mockCluster.BootstrapServers()
	cfg := &config.Config{
		Kafka: config.KafkaConfig{
			ClientBrokers: broker,
			ClientGroupId: "test",
		},
	}

	cfg.Kafka.CreateKpCfg.ConsumerTopics = []string{"consumer"}
	cfg.Kafka.CreateKpCfg.ProducerTopic = "producer"

	conn := New(cfg.Kafka, cfg.Kafka.CreateKpCfg.ConsumerTopics, cfg.Kafka.CreateKpCfg.ProducerTopic)
	err = conn.AttemptConnect()
	if err != nil {
		t.Errorf("Failed to connect to Kafka: %s\n", err)
	}

	p, err := kafka.NewProducer(&kafka.ConfigMap{"bootstrap.servers": broker})
	if err != nil {
		fmt.Printf("Failed to create producer: %s\n", err)
		os.Exit(1)
	}

	go conn.Run(cfg, entity.CreateKeypairChannel)

	deliveryChan := make(chan kafka.Event)
	topic := "Stellar"
	value := `{
		"params": {
		 "asset":{
			"code":"USD",
			"issuer":"GA6WEPEY4DTLGGQJOMD2VVIACJYGCPARE64BK3SINAXQMBRB72IRQR7E"
		 },
		 "account_id":"GBPJSWOXKVTWFFH4RHRHJQQRNNF2HQON4QX2K2D6GYSK6MDWDYDCNXL4",
		 "destination_id":"GDVDSZIMVAZLQ4WZ5RTEXDZ5P6ZZ4FQUOV4NK37GVLIIDN6EEO74FBAE",
		 "amount":"10"
	  }
	  }
	  `

	err = p.Produce(&kafka.Message{
		TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
		Value:          []byte(value),
		Headers:        []kafka.Header{{Key: "Transaction.Type", Value: []byte("CreatePayment")}},
	}, deliveryChan)
	if err != nil {
		// Handle the error appropriately
		log.Fatalf("Failed to produce message: %v", err)
	}
	e := <-deliveryChan
	m := e.(*kafka.Message)

	if m.TopicPartition.Error != nil {
		fmt.Printf("Delivery failed: %v\n", m.TopicPartition.Error)
	} else {
		fmt.Printf("Delivered message to topic %s [%d] at offset %v\n",
			*m.TopicPartition.Topic, m.TopicPartition.Partition, m.TopicPartition.Offset)
	}

	close(deliveryChan)

	// c, err := kafka.NewConsumer(&kafka.ConfigMap{
	// 	"bootstrap.servers":     broker,
	// 	"broker.address.family": "v4",
	// 	"group.id":              "group",
	// 	"session.timeout.ms":    6000,
	// 	"auto.offset.reset":     "earliest",
	// })
	// if err != nil {
	// 	fmt.Fprintf(os.Stderr, "Failed to create consumer: %s\n", err)
	// 	os.Exit(1)
	// }
	// defer c.Close()

	// fmt.Printf("Created Consumer %v\n", c)

	// err = c.SubscribeTopics([]string{topic}, nil)
	// if err != nil {
	// 	fmt.Fprintf(os.Stderr, "Failed to subscribe to consumer: %s\n", err)
	// 	os.Exit(1)
	// }

	// msg, err := c.ReadMessage(-1)
	// if err != nil {
	// 	fmt.Fprintf(os.Stderr, "Failed to read message: %s\n", err)
	// 	os.Exit(1)
	// }

	// fmt.Println("received message: ", string(msg.Value))
}
