package v1

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/logger"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/profanity"
	"github.com/gin-gonic/gin"
)

type role struct {
	roleUseCase         usecase.RoleUseCase
	messengerController HTTPControllerMessenger
	l                   *logger.Logger
	pf 	   profanity.ProfanityFilter
}

func newRoleRoutes(handler *gin.RouterGroup, roleUseCase usecase.RoleUseCase, messengerController HTTPControllerMessenger, l *logger.Logger, pf profanity.ProfanityFilter) {
	r := &role{roleUseCase, messengerController, l, pf}

	h := handler.Group("/role")
	{
		h.GET("", r.list)
		h.POST("", r.createRole)
		h.PUT("/:id", r.updateRole)
		h.POST("/delete/:id", r.deleteRole)
	}
}

// @Summary List
// @Description List role
// @Schemes
// @Tags Role
// @Accept json
// @Produce json
// @Param   type query  string true  "Type"
// @Success 200  {object} []entity.Role
// @Router /role [get]
func (r *role) list(c *gin.Context) {
	roles, err := r.roleUseCase.List()
	if err != nil {
		r.l.Error(err, "http - v1 - list role - bind")
		errorResponse(c, http.StatusInternalServerError, "database problems", err)
	}
	c.JSON(http.StatusOK, roles)
}

// @Summary     Create a new role
// @Description Create a new role
// @Tags  	    Role
// @Accept      json
// @Produce     json
// @Param       request body entity.RoleRequest true "Role info"
// @Success     200 {object} entity.RoleRequest
// @Failure     400 {object} response
// @Failure     404 {object} response
// @Failure     500 {object} response
// @Router      /role [post]
func (r *role) createRole(c *gin.Context) {
	var request entity.RoleRequest
	var err error
	var roleCreated entity.RoleRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		r.l.Error(err, "http - v1 - create role - bind")
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()), err)
		return
	}

	if r.pf.ContainsProfanity(request.Name) {
		r.l.Error(nil, "http - v1 - create role - name profanity")
		errorResponse(c, http.StatusBadRequest, profanityError("Name"), nil)
		return
	}

	roleCreated, err = r.roleUseCase.CreateRole(request)
	if err != nil {
		r.l.Error(err, "http - v1 - create role - create")
		errorResponse(c, http.StatusNotFound, fmt.Sprintf("error: %s", err.Error()), err)
		return
	}

	c.JSON(http.StatusOK, roleCreated)
}

// @Summary     Update a role
// @Description Update a role by providing the Role ID and the updated information.
// @Tags  	    Role
// @Accept      json
// @Produce     json
// @Param       id path string true "Role ID" Format(uuid)
// @Param       request body entity.RoleRequest true "Role info"
// @Success     200 {object} entity.Role "Updated role information"
// @Failure     400 {object} response "Bad Request: Invalid input data"
// @Failure     404 {object} response "Not Found: Role not found"
// @Failure     500 {object} response "Internal Server Error: Failed to update role"
// @Router      /role/{id} [put]
func (r *role) updateRole(c *gin.Context) {
	// Get the ID of the role to be updated from the URL parameters
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		r.l.Error(err, "http - v1 - update role - atoio")
		errorResponse(c, http.StatusBadRequest, "invalid role ID", err)
		return
	}

	var request entity.RoleRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		r.l.Error(err, "http - v1 - update role - bind")
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()), err)
		return
	}

	if r.pf.ContainsProfanity(request.Name) {
		r.l.Error(nil, "http - v1 - update role - name profanity")
		errorResponse(c, http.StatusBadRequest, profanityError("Name"), nil)
		return
	}

	// Find the existing role by its ID
	existingRole, err := r.roleUseCase.GetRoleById(id)
	if err != nil {
		if err.Error() == "RoleRepo - GetRoleById - role not found" {
			r.l.Error(err, "http - v1 - update role - role not found")
			errorResponse(c, http.StatusNotFound, "role not found", err)
			return
		}
		r.l.Error(err, "http - v1 - update role - get role by id")
		errorResponse(c, http.StatusInternalServerError, "error finding role", err)
		return
	}

	// Update the role data
	existingRole.Name = request.Name

	updatedRole, err := r.roleUseCase.UpdateRole(existingRole)
	if err != nil {
		r.l.Error(err, "http - v1 - update role - update role")
		errorResponse(c, http.StatusInternalServerError, "error updating role", err)
		return
	}

	c.JSON(http.StatusOK, updatedRole)
}

// @Summary     Delete a role
// @Description Delete a role by providing the Role ID and the updated information.
// @Tags  	    Role
// @Accept      json
// @Produce     json
// @Param       id path string true "Role ID" Format(uuid)
// @Param       request body entity.RoleRequest true "Role info"
// @Success     200 {object} entity.RoleDelete "Updated role information"
// @Failure     400 {object} response "Bad Request: Invalid input data"
// @Failure     404 {object} response "Not Found: Role not found"
// @Failure     500 {object} response "Internal Server Error: Failed to delete role"
// @Router      /role/{id} [delete]
func (r *role) deleteRole(c *gin.Context) {
	// Get the ID of the role to be delete from the URL parameters
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		r.l.Error(err, "http - v1 - delete role - atoi")
		errorResponse(c, http.StatusBadRequest, "invalid role ID", err)
		return
	}

	var request entity.RoleDeleteRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		r.l.Error(err, "http - v1 - delete role - bind")
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()), err)
		return
	}

	// Find the existing role by its ID
	existingRole, err := r.roleUseCase.GetRoleById(id)
	if err != nil {
		if err.Error() == "RoleRepo - GetRoleById - role not found" {
			r.l.Error(err, "http - v1 - delete role - role not found")
			errorResponse(c, http.StatusNotFound, "role not found", err)
			return
		}
		r.l.Error(err, "http - v1 - delete role - get role by id")
		errorResponse(c, http.StatusInternalServerError, "error finding role", err)
		return
	}

	roleToDelete := entity.RoleDelete{
		Id:             existingRole.Id,
		NewUsersRoleId: request.NewUsersRoleId,
	}

	deletedRole, err := r.roleUseCase.DeleteRole(roleToDelete)
	if err != nil {
		r.l.Error(err, "http - v1 - delete role - delete role")
		errorResponse(c, http.StatusInternalServerError, "error deleting role", err)
		return
	}

	c.JSON(http.StatusOK, deletedRole)
}
