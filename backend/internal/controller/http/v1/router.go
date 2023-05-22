package v1

import (
	"net/http"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	docs "github.com/CheesecakeLabs/token-factory-v2/backend/docs"
)

// Swagger spec:
// @title       Token Factory API
// @version     1.0
// @BasePath    /v1
func NewRouter(
	handler *gin.Engine,
	pKp, pHor, pEnv entity.ProducerInterface,
	authUseCase usecase.AuthUseCase,
	userUseCase usecase.UserUseCase,
	walletUseCase usecase.WalletUseCase,
	assetUseCase usecase.AssetUseCase,
	roleUseCase usecase.RoleUseCase,
) {
	// Options
	handler.Use(gin.Logger())
	handler.Use(gin.Recovery())

	// Swagger
	docs.SwaggerInfo.BasePath = "/v1"
	handler.GET("v1/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// K8s probe
	handler.GET("/healthz", func(c *gin.Context) { c.Status(http.StatusOK) })

	// Routers
	groupV1 := handler.Group("/v1")
	messengerController := newHTTPControllerMessenger(pKp, pHor, pEnv)
	{
		newUserRoutes(groupV1, userUseCase, authUseCase)
		newWalletsRoutes(groupV1, walletUseCase, messengerController)
		newAssetsRoutes(groupV1, walletUseCase, assetUseCase, messengerController)
		newRoleRoutes(groupV1, roleUseCase, messengerController)
	}
}
