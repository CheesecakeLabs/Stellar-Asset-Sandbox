package v1

import (
	"fmt"
	"net/http"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
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
		h.GET("/user-permissions", r.userPermissions)
		h.GET("/roles-permissions", r.rolesPermissions)
		h.GET("/permissions", r.permissions)
		h.PUT("/roles-permissions", r.updateRolesPermissions)
	}
}

type RolePermissionRequest struct {
	RoleId       int  `json:"role_id" example:"1"`
	PermissionId int  `json:"permission_id" example:"1"`
	IsAdd        bool `json:"is_add" example:"false"`
}

// @Summary User permissions
// @Description User permissions
// @Schemes
// @Tags RolePermissions
// @Accept json
// @Produce json
// @Success 200  {object} []entity.UserPermissionResponse
// @Router /role-permission/user-permissions [get]
func (r *rolePermissions) userPermissions(c *gin.Context) {
	token := c.GetHeader("Authorization")
	rolePermissions, err := r.rolePermissionUseCase.GetUserPermissions(token)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "database problems", err)
	}
	c.JSON(http.StatusOK, rolePermissions)
}

// @Summary Roles permissions
// @Description Roles permissions
// @Schemes
// @Tags RolePermissions
// @Accept json
// @Produce json
// @Success 200  {object} []entity.RolePermissionResponse
// @Router /role-permission/role-permissions [get]
func (r *rolePermissions) rolesPermissions(c *gin.Context) {
	rolePermissions, err := r.rolePermissionUseCase.GetRolesPermissions()
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "database problems", err)
	}
	c.JSON(http.StatusOK, rolePermissions)
}

// @Summary Permissions
// @Description permissions
// @Schemes
// @Tags Permissions
// @Accept json
// @Produce json
// @Success 200  {object} []entity.Permission
// @Router /role-permission/permissions [get]
func (r *rolePermissions) permissions(c *gin.Context) {
	permissions, err := r.rolePermissionUseCase.GetPermissions()
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "database problems", err)
	}
	c.JSON(http.StatusOK, permissions)
}

// @Summary     Update roles permissions
// @Description Update roles permissions
// @Tags  	    RolesPermissions
// @Accept      json
// @Produce     json
// @Param       request body RolePermissionRequest true "Roles permissions information"
// @Success     200 {object} RolePermissionRequest "Updated roles permissions information"
// @Failure     400 {object} response "Bad Request: Invalid input data"
// @Failure     500 {object} response "Internal Server Error: Failed to update roles permissions"
// @Router      /role-permission [put]
func (r *rolePermissions) updateRolesPermissions(c *gin.Context) {
	var request []RolePermissionRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()), err)
		return
	}

	for _, rolePermission := range request {
		newRolePermission := entity.RolePermissionRequest{
			RoleId:       rolePermission.RoleId,
			PermissionId: rolePermission.PermissionId,
			IsAdd:        rolePermission.IsAdd,
		}
		_, err := r.rolePermissionUseCase.UpdateRolePermission(newRolePermission)
		if err != nil {
			errorResponse(c, http.StatusNotFound, "error to update role permission", err)
			return
		}
	}

	c.JSON(http.StatusOK, entity.RolePermissionRequest{})
}
