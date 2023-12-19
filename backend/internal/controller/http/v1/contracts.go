package v1

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/logger"
	"github.com/gin-gonic/gin"
)

type contractRoutes struct {
	m  HTTPControllerMessenger
	a  usecase.AuthUseCase
	c  usecase.ContractUseCase
	v  usecase.VaultUseCase
	as usecase.AssetUseCase
	u  usecase.UserUseCase
	l  *logger.Logger
}

func newContractRoutes(handler *gin.RouterGroup, m HTTPControllerMessenger, a usecase.AuthUseCase, c usecase.ContractUseCase, v usecase.VaultUseCase,
	as usecase.AssetUseCase, u usecase.UserUseCase, l *logger.Logger,
) {
	r := &contractRoutes{m, a, c, v, as, u, l}
	h := handler.Group("/contract").Use(Auth(r.a.ValidateToken()))
	{
		h.GET("/:id", r.getContractById)
		h.POST("", r.createContract)
		h.GET("/list", r.getAllContracts)
		h.GET("/history/:contractId", r.getContractHistory)
		h.POST("/history/", r.addContractHistory)
		h.PUT("/history/", r.updateContractHistory)
	}
}

type CreateContractRequest struct {
	Name        string `json:"name" binding:"required" example:"Treasury"`
	AssetId     string `json:"asset_id"   binding:"required"  example:"1"`
	VaultId     string `json:"vault_id"   binding:"required"  example:"1"`
	Address     string `json:"address"   binding:"required"  example:"GSDSC..."`
	YieldRate   int    `json:"yield_rate"   binding:"required"  example:"1"`
	Term        int    `json:"term"   binding:"required"  example:"60"`
	MinDeposit  int    `json:"min_deposit"   binding:"required"  example:"1"`
	PenaltyRate int    `json:"penalty_rate"   binding:"required"  example:"1"`
	Compound    int    `json:"compound"  example:"1"`
}

type AddContractHistoryRequest struct {
	DepositAmount float64 `json:"deposit_amount"   binding:"required"  example:"100"`
	ContractId    int     `json:"contract_id"   binding:"required"  example:"GSDSC..."`
}

type UpdateContractHistoryRequest struct {
	WithdrawAmount float64 `json:"withdraw_amount"   binding:"required"  example:"100"`
	ContractId     int     `json:"contract_id"   binding:"required"  example:"GSDSC..."`
}

type PaginatedContractsResponse struct {
	Contracts  []entity.Contract `json:"contracts"`
	TotalPages int               `json:"totalPages"`
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
		r.l.Error(err, "http - v1 - create contract - ShouldBindJSON")
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()), err)
		return
	}

	asset, err := r.as.GetById(request.AssetId)
	if err != nil {
		r.l.Error(err, "http - v1 - create contract - GetById")
		errorResponse(c, http.StatusNotFound, "asset not found", err)
		return
	}

	vaultId, err := strconv.Atoi(request.VaultId)
	if err != nil {
		r.l.Error(err, "http - v1 - create contract - Atoi")
		errorResponse(c, http.StatusBadRequest, "invalid vault ID", err)
		return
	}

	vault, err := r.v.GetById(vaultId)
	if err != nil {
		r.l.Error(err, "http - v1 - create contract - GetById")
		errorResponse(c, http.StatusNotFound, "vault not found", err)
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
		Compound:    request.Compound,
	}

	contract, err = r.c.Create(contract)
	if err != nil {
		r.l.Error(err, "http - v1 - create contract - Create")
		errorResponse(c, http.StatusNotFound, fmt.Sprintf("error: %s", err.Error()), err)
		return
	}

	c.JSON(http.StatusOK, contract)
}

// @Summary Get all contracts
// @Description Retrieve a list of all contracts, with optional pagination
// @Tags  	    Contract
// @Accept      json
// @Produce     json
// @Param       page query int false "Page number for pagination"
// @Param       limit query int false "Number of items per page for pagination"
// @Success     200 {object} []entity.Contract
// @Failure     400 {object} response "Invalid query parameters"
// @Failure     500 {object} response "Internal server error"
// @Router      /contracts [get]
func (r *contractRoutes) getAllContracts(c *gin.Context) {
	pageQuery := c.Query("page")
	limitQuery := c.Query("limit")

	// Check if pagination parameters are provided
	if pageQuery != "" && limitQuery != "" {
		page, err := strconv.Atoi(pageQuery)
		if err != nil {
			r.l.Error(err, "http - v1 - get all contracts - invalid page number")
			errorResponse(c, http.StatusBadRequest, "invalid page number", err)
			return
		}

		limit, err := strconv.Atoi(limitQuery)
		if err != nil {
			r.l.Error(err, "http - v1 - get all contracts - invalid limit")
			errorResponse(c, http.StatusBadRequest, "invalid limit", err)
			return
		}

		// Get paginated contracts
		contracts, totalPages, err := r.c.GetPaginatedContracts(page, limit)
		if err != nil {
			r.l.Error(err, "http - v1 - get all contracts - GetPaginatedContracts")
			errorResponse(c, http.StatusInternalServerError, "error getting paginated contracts", err)
			return
		}
		c.JSON(http.StatusOK, PaginatedContractsResponse{
			Contracts:  contracts,
			TotalPages: totalPages,
		})
	} else {
		// Get all contracts without pagination
		contracts, err := r.c.GetAll()
		if err != nil {
			r.l.Error(err, "http - v1 - get all contracts - GetAll")
			errorResponse(c, http.StatusInternalServerError, "error getting all contracts", err)
			return
		}
		c.JSON(http.StatusOK, contracts)
	}
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
	idStr := c.Param("id")

	contract, err := r.c.GetById(idStr)
	if err != nil {
		r.l.Error(err, "http - v1 - get contract by id - Atoi")
		errorResponse(c, http.StatusBadRequest, "invalid contract ID", err)
		return
	}

	c.JSON(http.StatusOK, contract)
}

