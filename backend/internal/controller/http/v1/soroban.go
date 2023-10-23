package v1

import (
	"fmt"
	"net/http"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

type sorobanRoutes struct {
	w usecase.WalletUseCase
	m HTTPControllerMessenger
	a usecase.AuthUseCase
}

func newSorobanRoutes(handler *gin.RouterGroup, w usecase.WalletUseCase, m HTTPControllerMessenger, a usecase.AuthUseCase) {
	r := &sorobanRoutes{w, m, a}

	h := handler.Group("/soroban-transactions")
	h.Use(Auth(r.a.ValidateToken()))
	{
		h.POST("/sign", r.signTransaction)
		h.POST("/submit", r.submitTransaction)
	}
}

type SignedTransactionRequest struct {
	Envelope string `json:"envelope"       binding:"required"  example:"KJDSKD..."`
	WalletPk string `json:"wallet_pk"       example:"GDSKJG..."`
}

type SubmitTransactionRequest struct {
	Envelope string `json:"envelope"       binding:"required"  example:"KJDSKD..."`
}

// @Summary     Signed Transaction
// @Description Signed a XDR transaction
// @Tags  	    Soroban
// @Accept      json
// @Produce     json
// @Param       request body SignedTransactionRequest true "Signed a XDR transaction"
// @Success     200 {object} response
// @Failure     400 {object} response
// @Failure     500 {object} response
// @Router      /soroban-transactions/sign [post]
func (r *sorobanRoutes) signTransaction(c *gin.Context) {
	var request SignedTransactionRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		errorResponse(c, http.StatusBadRequest, "invalid request", err)
		return
	}

	if request.WalletPk == "" {
		sponsor, err := r.w.Get(_sponsorId)
		if err != nil {
			errorResponse(c, http.StatusInternalServerError, "database problems", err)
			return
		}

		request.WalletPk = sponsor.Key.PublicKey
	}
	res, err := r.m.SendMessage(entity.SignChannel, entity.SignTransactionRequest{
		PublicKeys: []string{request.WalletPk},
		Envelope:   request.Envelope,
	})
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "messaging problems", err)
		return
	}

	c.JSON(http.StatusOK, res)
}

// @Summary     Submit Transaction
// @Description Submit a XDR transaction
// @Tags  	    Soroban
// @Accept      json
// @Produce     json
// @Param       request body SubmitTransactionRequest true "Submit a XDR transaction"
// @Success     200 {object} response
// @Failure     400 {object} response
// @Failure     500 {object} response
// @Router      /soroban-transactions/submit [post]
func (r *sorobanRoutes) submitTransaction(c *gin.Context) {
	var request SubmitTransactionRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		errorResponse(c, http.StatusBadRequest, "invalid request", err)
		return
	}
	res, err := r.m.SendMessage(entity.SubmitTransactionChannel, entity.SubmitRequest{Envelope: request.Envelope})
	if err != nil {
		fmt.Println(err)
		errorResponse(c, http.StatusInternalServerError, "messaging problems", err)
		return
	}

	c.JSON(http.StatusOK, res)
}
