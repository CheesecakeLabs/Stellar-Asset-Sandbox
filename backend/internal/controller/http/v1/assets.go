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
	}
}

type CreateAssetRequest struct {
	SponsorId int    `json:"sponsor_id"       binding:"required"  example:"2"`
	Code      string `json:"code"       binding:"required"  example:"USDC"`
	Limit     int    `json:"limit"         example:"1000"`
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
// @Router      /wallets/fund/ [post]
func (r *assetsRoutes) createAsset(c *gin.Context) {
	var request CreateAssetRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		errorResponse(c, http.StatusBadRequest, "invalid request body: %x")
		return
	}

	sponsor, err := r.w.Get(request.SponsorId)
	if err != nil {
		fmt.Println(err)
		errorResponse(c, http.StatusNotFound, "sponsor wallet not found")
		return
	}

	res, err := r.m.SendMessage(entity.CreateKeypairChannel, entity.CreateKeypairRequest{Amount: 2})
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "kms messaging problems")
		return
	}

	kpRes := res.Message.(entity.CreateKeypairResponse)
	issuerPk := kpRes.PublicKeys[0]
	distPk := kpRes.PublicKeys[1]

	res, err = r.m.SendMessage(entity.EnvelopeChannel, entity.EnvelopeRequest{
		MainSource: sponsor.Key.PublicKey,
		PublicKeys: []string{sponsor.Key.PublicKey, distPk},
		Operations: []entity.Operation{
			{
				Type:   "createAccount",
				Target: issuerPk,
				Amount: _startingBalance,
				Origin: sponsor.Key.PublicKey,
			},
			{
				Type:   "createAccount",
				Target: distPk,
				Amount: _startingBalance,
				Origin: sponsor.Key.PublicKey,
			},
			{
				Type:    "changeTrust",
				Sponsor: sponsor.Key.PublicKey,
				Asset: entity.OpAsset{
					Code:   request.Code,
					Issuer: issuerPk,
				},
				TrustLimit: &request.Limit,
				Origin:     distPk,
			},
		},
	})
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "starlabs messaging problems")
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
		fmt.Println(err)
		errorResponse(c, http.StatusNotFound, "database problems")
		return
	}
	fmt.Println("oi")
	fmt.Println(asset)
	c.JSON(http.StatusOK, asset)
}
