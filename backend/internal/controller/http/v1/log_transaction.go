package v1

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

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
		h.GET("/assets/:asset_id/:time_range", r.getLogTransactionsByAssetID)
		h.GET("/user/:user_id/:time_range", r.getLogTransactionsByUserID)
		h.GET("/transaction_type/:transaction_type_id/:time_range", r.getLogTransactionsByTransactionTypeID)
		h.GET("/assets/:asset_id/sum/:time_range/:time_frame", r.sumAmountsByAssetID)
		h.GET("/assets/sum/:time_range/:time_frame", r.sumAmountsForAllAssets)
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
		errorResponse(c, http.StatusInternalServerError, fmt.Sprintf("error getting log transactions: %s", err.Error()), err)
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
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid asset ID: %s", err.Error()), err)
		return
	}

	logTransactions, err := r.l.GetLogTransactionsByAssetID(assetID, timeRange)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, fmt.Sprintf("error getting log transactions: %s", err.Error()), err)
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
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid user ID: %s", err.Error()), err)
		return
	}

	logTransactions, err := r.l.GetLogTransactionsByUserID(userID, timeRange)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, fmt.Sprintf("error getting log transactions: %s", err.Error()), err)
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
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid asset ID: %s", err.Error()), err)
		return
	}

	logTransactions, err := r.l.GetLogTransactionsByTransactionTypeID(transactionTypeID, timeRange)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, fmt.Sprintf("error getting log transactions: %s", err.Error()), err)
		return
	}

	c.JSON(http.StatusOK, logTransactions)
}

// @Summary Get sum of amounts by Asset ID within a specific time frame
// @Description Get sum of amounts for a specific asset, grouped by a specified time frame (e.g., '1h' for 1 hour)
// @Tags Log Transactions
// @Accept json
// @Produce json
// @Param asset_id path int true "Asset ID"
// @Param time_range path string true "Time range for the query (e.g., '24h')"
// @Param time_frame query string false "Time frame for grouping (e.g., '1h'). Default is '1h'"
// @Security ApiKeyAuth
// @Success 200 {object} entity.SumLogTransaction "Sum log transaction for the specified asset"
// @Failure 400 {string} string "Invalid time_frame format"
// @Failure 500 {string} string "Internal server error"
// @Router /log_transactions/asset/{asset_id}/sum/{time_range}/{time_frame} [get]
func (r *logTransactionsRoutes) sumAmountsByAssetID(c *gin.Context) {
	assetIDStr := c.Param("asset_id")
	timeRange := c.Param("time_range")
	timeFrame := c.DefaultQuery("time_frame", "1h") // Default to 1 hour if not provided

	duration, err := time.ParseDuration(timeFrame)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, "Invalid time_frame format", err)
		return
	}

	assetID, err := strconv.Atoi(assetIDStr)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid asset ID: %s", err.Error()), err)
		return
	}

	sum, err := r.l.SumLogTransactionsByAssetID(assetID, timeRange, duration)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, fmt.Sprintf("error getting log transactions: %s", err.Error()), err)
		return
	}

	c.JSON(http.StatusOK, sum)
}

// @Summary Get sum of amounts for all assets within a specific time frame
// @Description Get sum of amounts for all assets, grouped by a specified time frame (e.g., '1h' for 1 hour)
// @Tags Log Transactions
// @Accept json
// @Produce json
// @Param time_range path string true "Time range for the query (e.g., '24h')"
// @Param time_frame query string false "Time frame for grouping (e.g., '1h'). Default is '1h'"
// @Security ApiKeyAuth
// @Success 200 {array} entity.SumLogTransaction "Array of sum log transactions"
// @Failure 400 {string} string "Invalid time_frame format"
// @Failure 500 {string} string "Internal server error"
// @Router /log_transactions/assets/sum/{time_range}/{time_frame} [get]
func (r *logTransactionsRoutes) sumAmountsForAllAssets(c *gin.Context) {
	timeRange := c.Param("time_range")
	timeFrame := c.DefaultQuery("time_frame", "1h") // Default to 1 hour if not provided

	duration, err := time.ParseDuration(timeFrame)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, "Invalid time_frame format", err)
		return
	}

	sum, err := r.l.SumLogTransactions(timeRange, duration)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, fmt.Sprintf("error getting log transactions: %s", err.Error()), err)
		return
	}

	c.JSON(http.StatusOK, sum)
}
