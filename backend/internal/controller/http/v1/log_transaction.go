package v1

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/logger"
	"github.com/gin-gonic/gin"
)

type logTransactionsRoutes struct {
	w      usecase.WalletUseCase
	as     usecase.AssetUseCase
	m      HTTPControllerMessenger
	l      usecase.LogTransactionUseCase
	a      usecase.AuthUseCase
	logger *logger.Logger
}

func newLogTransactionsRoutes(handler *gin.RouterGroup, w usecase.WalletUseCase, as usecase.AssetUseCase, m HTTPControllerMessenger, l usecase.LogTransactionUseCase, a usecase.AuthUseCase, logger *logger.Logger) {
	r := &logTransactionsRoutes{w, as, m, l, a, logger}
	h := handler.Group("/log_transactions").Use(Auth(r.a.ValidateToken()))
	{
		h.GET("/:time_range", r.getLogTransactions)
		h.GET("/assets/:asset_id/:time_range", r.getLogTransactionsByAssetID)
		h.GET("/user/:user_id/:time_range", r.getLogTransactionsByUserID)
		h.GET("/transaction_type/:transaction_type_id/:time_range", r.getLogTransactionsByTransactionTypeID)
		h.GET("/assets/:asset_id/type/:transaction_type_id/sum/:time_range/:time_frame", r.sumAmountsByAssetID)
		h.GET("/assets/sum/:time_range/:time_frame", r.sumAmountsForAllAssets)
		h.GET("/last-transactions/:transaction_type_id", r.getLastLogTransactions)
		h.POST("/supply/:asset_id", r.supplyByAssetID)
	}
}

type FiltersRequest struct {
	TimeRange     string `json:"time_range"        example:"hour"`
	PeriodInitial string `json:"period_initial"        example:"24 hours"`
	Interval      string `json:"interval"        example:"1 hour"`
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
		r.logger.Error(err, "http - v1 - list log transactions - GetLogTransactions")
		errorResponse(c, http.StatusInternalServerError, "error getting log transactions: %s", err)
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
		r.logger.Error(err, "http - v1 - list log transactions - GetLogTransactionsByAssetID")
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid asset ID: %s", err.Error()), err)
		return
	}

	logTransactions, err := r.l.GetLogTransactionsByAssetID(assetID, timeRange)
	if err != nil {
		r.logger.Error(err, "http - v1 - list log transactions - GetLogTransactionsByAssetID")
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
		r.logger.Error(err, "http - v1 - list log transactions - GetLogTransactionsByUserID")
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid user ID: %s", err.Error()), err)
		return
	}

	logTransactions, err := r.l.GetLogTransactionsByUserID(userID, timeRange)
	if err != nil {
		r.logger.Error(err, "http - v1 - list log transactions - GetLogTransactionsByUserID")
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
		r.logger.Error(err, "http - v1 - list log transactions - GetLogTransactionsByTransactionTypeID")
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid asset ID: %s", err.Error()), err)
		return
	}

	logTransactions, err := r.l.GetLogTransactionsByTransactionTypeID(transactionTypeID, timeRange)
	if err != nil {
		r.logger.Error(err, "http - v1 - list log transactions - GetLogTransactionsByTransactionTypeID")
		errorResponse(c, http.StatusInternalServerError, fmt.Sprintf("error getting log transactions: %s", err.Error()), err)
		return
	}

	c.JSON(http.StatusOK, logTransactions)
}

