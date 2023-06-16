package v1

import (
	"fmt"
	"net/http"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

const _startingBalance = "10"

type assetsRoutes struct {
	w  usecase.WalletUseCase
	as usecase.AssetUseCase
	m  HTTPControllerMessenger
}

func newAssetsRoutes(handler *gin.RouterGroup, w usecase.WalletUseCase, as usecase.AssetUseCase, m HTTPControllerMessenger) {
	r := &assetsRoutes{w, as, m}
	h := handler.Group("/assets")
	{
		h.POST("", r.createAsset)
		h.POST("/mint", r.mintAsset)
		h.POST("/burn", r.burnAsset)
	}
}

type CreateAssetRequest struct {
	SponsorId int    `json:"sponsor_id"       binding:"required"  example:"2"`
	Code      string `json:"code"       binding:"required"  example:"USDC"`
	Limit     *int   `json:"limit"         example:"1000"`
}

type BurnAssetRequest struct {
	Id        string `json:"id"       binding:"required"  example:"001"`
	SponsorId int    `json:"sponsor_id"       binding:"required"  example:"2"`
	Amount    string `json:"amount"       binding:"required"  example:"1000"`
}

type MintAssetRequest struct {
	Id        string `json:"id"       binding:"required"  example:"12"`
	SponsorId int    `json:"sponsor_id"       binding:"required"  example:"2"`
	Code      string `json:"code"       binding:"required"  example:"USDC"`
	Amount    string `json:"amount"       binding:"required"  example:"1000"`
}

// @Summary     Create a new asset
// @Description Create and issue a new asset on Stellar
// @Tags  	    Assets
// @Accept      json
// @Produce     json
// @Param       request body CreateAssetRequest true "Asset info"
// @Success     200 {object} entity.Asset
// @Failure     400 {object} response
// @Failure     404 {object} response
// @Failure     500 {object} response
// @Router      /assets [post]
func (r *assetsRoutes) createAsset(c *gin.Context) {
	var request CreateAssetRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()))
		return
	}

	sponsor, err := r.w.Get(request.SponsorId)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "sponsor wallet not found")
		return
	}

	res, err := r.m.SendMessage(entity.CreateKeypairChannel, entity.CreateKeypairRequest{Amount: 2})
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "kms messaging problems")
		return
	}

	kpRes, ok := res.Message.(entity.CreateKeypairResponse)
	if !ok || len(kpRes.PublicKeys) != 2 {
		errorResponse(c, http.StatusInternalServerError, "unexpected kms response")
		return
	}
	issuerPk := kpRes.PublicKeys[0]
	distPk := kpRes.PublicKeys[1]

	ops := []entity.Operation{
		{
			Type:   entity.CreateAccountOp,
			Target: issuerPk,
			Amount: _startingBalance,
			Origin: sponsor.Key.PublicKey,
		},
		{
			Type:   entity.CreateAccountOp,
			Target: distPk,
			Amount: _startingBalance,
			Origin: sponsor.Key.PublicKey,
		},
		{
			Type:    entity.ChangeTrustOp,
			Sponsor: sponsor.Key.PublicKey,
			Asset: entity.OpAsset{
				Code:   request.Code,
				Issuer: issuerPk,
			},
			TrustLimit: request.Limit,
			Origin:     distPk,
		},
	}
	res, err = r.m.SendMessage(entity.EnvelopeChannel, entity.EnvelopeRequest{
		MainSource: sponsor.Key.PublicKey,
		PublicKeys: []string{sponsor.Key.PublicKey, distPk},
		Operations: ops,
	})
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "starlabs messaging problems")
		return
	}
	_, ok = res.Message.(entity.EnvelopeResponse)
	if !ok {
		errorResponse(c, http.StatusInternalServerError, "unexpected starlabs response")
		return
	}

	asset := entity.Asset{
		Code: request.Code,
		Issuer: entity.Wallet{
			Type:   entity.IssuerType,
			Funded: true,
			Key: entity.Key{
				PublicKey: issuerPk,
				Weight:    1,
			},
		},
		Distributor: entity.Wallet{
			Type:   entity.DistributorType,
			Funded: true,
			Key: entity.Key{
				PublicKey: distPk,
				Weight:    1,
			},
		},
	}
	asset, err = r.as.Create(asset)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "database problems")
		return
	}

	c.JSON(http.StatusOK, asset)
}

// @Summary     Mint an asset
// @Description Mint an asset on Stellar
// @Tags  	    Assets
// @Accept      json
// @Produce     json
// @Param       request body MintAssetRequest true "Asset info"
// @Success     200 {object} entity.Asset
// @Failure     400 {object} response
// @Failure     404 {object} response
// @Failure     500 {object} response
// @Router      /assets [post]
func (r *assetsRoutes) mintAsset(c *gin.Context) {
	var request MintAssetRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()))
		return
	}

	sponsor, err := r.w.Get(request.SponsorId)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "sponsor wallet not found")
		return
	}

	asset, err := r.as.Get(request.Code)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "asset not found")
		return
	}

	ops := []entity.Operation{
		{
			Type:    entity.PaymentOp,
			Target:  asset.Distributor.Key.PublicKey,
			Amount:  request.Amount,
			Sponsor: sponsor.Key.PublicKey,
			Asset: entity.OpAsset{
				Code:   request.Code,
				Issuer: asset.Issuer.Key.PublicKey,
			},
			Origin: asset.Issuer.Key.PublicKey,
		},
	}

	res, err := r.m.SendMessage(entity.EnvelopeChannel, entity.EnvelopeRequest{
		MainSource: asset.Issuer.Key.PublicKey,
		PublicKeys: []string{sponsor.Key.PublicKey, asset.Issuer.Key.PublicKey},
		Operations: ops,
	})
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "starlabs messaging problems")
		return
	}

	_, ok := res.Message.(entity.EnvelopeResponse)
	if !ok {
		errorResponse(c, http.StatusInternalServerError, "unexpected starlabs response")
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "asset minted"})
}

// @Summary Burn an asset
// @Description Burn an asset on Stellar
// @Tags  	    Assets
// @Accept      json
// @Produce     json
// @Param       request body BurnAssetRequest true "Asset info"
// @Success     200 {object} entity.Asset
// @Failure     400 {object} response
// @Failure     404 {object} response
// @Failure     500 {object} response
// @Router      /assets/burn [post]
func (r *assetsRoutes) burnAsset(c *gin.Context) {
	var request BurnAssetRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()))
		return
	}

	asset, err := r.as.Get(request.Id)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "asset not found")
		return
	}

	ops := []entity.Operation{
		{
			Type:    entity.PaymentOp,
			Sponsor: asset.Distributor.Key.PublicKey,
			Target:  asset.Issuer.Key.PublicKey,
			Amount:  request.Amount,
			Asset: entity.OpAsset{
				Code:   asset.Code,
				Issuer: asset.Issuer.Key.PublicKey,
			},
			Origin: asset.Distributor.Key.PublicKey,
		},
	}

	res, err := r.m.SendMessage(entity.EnvelopeChannel, entity.EnvelopeRequest{
		MainSource: asset.Distributor.Key.PublicKey,
		PublicKeys: []string{asset.Distributor.Key.PublicKey, asset.Issuer.Key.PublicKey},
		Operations: ops,
	})
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "starlabs messaging problems")
		return
	}

	_, ok := res.Message.(entity.EnvelopeResponse)
	if !ok {
		errorResponse(c, http.StatusInternalServerError, "unexpected starlabs response")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Asset burned successfully",
	})
}
