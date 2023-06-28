package v1

import (
	"fmt"
	"net/http"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

func Validate(rP usecase.RolePermissionUseCase) gin.HandlerFunc {
	return func(context *gin.Context) {
		token := context.GetHeader("Authorization")
		validate, err := rP.Validate(token, context.Request.URL.Path)
		fmt.Println(err)
		if validate {
			context.Next()
			return
		}
		context.JSON(http.StatusForbidden, gin.H{"error": "you don't have permission to access this resource"})
		context.Abort()
	}
}
