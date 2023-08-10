package v1

import (
	"fmt"
	"net/http"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

const (
	_startingBalance = "4"
	_sponsorId       = 1
)

type assetsRoutes struct {
	w  usecase.WalletUseCase
	as usecase.AssetUseCase
	m  HTTPControllerMessenger
	a  usecase.AuthUseCase
}

func newAssetTomlRoutes(handler *gin.RouterGroup, w usecase.WalletUseCase, as usecase.AssetUseCase, m HTTPControllerMessenger, a usecase.AuthUseCase) {
	r := &assetsRoutes{w, as, m, a}
	h := handler.Group("/").Use()
	{
		h.GET("/.well-known/stellar.toml", r.retrieveToml)
	}
}

func newAssetsRoutes(handler *gin.RouterGroup, w usecase.WalletUseCase, as usecase.AssetUseCase, m HTTPControllerMessenger, a usecase.AuthUseCase) {
	r := &assetsRoutes{w, as, m, a}
	h := handler.Group("/assets").Use(Auth(r.a.ValidateToken()))
	{
		h.GET("", r.getAllAssets)
		h.POST("", r.createAsset)
		h.POST("/mint", r.mintAsset)
		h.POST("/update-auth-flags", r.updateAuthFlags)
		h.POST("/clawback", r.clawbackAsset)
		h.POST("/burn", r.burnAsset)
		h.POST("/transfer", r.transferAsset)
		h.POST("/generate-toml", r.generateTOML)
		h.PUT("/update-toml", r.updateTOML)
	}
}

type CreateAssetRequest struct {
	SponsorId int             `json:"sponsor_id"    example:"2"`
	Name      string          `json:"name"       binding:"required"  example:"USDC"`
	AssetType string          `json:"asset_type"       binding:"required"  example:"security_token"`
	Code      string          `json:"code"       binding:"required"  example:"USDC"`
	Limit     *int            `json:"limit"         example:"1000"`
	Amount    string          `json:"amount"        example:"1000"`
	SetFlags  []string        `json:"set_flags"       example:"[\"AUTH_REQUIRED_FLAGS\", \"AUTH_REVOCABLE_FLAGS\",\"AUTH_CLAWBACK_ENABLED\"]"`
	SetToml   bool            `json:"set_toml"       example:"true"`
	TomlData  entity.TomlData `json:"toml_data" example:"Example entity.TomlData"`
}

type BurnAssetRequest struct {
	Id        string `json:"id"       binding:"required"  example:"001"`
	SponsorId int    `json:"sponsor_id"        example:"2"`
	Amount    string `json:"amount"       binding:"required"  example:"1000"`
}

type MintAssetRequest struct {
	Id        string `json:"id"       binding:"required"  example:"12"`
	SponsorId int    `json:"sponsor_id"       example:"2"`
	Code      string `json:"code"       binding:"required"  example:"USDC"`
	Amount    string `json:"amount"       binding:"required"  example:"1000"`
}

type ClawbackAssetRequest struct {
	SponsorId int    `json:"sponsor_id"   example:"2"`
	Code      string `json:"code"       binding:"required"  example:"USDC"`
	Amount    string `json:"amount"       binding:"required"  example:"1000"`
	From      string `json:"from"       binding:"required"  example:"GDKIJJIKXLOM2NRMPNQZUUYK24ZPVFC6426GZAICZ6E5PQG2MIPIMB2L"`
}

type TransferAssetRequest struct {
	SourceWalletID      int    `json:"source_wallet_id" binding:"required" example:"1"`
	SponsorId           int    `json:"sponsor_id" example:"2"`
	DestinationWalletPK string `json:"destination_wallet_pk" binding:"required" example:"GABCD...."`
	AssetID             string `json:"asset_id" binding:"required" example:"12"`
	Amount              string `json:"amount" binding:"required" example:"12"`
}

type UpdateAuthFlagsRequest struct {
	TrustorId  int      `json:"trustor_id"  example:"2"`
	Issuer     int      `json:"issuer"       binding:"required"  example:"2"`
	Code       string   `json:"code"       binding:"required"  example:"USDC"`
	SetFlags   []string `json:"set_flags"   example:"[\"TRUST_LINE_AUTHORIZED\", \"TRUST_LINE_AUTHORIZED_TO_MAINTAIN_LIABILITIES\",\"TRUST_LINE_CLAWBACK_ENABLED\"]"`
	ClearFlags []string `json:"clear_flags"  example:"[\"TRUST_LINE_CLAWBACK_ENABLED\"]"`
	TrustorPK  string   `json:"trustor_pk"   example:"2"`
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

	sponsorID := request.SponsorId
	if sponsorID == 0 {
		sponsorID = _sponsorId
	}

	sponsor, err := r.w.Get(sponsorID)
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
			// Sponsor: sponsor.Key.PublicKey,
			Origin: sponsor.Key.PublicKey,
		},
		{
			Type:   entity.CreateAccountOp,
			Target: distPk,
			Amount: _startingBalance,
			// Sponsor: sponsor.Key.PublicKey,
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

	if request.Amount != "" {
		ops = append(ops, entity.Operation{
			Type:    entity.PaymentOp,
			Sponsor: sponsor.Key.PublicKey,
			Asset: entity.OpAsset{
				Code:   request.Code,
				Issuer: issuerPk,
			},
			Amount: request.Amount,
			Origin: issuerPk,
			Target: distPk,
		})
	}

	if request.SetFlags != nil {
		ops = append(ops, entity.Operation{
			Type:    entity.SetOptionsOp,
			Trustor: distPk,
			Asset: entity.OpAsset{
				Issuer: issuerPk,
				Code:   request.Code,
			},
			SetFlags: request.SetFlags,
			Origin:   issuerPk,
		})
	}

	res, err = r.m.SendMessage(entity.EnvelopeChannel, entity.EnvelopeRequest{
		MainSource: sponsor.Key.PublicKey,
		PublicKeys: []string{sponsor.Key.PublicKey, distPk, issuerPk},
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
		Name:      request.Name,
		AssetType: request.AssetType,
		Code:      request.Code,
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

	// See if we need to create a TOML file
	if !request.SetToml {
		c.JSON(http.StatusOK, asset)
	}

	_, err = r.as.UpdateToml(request.TomlData)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "error to retrieve TOML ")
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
// @Router      /assets/mint [post]
func (r *assetsRoutes) mintAsset(c *gin.Context) {
	var request MintAssetRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()))
		return
	}

	sponsorID := request.SponsorId
	if sponsorID == 0 {
		sponsorID = _sponsorId
	}
	_, err := r.w.Get(request.SponsorId)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "sponsor wallet not found")
		return
	}

	asset, err := r.as.GetById(request.Id)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "asset not found")
		return
	}
	ops := []entity.Operation{
		{
			Type:   entity.PaymentOp,
			Target: asset.Distributor.Key.PublicKey,
			Amount: request.Amount,
			Asset: entity.OpAsset{
				Code:   request.Code,
				Issuer: asset.Issuer.Key.PublicKey,
			},
			Origin: asset.Issuer.Key.PublicKey,
		},
	}
	res, err := r.m.SendMessage(entity.EnvelopeChannel, entity.EnvelopeRequest{
		MainSource: asset.Issuer.Key.PublicKey,
		PublicKeys: []string{asset.Issuer.Key.PublicKey},
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

	asset, err := r.as.GetById(request.Id)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "asset not found")
		return
	}

	sponsorID := request.SponsorId
	if sponsorID == 0 {
		sponsorID = _sponsorId
	}
	_, err = r.w.Get(request.SponsorId)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "sponsor wallet not found")
		return
	}
	ops := []entity.Operation{
		{
			Type:   entity.PaymentOp,
			Target: asset.Issuer.Key.PublicKey,
			Amount: request.Amount,
			Asset: entity.OpAsset{
				Code:   asset.Code,
				Issuer: asset.Issuer.Key.PublicKey,
			},
			Origin: asset.Distributor.Key.PublicKey,
		},
	}

	res, err := r.m.SendMessage(entity.EnvelopeChannel, entity.EnvelopeRequest{
		MainSource: asset.Distributor.Key.PublicKey,
		PublicKeys: []string{asset.Distributor.Key.PublicKey},
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

// @Summary Transfer an asset
// @Description Transfer an asset between wallets on Stellar
// @Tags  	    Assets
// @Accept      json
// @Produce     json
// @Param       request body TransferAssetRequest true "Transfer info"
// @Success     200 {object} response
// @Failure     400 {object} response
// @Failure     404 {object} response
// @Failure     500 {object} response
// @Router      /assets/transfer [post]
func (r *assetsRoutes) transferAsset(c *gin.Context) {
	var request TransferAssetRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()))
		return
	}

	sourceWallet, err := r.w.Get(request.SourceWalletID)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "source wallet not found")
		return
	}

	sponsorID := request.SponsorId
	if sponsorID == 0 {
		sponsorID = _sponsorId
	}
	_, err = r.w.Get(request.SponsorId)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "sponsor wallet not found")
		return
	}

	asset, err := r.as.GetById(request.AssetID)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "asset not found")
		return
	}
	ops := []entity.Operation{
		{
			Type:   entity.PaymentOp,
			Target: request.DestinationWalletPK,
			Amount: request.Amount,
			Asset: entity.OpAsset{
				Code:   asset.Code,
				Issuer: asset.Issuer.Key.PublicKey,
			},
			Origin: sourceWallet.Key.PublicKey,
		},
	}

	res, err := r.m.SendMessage(entity.EnvelopeChannel, entity.EnvelopeRequest{
		MainSource: sourceWallet.Key.PublicKey,
		PublicKeys: []string{sourceWallet.Key.PublicKey},
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

	c.JSON(http.StatusOK, gin.H{"message": "asset transferred"})
}

// @Summary     Clawback an asset
// @Description Clawback an asset on Stellar
// @Tags  	    Assets
// @Accept      json
// @Produce     json
// @Param       request body ClawbackAssetRequest true "Asset info"
// @Success     200 {object} response[string]
// @Failure     400 {object} response
// @Failure     404 {object} response
// @Failure     500 {object} response
// @Router      /assets/clawback [post]
func (r *assetsRoutes) clawbackAsset(c *gin.Context) {
	var request ClawbackAssetRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()))
		return
	}

	sponsorID := request.SponsorId
	if sponsorID == 0 {
		sponsorID = _sponsorId
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
			Type:    entity.ClawbackOp,
			Target:  asset.Issuer.Key.PublicKey,
			Origin:  request.From,
			Amount:  request.Amount,
			Sponsor: sponsor.Key.PublicKey,
			Asset: entity.OpAsset{
				Code:   request.Code,
				Issuer: asset.Issuer.Key.PublicKey,
			},
		},
	}

	res, err := r.m.SendMessage(entity.EnvelopeChannel, entity.EnvelopeRequest{
		MainSource: sponsor.Key.PublicKey,
		PublicKeys: []string{asset.Issuer.Key.PublicKey, sponsor.Key.PublicKey},
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

	c.JSON(http.StatusOK, gin.H{"message": "asset clawed back"})
}

// @Summary     Update authorization flags of a trust line
// @Description Update the authorization flags of a trust line on Stellar
// @Tags  	    Assets
// @Accept      json
// @Produce     json
// @Param       request body UpdateAuthFlagsRequest true "Authorization flags"
// @Success     200 {object} entity.Asset
// @Failure     400 {object} response
// @Failure     404 {object} response
// @Failure     500 {object} response
// @Router      /assets/auth-flags [post]
func (r *assetsRoutes) updateAuthFlags(c *gin.Context) {
	var request UpdateAuthFlagsRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()))
		return
	}

	asset, err := r.as.Get(request.Code)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "asset not found")
		return
	}

	var trustor entity.Wallet
	if request.TrustorId != 0 {
		trustor, err = r.w.Get(request.TrustorId)
		if err != nil {
			errorResponse(c, http.StatusNotFound, "trustor wallet not found")
			return
		}
	} else if request.TrustorPK != "" {
		trustor.Key.PublicKey = request.TrustorPK
	}

	op := entity.Operation{
		Type:    entity.SetTrustLineFlagsOp,
		Trustor: trustor.Key.PublicKey,
		Asset: entity.OpAsset{
			Issuer: asset.Issuer.Key.PublicKey,
			Code:   request.Code,
		},
		SetFlags:   request.SetFlags,
		ClearFlags: request.ClearFlags,
		Origin:     asset.Issuer.Key.PublicKey,
	}

	sponsor, err := r.w.Get(_sponsorId)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "sponsor wallet not found")
		return
	}

	res, err := r.m.SendMessage(entity.EnvelopeChannel, entity.EnvelopeRequest{
		MainSource: sponsor.Key.PublicKey,
		PublicKeys: []string{asset.Issuer.Key.PublicKey, sponsor.Key.PublicKey},
		Operations: []entity.Operation{op},
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

	c.JSON(http.StatusOK, gin.H{"message": "authorization flags updated"})
}

// @Summary Get all assets
// @Description Get all assets
// @Tags  	    Assets
// @Accept      json
// @Produce     json
// @Success     200 {object} []entity.Asset
// @Failure     500 {object} response
// @Router      /assets [get]
func (r *assetsRoutes) getAllAssets(c *gin.Context) {
	assets, err := r.as.GetAll()
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "error getting assets")
		return
	}

	c.JSON(http.StatusOK, assets)
}

