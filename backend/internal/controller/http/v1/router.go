package v1

import (
	"net/http"
	"time"

	"github.com/CheesecakeLabs/token-factory-v2/backend/config"
	docs "github.com/CheesecakeLabs/token-factory-v2/backend/docs"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/logger"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/profanity"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func CORSMiddlewareAllowAllOrigins(l *logger.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "*")
		c.Header("Access-Control-Allow-Methods", "*")

		// Respond to OPTIONS requests
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}

func CORSMiddleware(cfg config.HTTP, l *logger.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", cfg.FrontEndAdress)
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Header("Access-Control-Allow-Methods", "GET, POST, HEAD, PATCH, OPTIONS, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		reqMethod := c.Request.Method
		reqUri := c.Request.RequestURI
		message := "METHOD: " + reqMethod + " URI: " + reqUri + " TIME: " + time.Now().String()
		l.Info(message)

		c.Next()
	}
}

// Swagger spec:
// @title       Token Factory API
// @version     1.0
// @BasePath    /
func NewRouter(
	handler *gin.Engine,
	pKp, pHor, pEnv, pSub, pSig entity.ProducerInterface,
	authUseCase usecase.AuthUseCase,
	userUseCase usecase.UserUseCase,
	walletUseCase usecase.WalletUseCase,
	assetUseCase usecase.AssetUseCase,
	roleUseCase usecase.RoleUseCase,
	rolePermissionUc usecase.RolePermissionUseCase,
	vaultCategoryUc usecase.VaultCategoryUseCase,
	vaultUc usecase.VaultUseCase,
	contractUc usecase.ContractUseCase,
	logUc usecase.LogTransactionUseCase,
	cfg config.HTTP,
	logger *logger.Logger,
	profanityF profanity.ProfanityFilter,
) {
	// Messenger
	messengerController := newHTTPControllerMessenger(pKp, pHor, pEnv, pSub, pSig)
	// Options Gin
	handler.Use(gin.Logger())
	handler.Use(gin.Recovery())
	// Swagger
	docs.SwaggerInfo.BasePath = "/v1"
	handler.GET("v1/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	// K8s probe
	handler.GET("/healthz", func(c *gin.Context) { c.Status(http.StatusOK) })
	// Routers
	handler.Use(CORSMiddleware(cfg, logger))
	groupV1 := handler.Group("/v1")
	{
		newUserRoutes(groupV1, userUseCase, authUseCase, rolePermissionUc, roleUseCase, logger, vaultUc, profanityF)
		newWalletsRoutes(groupV1, walletUseCase, messengerController, authUseCase, logger)
		newAssetsRoutes(groupV1, walletUseCase, assetUseCase, messengerController, authUseCase, logUc, rolePermissionUc, logger, profanityF)
		newRoleRoutes(groupV1, roleUseCase, messengerController, logger, profanityF)
		newRolePermissionsRoutes(groupV1, rolePermissionUc, roleUseCase, messengerController, logger)
		newVaultCategoryRoutes(groupV1, messengerController, authUseCase, vaultCategoryUc, logger, profanityF)
		newVaultRoutes(groupV1, messengerController, authUseCase, vaultUc, vaultCategoryUc, walletUseCase, assetUseCase, logger, profanityF)
		newContractRoutes(groupV1, messengerController, authUseCase, contractUc, vaultUc, assetUseCase, userUseCase, logger)
		newLogTransactionsRoutes(groupV1, walletUseCase, assetUseCase, messengerController, logUc, authUseCase, logger)
		newSorobanRoutes(groupV1, walletUseCase, messengerController, authUseCase)
		newAssetTomlRoutes(groupV1, walletUseCase, assetUseCase, messengerController, authUseCase, logUc, logger, profanityF)
	}
}
