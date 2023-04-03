// Package app configures and runs application.
package app

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/gin-gonic/gin"

	"github.com/CheesecakeLabs/token-factory-v2/backend/config"
	v1 "github.com/CheesecakeLabs/token-factory-v2/backend/internal/controller/http/v1"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase/repo"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/httpserver"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/postgres"
)

// Run creates objects via constructors.
func Run(cfg *config.Config, pg *postgres.Postgres) {
	//l := logger.New(cfg.Log.Level)

	// Use case
	usecase := usecase.New(
		repo.New(pg),
	)

	// HTTP Server
	handler := gin.New()
	v1.NewRouter(handler, *usecase)
	httpServer := httpserver.New(handler, httpserver.Port(cfg.HTTP.Port))

	// Waiting signal
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt, syscall.SIGTERM)

	select {
	case s := <-interrupt:
		fmt.Printf("app - Run - signal: " + s.String())
	case err := <-httpServer.Notify():
		fmt.Errorf("app - Run - httpServer.Notify: %w", err)
	}

	// Shutdown
	err := httpServer.Shutdown()
	if err != nil {
		fmt.Errorf("app - Run - httpServer.Shutdown: %w", err)
	}
}
