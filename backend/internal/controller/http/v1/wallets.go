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

func (r *walletsRoutes) list(c *gin.Context) {
	walletType := c.Query("type")

	wallets, err := r.t.List(walletType)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "database problems")
	}

	c.JSON(http.StatusOK, wallets)
}

func (r *walletsRoutes) create(c *gin.Context) {
	res, err := r.m.SendMessage(entity.CreateKeypairChannel, entity.CreateKeypairRequest{Amount: 1})
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "messaging problems")
	}

	kpRes := res.Message.(entity.CreateKeypairResponse)
	pk := kpRes.PublicKeys[0]

	wallet, err := r.t.Create(entity.Wallet{
		Type: entity.SponsorType, Key: entity.Key{
			PublicKey: pk,
			Weight:    1,
		},
	})
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "database problems")
	}

	c.JSON(http.StatusOK, wallet)
}
