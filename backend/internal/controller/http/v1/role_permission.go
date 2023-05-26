package v1

import (
	"net/http"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

type rolePermission struct {
	roleUseCase usecase.RoleUseCase
	messengerController HTTPControllerMessenger
}

func Validate(rP usecase.RolePermissionUseCase) gin.HandlerFunc {
	return func(context *gin.Context) {
		token := context.GetHeader("Authorization")
		validate := rP.Validate(token, context.Request.URL.Path)
		if validate {
			context.Next()
			return
		}
		context.JSON(http.StatusForbidden, gin.H{"error": "you don't have permission to access this resource"})
		context.Abort()
	}
}