// @Summary Get contract history
// @Description Retrieve a list of history of contract
// @Tags  	    ContractHistory
// @Accept      json
// @Produce     json
// @Param       page query int false "Page number for pagination"
// @Param       limit query int false "Number of items per page for pagination"
// @Success     200 {object} []entity.Contract
// @Failure     400 {object} response "Invalid query parameters"
// @Failure     500 {object} response "Internal server error"
// @Router      /contracts [get]
func (r *contractRoutes) getContractHistory(c *gin.Context) {
	contractId := c.Param("contractId")

	contract, err := r.c.GetById(contractId)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "contract not found", err)
	}

	token := c.Request.Header.Get("Authorization")
	user, err := r.a.GetUserByToken(token)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "user not found", err)
		return
	}

	userID, err := strconv.Atoi(user.ID)
	contracts, err := r.c.GetHistory(userID, contract.Id)
	if err != nil {
		r.l.Error(err, "http - v1 - get history - GetHistory")
		errorResponse(c, http.StatusInternalServerError, "error getting history", err)
		return
	}
	c.JSON(http.StatusOK, contracts)
}

// @Summary     Add contract history
// @Description Add contract history
// @Tags  	    Contract
// @Accept      json
// @Produce     json
// @Param       request body AddContractHistoryRequest true "History info"
// @Success     200 {object} entity.ContractHistory
// @Failure     400 {object} response
// @Failure     404 {object} response
// @Failure     500 {object} response
// @Router      /contract/history [post]
func (r *contractRoutes) addContractHistory(c *gin.Context) {
	var request AddContractHistoryRequest
	var err error

	if err := c.ShouldBindJSON(&request); err != nil {
		r.l.Error(err, "http - v1 - add contract history - ShouldBindJSON")
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()), err)
		return
	}

	contractId := strconv.Itoa(request.ContractId)
	contract, err := r.c.GetById(contractId)
	if err != nil {
		r.l.Error(err, "http - v1 - add contract history - GetById")
		errorResponse(c, http.StatusNotFound, "contract not found", err)
		return
	}

	token := c.Request.Header.Get("Authorization")
	user, err := r.u.GetUserByToken(token)
	if err != nil {
		r.l.Error(err, "http - v1 - create contract - GetById")
		errorResponse(c, http.StatusNotFound, "vault not found", err)
		return
	}

	contractHistory := entity.ContractHistory{
		Contract:      contract,
		User:          user,
		DepositAmount: request.DepositAmount,
	}

	contractHistory, err = r.c.AddContractHistory(contractHistory)
	if err != nil {
		r.l.Error(err, "http - v1 - add contract history - Create")
		errorResponse(c, http.StatusNotFound, fmt.Sprintf("error: %s", err.Error()), err)
		return
	}

	c.JSON(http.StatusOK, contractHistory)
}

// @Summary     Update contract history
// @Description Update contract history
// @Tags  	    Contract
// @Accept      json
// @Produce     json
// @Param       request body UpdateContractHistoryRequest true "History info"
// @Success     200 {object} entity.ContractHistory
// @Failure     400 {object} response
// @Failure     404 {object} response
// @Failure     500 {object} response
// @Router      /contract/history [put]
func (r *contractRoutes) updateContractHistory(c *gin.Context) {
	var request UpdateContractHistoryRequest
	var err error

	if err := c.ShouldBindJSON(&request); err != nil {
		r.l.Error(err, "http - v1 - add contract history - ShouldBindJSON")
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()), err)
		return
	}

	contractId := strconv.Itoa(request.ContractId)
	contract, err := r.c.GetById(contractId)
	if err != nil {
		r.l.Error(err, "http - v1 - add contract history - GetById")
		errorResponse(c, http.StatusNotFound, "contract not found", err)
		return
	}

	token := c.Request.Header.Get("Authorization")
	user, err := r.u.GetUserByToken(token)
	if err != nil {
		r.l.Error(err, "http - v1 - create contract - GetById")
		errorResponse(c, http.StatusNotFound, "vault not found", err)
		return
	}

	contractHistory := entity.ContractHistory{
		Contract:       contract,
		User:           user,
		WithdrawAmount: &request.WithdrawAmount,
	}

	contractHistory, err = r.c.UpdateContractHistory(contractHistory)
	if err != nil {
		r.l.Error(err, "http - v1 - update contract history - Create")
		errorResponse(c, http.StatusNotFound, fmt.Sprintf("error: %s", err.Error()), err)
		return
	}

	c.JSON(http.StatusOK, contractHistory)
}
