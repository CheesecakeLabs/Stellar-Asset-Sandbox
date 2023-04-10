package config

import (
	"log"

	"github.com/ilyakaznacheev/cleanenv"
	"github.com/joho/godotenv"
)

type (
	Config struct {
		Kafka KafkaConfig
		PG    PGConfig
		HTTP  HTTP
		JWT   JWT
	}

	KafkaConfig struct {
		ClientGroupId  string   `env:"KAFKA_CLIENT_GROUP_ID"`
		ClientBrokers  string   `env:"KAFKA_CLIENT_BROKERS"`
		ConsumerTopics []string `env:"KAFKA_CONSUMER_TOPICS"`
		ProducerTopic  string   `env:"KAFKA_PRODUCER_TOPIC"`
		SchemaRegistry string   `env:"KAFKA_SCHEMA_REGISTRY_URL"`
	}

	PGConfig struct {
		Host     string `env-required:"true" env:"PG_HOST"`
		Port     int    `env-required:"true" env:"PG_PORT"`
		User     string `env-required:"true" env:"PG_USER"`
		Password string `env-required:"true" env:"PG_PASSWORD"`
		DBName   string `env-required:"true" env:"PG_DB_NAME"`
	}

	HTTP struct {
		Port string `env-required:"true" yaml:"port" env:"HTTP_PORT"`
	}

	JWT struct {
		SecretKey string `env-required:"true" env:"JWT_SECRET_KEY"`
	}
)

// NewConfig returns app config.
func NewConfig() (*Config, error) {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	cfg := &Config{}
	err = cleanenv.ReadEnv(cfg)
	if err != nil {
		return nil, err
	}

	return cfg, nil
}
