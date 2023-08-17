package v1

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

type logTransactionsRoutes struct {
	w  usecase.WalletUseCase
	as usecase.AssetUseCase
	m  HTTPControllerMessenger
	l  usecase.LogTransactionUseCase
	a  usecase.AuthUseCase
}

func newLogTransactionsRoutes(handler *gin.RouterGroup, w usecase.WalletUseCase, as usecase.AssetUseCase, m HTTPControllerMessenger, l usecase.LogTransactionUseCase, a usecase.AuthUseCase) {
	r := &logTransactionsRoutes{w, as, m, l, a}
	h := handler.Group("/log_transactions").Use(Auth(r.a.ValidateToken()))
	{
		h.GET("/:time_range", r.getLogTransactions)
		h.GET("/asset/:asset_id/:time_range", r.getLogTransactionsByAssetID)
		h.GET("/user/:user_id/:time_range", r.getLogTransactionsByUserID)
		h.GET("/transaction_type/:transaction_type_id/:time_range", r.getLogTransactionsByTransactionTypeID)
		// add asset_code and asset_issuer
		// sum all amounts of a specific asset and date range
		// sum all amouts of all assets and date range
	}
}

// @Summary Get all transactions logs
// @Description Get all transactions logs within a specific time range
// @Tags Log Transactions
// @Accept json
// @Produce json
// @Param time_range query string true "Time range (e.g., last 24 hours, last 7 days, last 30 days)"
// @Security ApiKeyAuth
// @Success 200 {object} entity.LogTransaction
// @Router /log_transactions [get]
func (r *logTransactionsRoutes) getLogTransactions(c *gin.Context) {
	timeRange := c.Param("time_range")

	logTransactions, err := r.l.GetLogTransactions(timeRange)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, fmt.Sprintf("error getting log transactions: %s", err.Error()))
		return
	}

	c.JSON(http.StatusOK, logTransactions)
}

// @Summary Get transactions logs by Asset ID
// @Description Get all transactions logs for a specific asset
// @Tags Log Transactions
// @Accept json
// @Produce json
// @Param asset_id path int true "Asset ID"
// @Security ApiKeyAuth
// @Success 200 {object} entity.LogTransaction
// @Router /log_transactions/asset/{asset_id} [get]
func (r *logTransactionsRoutes) getLogTransactionsByAssetID(c *gin.Context) {
	assetIDStr := c.Param("asset_id")
	timeRange := c.Param("time_range")

	assetID, err := strconv.Atoi(assetIDStr)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid asset ID: %s", err.Error()))
		return
	}

	logTransactions, err := r.l.GetLogTransactionsByAssetID(assetID, timeRange)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, fmt.Sprintf("error getting log transactions: %s", err.Error()))
		return
	}

	c.JSON(http.StatusOK, logTransactions)
}

// @Summary Get transactions logs by User ID
// @Description Get all transactions logs for a specific user
// @Tags Log Transactions
// @Accept json
// @Produce json
// @Param user_id path int true "User ID"
// @Security ApiKeyAuth
// @Success 200 {object} entity.LogTransaction
// @Router /log_transactions/user/{user_id} [get]
func (r *logTransactionsRoutes) getLogTransactionsByUserID(c *gin.Context) {
	userIDStr := c.Param("user_id")
	timeRange := c.Param("time_range")

	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid user ID: %s", err.Error()))
		return
	}

	logTransactions, err := r.l.GetLogTransactionsByUserID(userID, timeRange)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, fmt.Sprintf("error getting log transactions: %s", err.Error()))
		return
	}

	c.JSON(http.StatusOK, logTransactions)
}

// @Summary Get transactions logs by Transaction Type ID
// @Description Get all transactions logs for a specific transaction type
// @Tags Log Transactions
// @Accept json
// @Produce json
// @Param transaction_type_id path int true "Transaction Type ID"
// @Security ApiKeyAuth
// @Success 200 {object} entity.LogTransaction
// @Router /log_transactions/transaction_type/{transaction_type_id} [get]
func (r *logTransactionsRoutes) getLogTransactionsByTransactionTypeID(c *gin.Context) {
	transactionTypeIDStr := c.Param("transaction_type_id")
	timeRange := c.Param("time_range")

	transactionTypeID, err := strconv.Atoi(transactionTypeIDStr)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid asset ID: %s", err.Error()))
		return
	}

	logTransactions, err := r.l.GetLogTransactionsByTransactionTypeID(transactionTypeID, timeRange)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, fmt.Sprintf("error getting log transactions: %s", err.Error()))
		return
	}

	c.JSON(http.StatusOK, logTransactions)
}
