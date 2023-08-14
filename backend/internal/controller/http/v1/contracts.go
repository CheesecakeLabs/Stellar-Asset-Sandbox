package v1

import (
	"fmt"
	"net/http"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

type contractRoutes struct {
	m  HTTPControllerMessenger
	a  usecase.AuthUseCase
	c  usecase.ContractUseCase
	v  usecase.VaultUseCase
	as usecase.AssetUseCase
}

func newContractRoutes(handler *gin.RouterGroup, m HTTPControllerMessenger, a usecase.AuthUseCase, c usecase.ContractUseCase, v usecase.VaultUseCase,
	as usecase.AssetUseCase) {
	r := &contractRoutes{m, a, c, v, as}
	h := handler.Group("/contract").Use(Auth(r.a.ValidateToken()))
	{
		h.GET("/:id", r.getContractById)
		h.POST("", r.createContract)
		h.GET("list", r.getAllContracts)
	}
}

type CreateContractRequest struct {
	Name        string `json:"name" binding:"required" example:"Treasury"`
	AssetId     string `json:"asset_id"   binding:"required"  example:"1"`
	VaultId     string `json:"vault_id"   binding:"required"  example:"1"`
	Address     string `json:"address"   binding:"required"  example:"GSDSC..."`
	YieldRate   int    `json:"yield_rate"   binding:"required"  example:"1"`
	Term        int    `json:"term"   binding:"required"  example:"1"`
	MinDeposit  int    `json:"min_deposit"   binding:"required"  example:"1"`
	PenaltyRate int    `json:"penalty_rate"   binding:"required"  example:"1"`
}

// @Summary     Create a new contract
// @Description Create new contract
// @Tags  	    Contract
// @Accept      json
// @Produce     json
// @Param       request body CreateContractRequest true "Contract info"
// @Success     200 {object} entity.Contract
// @Failure     400 {object} response
// @Failure     404 {object} response
// @Failure     500 {object} response
// @Router      /contract [post]
func (r *contractRoutes) createContract(c *gin.Context) {
	var request CreateContractRequest
	var err error

	if err := c.ShouldBindJSON(&request); err != nil {
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()))
		return
	}

	asset, err := r.as.GetById(request.AssetId)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "asset not found")
		return
	}

	vault, err := r.v.GetById(request.VaultId)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "vault not found")
		return
	}

	contract := entity.Contract{
		Name:        request.Name,
		Address:     request.Address,
		Asset:       asset,
		Vault:       vault,
		YieldRate:   request.YieldRate,
		Term:        request.Term,
		MinDeposit:  request.MinDeposit,
		PenaltyRate: request.PenaltyRate,
	}

	contract, err = r.c.Create(contract)
	if err != nil {
		errorResponse(c, http.StatusNotFound, fmt.Sprintf("error: %s", err.Error()))
		return
	}

	c.JSON(http.StatusOK, contract)
}

// @Summary Get all contract
// @Description Get all contract
// @Tags  	    Contract
// @Accept      json
// @Produce     json
// @Success     200 {object} []entity.Contract
// @Failure     500 {object} response
// @Router      / [get]
func (r *contractRoutes) getAllContracts(c *gin.Context) {
	contract, err := r.v.GetAll()
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "error getting contract")
		return
	}

	c.JSON(http.StatusOK, contract)
}

// @Summary Get contract
// @Description Get contract
// @Tags  	    Contract
// @Accept      json
// @Produce     json
// @Success     200 {object} entity.Contract
// @Failure     500 {object} response
// @Router      / [get]
func (r *contractRoutes) getContractById(c *gin.Context) {
	userid := c.Param("id")
	contract, err := r.v.GetById(userid)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "error getting contract")
		return
	}

	c.JSON(http.StatusOK, contract)
}