// @Summary Create a TOML file
// @Description Create a TOML file
// @Tags  	    Assets
// @Accept      json
// @Produce     json
// @Param       request body entity.TomlData true "TOML info"
// @Success     200 {object} entity.TomlData
// @Failure     400 {object} response
// @Failure     500 {object} response
// @Router      /assets/generate-toml [post]
func (r *assetsRoutes) generateTOML(c *gin.Context) {
	var request entity.TomlData
	if err := c.ShouldBindJSON(&request); err != nil {
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()))
		return
	}

	toml, err := r.as.CreateToml(request)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "error creating TOML")
		return
	}

	c.Data(http.StatusOK, "application/toml", []byte(toml))
}

// @Summary Retrieve a TOML file
// @Description Retrieve a TOML file
// @Tags  	    Assets
// @Accept      json
// @Produce     json
// @Param       asset_issuer path string true "Asset issuer"
// @Success     200 {object} entity.TomlData
// @Failure     500 {object} response
// @Router      /.well-known/stellar.toml [get]
func (r *assetsRoutes) retrieveToml(c *gin.Context) {
	tomlContent, err := r.as.RetrieveToml()
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "error retrieving TOML")
		return
	}

	c.Data(http.StatusOK, "text/plain", []byte(tomlContent))
}

// @Summary Update a TOML file
// @Description Update a TOML file
// @Tags  	    Assets
// @Accept      json
// @Produce     json
// @Param       request body entity.TomlData true "TOML info"
// @Success     200 {object} entity.TomlData
// @Failure     400 {object} response
// @Failure     500 {object} response
// @Router      /assets/update-toml [put]
func (r *assetsRoutes) updateTOML(c *gin.Context) {
	var request entity.TomlData
	if err := c.ShouldBindJSON(&request); err != nil {
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()))
		return
	}

	toml, err := r.as.UpdateToml(request)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "error updating TOML")
		return
	}

	c.Data(http.StatusOK, "application/toml", []byte(toml))
}
