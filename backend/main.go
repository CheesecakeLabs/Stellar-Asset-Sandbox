package main

import (
	"fmt"
	"log"
	"os"

	"github.com/CheesecakeLabs/token-factory-v2/backend/config"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/app"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/kafka"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/postgres"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/toml"
)

func main() {
	// Configuration
	cfg, err := config.NewConfig()
	if err != nil {
		log.Fatalf("Config error: %s", err)
	}
	// Toml
	tRepo := toml.NewTomlGenerator()

	// Postgres
	pg, err := postgres.New(cfg.PG)
	if err != nil {
		log.Fatal(fmt.Errorf("Failed to connect to Postgres: %w", err))
	}
	defer pg.Close()

	// Kafka create keypair connection
	kpConn := kafka.New(cfg.Kafka, cfg.Kafka.CreateKpCfg.ConsumerTopics, cfg.Kafka.CreateKpCfg.ProducerTopic)
	err = kpConn.AttemptConnect()
	if err != nil {
		fmt.Printf("Failed to connect to Kafka create keypair topics %s\n", err)
		os.Exit(1)
	}
	go kpConn.Run(cfg, entity.CreateKeypairChannel)

	// Kafka horizon connection
	horConn := kafka.New(cfg.Kafka, cfg.Kafka.HorizonCfg.ConsumerTopics, cfg.Kafka.HorizonCfg.ProducerTopic)
	err = horConn.AttemptConnect()
	if err != nil {
		fmt.Printf("Failed to connect to Kafka horizon topics %s\n", err)
		os.Exit(1)
	}
	go horConn.Run(cfg, entity.HorizonChannel)

	// Kafka envelope connection
	envConn := kafka.New(cfg.Kafka, cfg.Kafka.EnvelopeCfg.ConsumerTopics, cfg.Kafka.EnvelopeCfg.ProducerTopic)
	err = envConn.AttemptConnect()
	if err != nil {
		fmt.Printf("Failed to connect to Kafka envelopee topics %s\n", err)
		os.Exit(1)
	}
	go envConn.Run(cfg, entity.EnvelopeChannel)

	// Kafka submit transaction connection
	submitConn := kafka.New(cfg.Kafka, cfg.Kafka.SubmitTransactionCfg.ConsumerTopics, cfg.Kafka.SubmitTransactionCfg.ProducerTopic)
	err = submitConn.AttemptConnect()
	if err != nil {
		fmt.Printf("Failed to connect to Kafka submit transaction topics %s\n", err)
		os.Exit(1)
	}
	go submitConn.Run(cfg, entity.SubmitTransactionChannel)

	// Kafka Sign Transaction connection
	signConn := kafka.New(cfg.Kafka, cfg.Kafka.SignTransactionCfg.ConsumerTopics, cfg.Kafka.SignTransactionCfg.ProducerTopic)
	err = signConn.AttemptConnect()
	if err != nil {
		fmt.Printf("Failed to connect to Kafka sign transaction topics %s\n", err)
		os.Exit(1)
	}
	go signConn.Run(cfg, entity.SignChannel)

	app.Run(cfg, pg, kpConn.Producer, horConn.Producer, envConn.Producer, submitConn.Producer, signConn.Producer, tRepo)
}