// @Summary Get sum of amounts by Asset ID within a specific time frame
// @Description Get sum of amounts for a specific asset, grouped by a specified time frame (e.g., '1h' for 1 hour) and a specific transaction type
// @Tags Log Transactions
// @Accept json
// @Produce json
// @Param asset_id path int true "Asset ID"
// @Param transaction_type_id path string true "Transaction type ID (e.g., '0' for all transactions, '1' for type create asset '2' for mint asset)"
// @Param time_range path string true "Time range for the query (e.g., '24h' or '1d' '7d' '30d')"
// @Param time_frame path string true "Time frame for the query (e.g., '1h' '2h' '24h' '36h')"
// @Security ApiKeyAuth
// @Success 200 {object} entity.SumLogTransaction "Sum log transaction for the specified asset"
// @Failure 400 {string} string "invalid transaction type"
// @Failure 500 {string} string "Internal server error"
// @Router /log_transactions/assets/{asset_id}/type/{transaction_type_id}/sum/{time_range}/{time_frame} [get]
func (r *logTransactionsRoutes) sumAmountsByAssetID(c *gin.Context) {
	assetIDStr := c.Param("asset_id")
	transactionTypeStr := c.Param("transaction_type_id")
	timeRange := c.Param("time_range")
	timeFrame := c.Param("time_frame")

	if transactionTypeStr == "" {
		transactionTypeStr = "0"
	}

	// Convert transactionTypeStr to integer
	transactionType, err := strconv.Atoi(transactionTypeStr)
	if err != nil {
		r.logger.Error(err, "http - v1 - list log transactions - sumAmountsByAssetID")
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid transaction type: %s", err.Error()), err)
		return
	}
	duration, err := time.ParseDuration(timeFrame)
	if err != nil {
		r.logger.Error(err, "http - v1 - list log transactions - sumAmountsByAssetID")
		errorResponse(c, http.StatusBadRequest, "Invalid time_frame format", err)
		return
	}

	assetID, err := strconv.Atoi(assetIDStr)
	if err != nil {
		r.logger.Error(err, "http - v1 - list log transactions - sumAmountsByAssetID")
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid asset ID: %s", err.Error()), err)
		return
	}

	sum, err := r.l.SumLogTransactionsByAssetID(assetID, timeRange, duration, transactionType)
	if err != nil {
		r.logger.Error(err, "http - v1 - list log transactions - sumAmountsByAssetID")
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
	timeFrame := c.Param("time_frame")

	duration, err := time.ParseDuration(timeFrame)
	if err != nil {
		r.logger.Error(err, "http - v1 - list log transactions - sumAmountsForAllAssets")
		errorResponse(c, http.StatusBadRequest, "Invalid time_frame format", err)
		return
	}
	sum, err := r.l.SumLogTransactions(timeRange, duration)
	if err != nil {
		r.logger.Error(err, "http - v1 - list log transactions - sumAmountsForAllAssets")
		errorResponse(c, http.StatusInternalServerError, fmt.Sprintf("error getting log transactions: %s", err.Error()), err)
		return
	}

	c.JSON(http.StatusOK, sum)
}

// @Summary Get last transactions
// @Description Get last transactions logs for a specific transaction type
// @Tags Log Transactions
// @Accept json
// @Produce json
// @Param transaction_type_id path int true "Transaction Type ID"
// @Security ApiKeyAuth
// @Success 200 {object} entity.LogTransaction
// @Router /log_transactions/last_transactions/{transaction_type_id} [get]
func (r *logTransactionsRoutes) getLastLogTransactions(c *gin.Context) {
	transactionTypeIDStr := c.Param("transaction_type_id")

	transactionTypeID, err := strconv.Atoi(transactionTypeIDStr)
	if err != nil {
		r.logger.Error(err, "http - v1 - list log transactions - GetLastLogTransactions")
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid asset ID: %s", err.Error()), err)
		return
	}

	logTransactions, err := r.l.GetLastLogTransactions(transactionTypeID)
	if err != nil {
		r.logger.Error(err, "http - v1 - list log transactions - GetLastLogTransactions")
		errorResponse(c, http.StatusInternalServerError, fmt.Sprintf("error getting last log transactions: %s", err.Error()), err)
		return
	}

	c.JSON(http.StatusOK, logTransactions)
}

// @Summary Get sum of supply by Asset ID within a specific time frame
// @Description Get sum of supply for a specific asset, grouped by a specified time frame (e.g., '1h' for 1 hour)
// @Tags Log Transactions
// @Accept json
// @Produce json
// @Param asset_id path int true "Asset ID"
// @Param time_range path string true "Time range for the query (e.g., '24h' or '1d' '7d' '30d')"
// @Param time_frame path string true "Time frame for the query (e.g., '1h' '2h' '24h' '36h')"
// @Security ApiKeyAuth
// @Success 200 {object} entity.SumLogTransaction
// @Failure 400 {string} string "Invalid time_frame format"
// @Failure 500 {string} string "Internal server error"
// @Router /log_transactions/supply/{asset_id}/{time_range}/{time_frame} [get]
func (r *logTransactionsRoutes) supplyByAssetID(c *gin.Context) {
	assetIDStr := c.Param("asset_id")

	var request FiltersRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		r.logger.Error(err, "http - v1 - list log transactions - supplyByAssetID")
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()), err)
		return
	}

	assetID, err := strconv.Atoi(assetIDStr)
	if err != nil {
		r.logger.Error(err, "http - v1 - list log transactions - supplyByAssetID")
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid asset ID: %s", err.Error()), err)
		return
	}

	sum, err := r.l.LogTransactionsSupplyByAssetID(assetID, request.TimeRange, request.PeriodInitial, request.Interval)
	if err != nil {
		r.logger.Error(err, "http - v1 - list log transactions - supplyByAssetID")
		errorResponse(c, http.StatusInternalServerError, fmt.Sprintf("error getting log transactions: %s", err.Error()), err)
		return
	}

	c.JSON(http.StatusOK, sum)
}
