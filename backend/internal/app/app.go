// Package app configures and runs application.
package app

import (
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/CheesecakeLabs/token-factory-v2/backend/config"
	v1 "github.com/CheesecakeLabs/token-factory-v2/backend/internal/controller/http/v1"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase/repo"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase/service"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/httpserver"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/logger"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/postgres"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/profanity"
	sentryPkg "github.com/CheesecakeLabs/token-factory-v2/backend/pkg/sentry"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/storage"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/toml"
	"github.com/getsentry/sentry-go"
	sentrygin "github.com/getsentry/sentry-go/gin"
	"github.com/gin-gonic/gin"

	timeout "github.com/vearne/gin-timeout"
)

// Run creates objects via constructors.
func Run(cfg *config.Config, pg *postgres.Postgres, pKp, pHor, pEnv, pSub, pSig entity.ProducerInterface, tRepo *toml.DefaultTomlGenerator, storageService storage.StorageService) {
	// Logger and Sentry
	l := logger.New(cfg.Log.Level)
	if cfg.Deploy.DeployStage != "local" {
		sentryPkg.New(cfg, l)
	}

	pf := profanity.ProfanityFilter{}

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
		tRepo,
		repo.NewTomlRepo(pg),
		cfg.Horizon,
		service.NewAssetService(storageService),
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
	logUc := usecase.NewLogTransactionUseCase(
		repo.NewLogTransactionRepo(pg),
	)

	// Setup data
	err := SetupData(cfg, userUc, roleUc)
	if err != nil {
		sentry.CaptureException(err)
		l.Error(err, "app - Run - SetupData")
	}

	// HTTP Server
	handler := gin.Default()
	handler.Use(timeout.Timeout(timeout.WithTimeout(50 * time.Second)))
	if cfg.Deploy.DeployStage == "production" {
		handler.Use(sentrygin.New(sentrygin.Options{}))
	}
	v1.NewRouter(handler, pKp, pHor, pEnv, pSub, pSig, *authUc, *userUc, *walletUc, *assetUc, *roleUc, *rolePermissionUc, *vaultCategoryUc, *vaultUc, *contractUc, *logUc, cfg.HTTP, l, pf)
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
		l.Warn(s.String())
		sentry.CaptureMessage(s.String())
	case err := <-httpServer.Notify():
		sentry.CaptureException(err)
		l.Error(err, "app - Run - httpServer.Notify")
	}

	// Shutdown
	err = httpServer.Shutdown()
	if err != nil {
		sentry.CaptureException(err)
		l.Fatal("app - Run - httpServer.Shutdown: %v", err)
	}
}


func SetupData(cfg *config.Config, userUc *usecase.UserUseCase, roleUc *usecase.RoleUseCase) (error) {
	superAdminRole, err := roleUc.GetSuperAdminRole()
	if err != nil {
		return err
	}

	// Check if the super admin user already exists
	existingSuperAdmin, err := userUc.GetSuperAdminUsers()
	if err != nil {
		return err
	}

	// If a super admin user already exists, no need to create a new one
	if len(existingSuperAdmin) != 0 {
		return nil
	}

	// If no super admin user exists, create one
	superadmin := entity.User{
		Name:     "Super Administrator",
		RoleId:   superAdminRole.Id,
		Password: cfg.DefaultData.SuperAdminPassword,
		Email:    cfg.DefaultData.SuperAdminEmail,
	}

	return userUc.CreateUser(superadmin)
}
