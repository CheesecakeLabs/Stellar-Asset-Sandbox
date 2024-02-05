package v1

import (
	"fmt"
	"net/http"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/logger"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/profanity"
	"github.com/gin-gonic/gin"
)

type vaultCategoryRoutes struct {
	m  HTTPControllerMessenger
	a  usecase.AuthUseCase
	vc usecase.VaultCategoryUseCase
	l  *logger.Logger
	pf 	   profanity.ProfanityFilter
}

func newVaultCategoryRoutes(handler *gin.RouterGroup, m HTTPControllerMessenger, a usecase.AuthUseCase, vc usecase.VaultCategoryUseCase, l *logger.Logger, pf profanity.ProfanityFilter) {
	r := &vaultCategoryRoutes{m, a, vc, l, pf}
	h := handler.Group("/vault-category").Use(Auth(r.a.ValidateToken()))
	{
		h.GET("", r.getAllVaultCategories)
		h.POST("", r.createVaultCategory)
	}
}

type CreateVaultCategoryRequest struct {
	Name  string `json:"name"       binding:"required"  example:"Treasury"`
	Theme string `json:"theme"      example:"blue"`
}

// @Summary     Create a new vault category
// @Description Create and issue a new asset on Stellar
// @Tags  	    Vault Category
// @Accept      json
// @Produce     json
// @Param       request body CreateVaultCategoryRequest true "Vault Category info"
// @Success     200 {object} entity.VaultCategory
// @Failure     400 {object} response
// @Failure     404 {object} response
// @Failure     500 {object} response
// @Router      /vault-category [post]
func (r *vaultCategoryRoutes) createVaultCategory(c *gin.Context) {
	var request CreateVaultCategoryRequest
	var err error

	if err := c.ShouldBindJSON(&request); err != nil {
		r.l.Error(err, "http - v1 - create vault category - bind")
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()), err)
		return
	}

	if r.pf.ContainsProfanity(request.Name) {
		r.l.Error(nil, "http - v1 - create vault category - name profanity")
		errorResponse(c, http.StatusBadRequest, "name not allowed", nil)
		return
	}


	vaultCategory := entity.VaultCategory{
		Name:  request.Name,
		Theme: &request.Theme,
	}

	vaultCategory, err = r.vc.Create(vaultCategory)
	if err != nil {
		r.l.Error(err, "http - v1 - create vault category - create")
		errorResponse(c, http.StatusNotFound, "database problems", err)
		return
	}

	c.JSON(http.StatusOK, vaultCategory)
}

// @Summary Get all vault categories
// @Description Get all vault categories
// @Tags  	    Vault category
// @Accept      json
// @Produce     json
// @Success     200 {object} []entity.VaultCategory
// @Failure     500 {object} response
// @Router      /vault-category [get]
func (r *vaultCategoryRoutes) getAllVaultCategories(c *gin.Context) {
	vaultCategories, err := r.vc.GetAll()
	if err != nil {
		r.l.Error(err, "http - v1 - get all vault categories - get all")
		errorResponse(c, http.StatusInternalServerError, "error getting vault categories", err)
		return
	}

	c.JSON(http.StatusOK, vaultCategories)
}
