package kafka

import (
	"github.com/CheesecakeLabs/token-factory-v2/backend/config"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/bitly/go-notify"
	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/confluentinc/confluent-kafka-go/schemaregistry"
	"github.com/confluentinc/confluent-kafka-go/schemaregistry/serde"
	"github.com/confluentinc/confluent-kafka-go/schemaregistry/serde/jsonschema"
	"github.com/sirupsen/logrus"
)

var log = logrus.New()

type Connection struct {
	Connection   *kafka.ConfigMap
	Consumer     *Consumer
	Producer     *Producer
	Deserializer *Deserializer
}

// New Kafka Connection Struct
func New(cfg config.KafkaConfig, consumerTopics []string, producerTopic string) *Connection {
	return &Connection{
		Consumer: &Consumer{
			Topics: consumerTopics,
		},
		Producer: &Producer{
			Topic: producerTopic,
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
		log.Errorf("Failed to initialize Kafka consumer: %v", err)
		return err
	}

	err = conn.Consumer.exec.SubscribeTopics(conn.Consumer.Topics, nil)
	if err != nil {
		log.Errorf("Failed to subscribe to Kafka topics: %v", err)
		return err
	}

	conn.Producer.exec, err = kafka.NewProducer(conn.Connection)
	if err != nil {
		log.Errorf("Failed to initialize Kafka producer: %v", err)
		return err
	}

	// Kafka Schema Registry Client
	client, err := schemaregistry.NewClient(schemaregistry.NewConfig(conn.Deserializer.URL))
	if err != nil {
		log.Errorf("Failed to create schema registry client: %v", err)
		return err
	}

	// Kafka Schema Registry Deserializer
	conn.Deserializer.exec, err = jsonschema.NewDeserializer(client, serde.ValueSerde, jsonschema.NewDeserializerConfig())
	if err != nil {
		log.Errorf("Failed to create schema registry deserilizer: %v", err)
		return err
	}

	return err
}

// AttemptConnect tries to connect to Kafka Cluster
func (c *Connection) AttemptConnect() error {
	err := c.connect()
	if err != nil {
		log.Warn("failed to connect", err)
		return err
	}

	return nil
}

// This function will run the Kafka Consumer and send the message to the notify channel
func (c Connection) Run(cfg *config.Config, chanName string) {
	for {
		msg, error := c.Consumer.Consumer()
		if error != nil {
			log.Errorf("Failed consumer event, : %v", error)
		}
		if msg != nil {
			data, err := c.Deserializer.DeserializeMessage(msg, chanName)
			if err != nil {
				log.Errorf("Failed to deserialize message: %v", err)
				continue
			}
			err = notify.Post(string(msg.Key), &entity.NotifyData{Key: string(msg.Key), Message: data})
			if err != nil {
				log.Errorf("Failed to post message: %v", err)
				continue
			}
		}
	}
}
