package v1

import (
	"fmt"
	"net/http"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

type walletsRoutes struct {
	t usecase.WalletUseCase
	m HTTPControllerMessenger
	// l logger.Interface
}

func newWalletsRoutes(handler *gin.RouterGroup, t usecase.WalletUseCase, m HTTPControllerMessenger) {
	r := &walletsRoutes{t, m}

	h := handler.Group("/wallets")
	{
		h.GET("", r.list)
		h.POST("", r.create)
	}
}

type walletResponse struct {
	Wallets []entity.Wallet `json:"wallets"`
	Wallet  entity.Wallet   `json:"wallet"`
}

func (r *walletsRoutes) list(c *gin.Context) {
	walletType := c.Query("type")

	wallets, err := r.t.List(walletType)
	if err != nil {
		// r.l.Error(err, "http - v1 - history")
		// errorResponse(c, http.StatusInternalServerError, "database problems")
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusOK, walletResponse{Wallets: wallets})
}

func (r *walletsRoutes) create(c *gin.Context) {
	res, err := r.m.SendMessage(entity.CreateKeypairChannel, entity.CreateKeypairRequest{Amount: 1})
	if err != nil {
		// r.l.Error(err, "http - v1 - history")
		// errorResponse(c, http.StatusInternalServerError, "database problems")
		fmt.Println(err)
		return
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
		// r.l.Error(err, "http - v1 - history")
		// errorResponse(c, http.StatusInternalServerError, "database problems")
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusOK, walletResponse{Wallet: wallet})
}
