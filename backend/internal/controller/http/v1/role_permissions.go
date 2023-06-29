package v1

import (
	"net/http"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

type rolePermissions struct {
	rolePermissionUseCase usecase.RolePermissionUseCase
	messengerController   HTTPControllerMessenger
}

func newRolePermissionsRoutes(handler *gin.RouterGroup, rolePermissionUseCase usecase.RolePermissionUseCase, messengerController HTTPControllerMessenger) {
	r := &rolePermissions{rolePermissionUseCase, messengerController}

	h := handler.Group("/role-permissions")
	{
		h.GET("/permissions", r.rolePermissions)
	}
}

// @Summary Role permissions
// @Description Role permissions
// @Schemes
// @Tags RolePermissions
// @Accept json
// @Produce json
// @Success 200  {object} []entity.RolePermissionResponse
// @Router /role-permission/permissions [get]
func (r *rolePermissions) rolePermissions(c *gin.Context) {
	token := c.GetHeader("Authorization")
	rolePermissions, err := r.rolePermissionUseCase.GetRolePermissions(token)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "database problems")
	}
	c.JSON(http.StatusOK, rolePermissions)
}
