// Package app configures and runs application.
package app

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/CheesecakeLabs/token-factory-v2/backend/config"
	v1 "github.com/CheesecakeLabs/token-factory-v2/backend/internal/controller/http/v1"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase/repo"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/httpserver"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/postgres"
)

// Run creates objects via constructors.
func Run(cfg *config.Config, pg *postgres.Postgres, pKp, pHor, pEnv entity.ProducerInterface) {
	// l := logger.New(cfg.Log.Level)

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
	vaultCategoryUc := usecase.NewVaultCategoryUseCase(
		repo.NewVaultCategoryRepo(pg),
	)
	vaultUc := usecase.NewVaultUseCase(
		repo.NewVaultRepo(pg),
		repo.NewWalletRepo(pg),
	)
	contractUc := usecase.NewContractUseCase(
		repo.NewContractRepo(pg),
	)

	// HTTP Server
	handler := gin.Default()
	v1.NewRouter(handler, pKp, pHor, pEnv, *authUc, *userUc, *walletUc, *assetUc, *roleUc, *rolePermissionUc, *vaultCategoryUc, *vaultUc, *contractUc, cfg.HTTP)
	handler.Use(CORSMiddleware())
	httpServer := httpserver.New(handler,
		httpserver.Port(cfg.HTTP.Port),
		httpserver.ReadTimeout(60*time.Second),
		httpserver.WriteTimeout(60*time.Second),
	)

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
