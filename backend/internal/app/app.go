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
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase/repo"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/httpserver"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/postgres"
)

func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Header("Access-Control-Allow-Origin", "http://localhost:3000")
        c.Header("Access-Control-Allow-Credentials", "true")
        c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
        c.Header("Access-Control-Allow-Methods", "GET, POST, HEAD, PATCH, OPTIONS, PUT")
        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }
        c.Next()
    }
}

// Run creates objects via constructors.
func Run(cfg *config.Config, pg *postgres.Postgres, pKp, pHor, pEnv entity.ProducerInterface) {
	//l := logger.New(cfg.Log.Level)

	// Use cases
	authUc := usecase.NewAuthUseCase(
		repo.New(pg), cfg.JWT.SecretKey,
	)
	userUc := usecase.NewUserUseCase(
		repo.New(pg), cfg.JWT.SecretKey,
	)
	walletUc := usecase.NewWalletUseCase(
		repo.NewWalletRepo(pg),
	)
	assetUc := usecase.NewAssetUseCase(
		repo.NewAssetRepo(pg),
		repo.NewWalletRepo(pg),
	)
	roleUc := usecase.NewRoleUseCase(
		repo.NewRoleRepo(pg),
	)
	rolePermissionUc := usecase.NewRolePermissionUseCase(
		repo.NewRolePermissionRepo(pg),
		*userUc,
	)

	// HTTP Server
	handler := gin.New()
	handler.Use(CORSMiddleware())
	v1.NewRouter(handler, pKp, pHor, pEnv, *authUc, *userUc, *walletUc, *assetUc, *roleUc, *rolePermissionUc)
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
