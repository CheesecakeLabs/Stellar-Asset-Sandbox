package v1

import (
	"net/http"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/logger"
	"github.com/gin-gonic/gin"
)

type walletsRoutes struct {
	w usecase.WalletUseCase
	m HTTPControllerMessenger
	a usecase.AuthUseCase
	l logger.Interface
}

func newWalletsRoutes(handler *gin.RouterGroup, w usecase.WalletUseCase, m HTTPControllerMessenger, a usecase.AuthUseCase, l logger.Interface) {
	r := &walletsRoutes{w, m, a, l}
	h := handler.Group("/wallets").Use(Auth(a.ValidateToken()))
	{
		h.GET("", r.list)
		h.POST("", r.create)
		h.POST("fund/", r.fundWallet)
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

	wallets, err := r.w.List(walletType)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "database problems", err)
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
		r.l.Error(err, "http - v1 - create wallet - bind")
		errorResponse(c, http.StatusBadRequest, "invalid request body", err)
		return
	}

	res, err := r.m.SendMessage(entity.CreateKeypairChannel, entity.CreateKeypairRequest{Amount: 1})
	if err != nil {
		r.l.Error(err, "http - v1 - create wallet - SendMessage")
		errorResponse(c, http.StatusInternalServerError, "messaging problems", err)
		return
	}

	kpRes := res.Message.(entity.CreateKeypairResponse)
	pk := kpRes.PublicKeys[0]

	wallet, err := r.w.Create(entity.Wallet{
		Type: request.Type,
		Key: entity.Key{
			PublicKey: pk,
			Weight:    1,
		},
	})
	if err != nil {
		r.l.Error(err, "http - v1 - create wallet - Create Wallet")
		errorResponse(c, http.StatusInternalServerError, "database problems", err)
		return
	}

	c.JSON(http.StatusOK, wallet)
}

type FundWalletRequest struct {
	Id int `json:"id"       binding:"required"  example:"1"`
}

// @Summary     Fund Wallet
// @Description Fund a wallet with Friendbot
// @Tags  	    Wallets
// @Accept      json
// @Produce     json
// @Param       request body FundWalletRequest true "Wallet id"
// @Success     200 {object} entity.Wallet
// @Failure     400 {object} response
// @Failure     404 {object} response
// @Failure     500 {object} response
// @Router      /wallets/fund/ [post]
func (r *walletsRoutes) fundWallet(c *gin.Context) {
	var request FundWalletRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		r.l.Error(err, "http - v1 - fund wallet - bind")
		errorResponse(c, http.StatusBadRequest, "invalid request body: %x", err)
		return
	}

	wallet, err := r.w.Get(request.Id)
	if err != nil {
		r.l.Error(err, "http - v1 - fund wallet - Get Wallet")
		errorResponse(c, http.StatusNotFound, "wallet not found", err)
		return
	}

	if wallet.Funded {
		r.l.Warn("http - v1 - fund wallet - wallet is already funded")
		errorResponse(c, http.StatusBadRequest, "wallet is already funded", err)
		return
	}

	res, err := r.m.SendMessage(entity.HorizonChannel, entity.HorizonRequest{
		Id:      wallet.Id,
		Type:    "fundWithFriendbot",
		Account: wallet.Key.PublicKey,
	})
	if err != nil {
		r.l.Error(err, "http - v1 - fund wallet - SendMessage")
		errorResponse(c, http.StatusInternalServerError, "messaging problems", err)
	}

	fundRes := res.Message.(entity.HorizonResponse)

	if fundRes.StatusCode != 200 {
		r.l.Error("http - v1 - fund wallet - fundRes.StatusCode != 200")
		errorResponse(c, http.StatusInternalServerError, "friendbot error", err)
		return
	}

	wallet.Funded = true
	wallet, err = r.w.Update(wallet)
	if err != nil {
		r.l.Error(err, "http - v1 - fund wallet - Update Wallet")
		errorResponse(c, http.StatusInternalServerError, "database problems", err)
		return
	}

	c.JSON(http.StatusOK, wallet)
}
