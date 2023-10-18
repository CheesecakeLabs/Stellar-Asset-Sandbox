package v1

import (
	"net/http"

	"github.com/CheesecakeLabs/token-factory-v2/backend/config"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	docs "github.com/CheesecakeLabs/token-factory-v2/backend/docs"
)

func CORSMiddleware(cfg config.HTTP) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", cfg.FrontEndAdress)
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

// Swagger spec:
// @title       Token Factory API
// @version     1.0
// @BasePath    /v1
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
	handler.Use(CORSMiddleware(cfg)) // Alow only frontend origin
	groupV1 := handler.Group("/v1")
	{
		newUserRoutes(groupV1, userUseCase, authUseCase, rolePermissionUc)
		newWalletsRoutes(groupV1, walletUseCase, messengerController, authUseCase)
		newAssetsRoutes(groupV1, walletUseCase, assetUseCase, messengerController, authUseCase, logUc)
		newRoleRoutes(groupV1, roleUseCase, messengerController)
		newRolePermissionsRoutes(groupV1, rolePermissionUc, messengerController)
		newVaultCategoryRoutes(groupV1, messengerController, authUseCase, vaultCategoryUc)
		newVaultRoutes(groupV1, messengerController, authUseCase, vaultUc, vaultCategoryUc, walletUseCase, assetUseCase)
		newContractRoutes(groupV1, messengerController, authUseCase, contractUc, vaultUc, assetUseCase)
		newLogTransactionsRoutes(groupV1, walletUseCase, assetUseCase, messengerController, logUc, authUseCase)
		newSorobanRoutes(groupV1, walletUseCase, messengerController, authUseCase)
	}
}
