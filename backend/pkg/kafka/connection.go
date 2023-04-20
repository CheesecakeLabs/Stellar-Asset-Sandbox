package kafka

import (
	"fmt"
	"os"

	"github.com/CheesecakeLabs/token-factory-v2/backend/config"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/bitly/go-notify"
	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/confluentinc/confluent-kafka-go/schemaregistry"
	"github.com/confluentinc/confluent-kafka-go/schemaregistry/serde"
	"github.com/confluentinc/confluent-kafka-go/schemaregistry/serde/jsonschema"
)

type Connection struct {
	Connection   *kafka.ConfigMap
	Consumer     *Consumer
	Producer     *Producer
	Deserializer *Deserializer
}

// New Kafka Connection Struct
func New(cfg config.KafkaConfig) *Connection {
	return &Connection{
		Consumer: &Consumer{
			Topics: cfg.ConsumerTopics,
		},
		Producer: &Producer{
			HorizonTopic:  cfg.HorProducerTopic,
			KeypairTopic:  cfg.KpProducerTopic,
			EnvelopeTopic: cfg.EnvProducerTopic,
		},
		Deserializer: &Deserializer{
			URL:           cfg.SchemaRegistry,
			schemaEnabled: false,
		},
		Connection: &kafka.ConfigMap{
			"bootstrap.servers": cfg.ClientBrokers,
			"group.id":          cfg.ClientGroupId,
			"auto.offset.reset": "earliest",
		},
	}
}

// Create a new Kafka Connection
func (conn *Connection) connect() error {
	var err error

	conn.Consumer.exec, err = kafka.NewConsumer(conn.Connection)
	if err != nil {
		return fmt.Errorf("kafka.NewConsumer: %w", err)
	}

	err = conn.Consumer.exec.SubscribeTopics(conn.Consumer.Topics, nil)

	if err != nil {
		return err
	}

	conn.Producer.exec, err = kafka.NewProducer(conn.Connection)
	if err != nil {
		return fmt.Errorf("kafka.NewProducer: %w", err)
	}

	// Kafka Schema Registry Client
	client, err := schemaregistry.NewClient(schemaregistry.NewConfig(conn.Deserializer.URL))
	if err != nil {
		fmt.Printf("Failed to create schema registry client: %s\n", err)
		os.Exit(1)
	}

	// Kafka Schema Registry Deserializer
	conn.Deserializer.exec, err = jsonschema.NewDeserializer(client, serde.ValueSerde, jsonschema.NewDeserializerConfig())
	if err != nil {
		fmt.Printf("Failed to create deserializer: %s\n", err)
		os.Exit(1)
	}

	return err
}

// AttemptConnect tries to connect to Kafka Cluster
func (c *Connection) AttemptConnect() error {
	err := c.connect()
	if err != nil {
		return fmt.Errorf("kafka.connect: %w", err)
	}

	return nil
}

// This function will run the Kafka Consumer and send the message to the notify channel
func (c Connection) Run(cfg *config.Config, chanName string) {
	for {
		msg, error := c.Consumer.Consumer()
		if error != nil {
			fmt.Println(error)
		}
		if msg != nil {
			data, err := c.Deserializer.DeserializeMessage(msg, chanName)
			if err != nil {
				fmt.Println(err)
				continue
			}

			notify.Post(string(msg.Key), &entity.NotifyData{Key: string(msg.Key), Message: data})
		}
	}
}
