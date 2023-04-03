package main

import (
	"fmt"
	"log"
	"os"

	"github.com/CheesecakeLabs/token-factory-v2/backend/config"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/app"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/kafka"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/postgres"
)

func main() {
	// Configuration
	cfg, err := config.NewConfig()
	if err != nil {
		log.Fatalf("Config error: %s", err)
	}

	// Postgres
	pg, err := postgres.New(cfg.PG)
	if err != nil {
		log.Fatal(fmt.Errorf("Failed to connect to Postgres: %w", err))
	}
	defer pg.Close()

	// If Kafka is enabled, attempt to connect to it
	if cfg.Kafka.ClientBrokers != "" {
		conn := kafka.New(cfg.Kafka)
		err := conn.AttemptConnect()
		if err != nil {
			fmt.Printf("Failed to connect to Kafka: %s\n", err)
			os.Exit(1)
		}

		go conn.Run(cfg)
	}

	app.Run(cfg, pg)
}
