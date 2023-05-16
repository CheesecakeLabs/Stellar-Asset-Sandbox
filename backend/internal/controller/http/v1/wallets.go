package v1

import (
	"net/http"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

type walletsRoutes struct {
	t usecase.WalletUseCase
	m HTTPControllerMessenger
}

func newWalletsRoutes(handler *gin.RouterGroup, t usecase.WalletUseCase, m HTTPControllerMessenger) {
	r := &walletsRoutes{t, m}
	h := handler.Group("/wallets")
	{
		h.GET("", r.list)
		h.POST("", r.create)
	}
}

// @Summary List
// @Description List wallets by type
// @Schemes
// @Tags Wallets
// @Accept json
// @Produce json
// @Param   type     query    string     true        "Type"
// @Success 200  {object} []entity.Wallet
// @Router /wallets [get]
func (r *walletsRoutes) list(c *gin.Context) {
	walletType := c.Query("type")

	wallets, err := r.t.List(walletType)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "database problems")
	}

	c.JSON(http.StatusOK, wallets)
}

type CreateWalletRequest struct {
	Type string `json:"type"       binding:"required"  example:"sponsor"`
}

// @Summary     Create
// @Description Create a new wallet
// @Tags  	    Wallets
// @Accept      json
// @Produce     json
// @Param       request body CreateWalletRequest true "Set up wallet"
// @Success     200 {object} entity.Wallet
// @Failure     400 {object} response
// @Failure     500 {object} response
// @Router      /wallets [post]
func (r *walletsRoutes) create(c *gin.Context) {
	var request CreateWalletRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		errorResponse(c, http.StatusBadRequest, "invalid request body: %x")
		return
	}

	res, err := r.m.SendMessage(entity.CreateKeypairChannel, entity.CreateKeypairRequest{Amount: 1})
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "messaging problems")
	}

	kpRes := res.Message.(entity.CreateKeypairResponse)
	pk := kpRes.PublicKeys[0]

	wallet, err := r.t.Create(entity.Wallet{
		Type: request.Type,
		Key: entity.Key{
			PublicKey: pk,
			Weight:    1,
		},
	})
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "database problems")
	}

	c.JSON(http.StatusOK, wallet)
}
