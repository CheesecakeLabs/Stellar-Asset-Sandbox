package v1

import (
	"net/http"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

type role struct {
	roleUseCase         usecase.RoleUseCase
	messengerController HTTPControllerMessenger
}

func newRoleRoutes(handler *gin.RouterGroup, roleUseCase usecase.RoleUseCase, messengerController HTTPControllerMessenger) {
	r := &role{roleUseCase, messengerController}

	h := handler.Group("/role")
	{
		h.GET("", r.list)
	}
}

// @Summary List
// @Description List role
// @Schemes
// @Tags Role
// @Accept json
// @Produce json
// @Param   type     query    string     true        "Type"
// @Success 200  {object} []entity.Role
// @Router /role [get]
func (r *role) list(c *gin.Context) {
	roles, err := r.roleUseCase.List()
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "database problems")
	}
	c.JSON(http.StatusOK, roles)
}
