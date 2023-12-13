package v1

import (
	"encoding/base64"
	"fmt"
	"net/http"
	"strconv"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/logger"
	"github.com/gin-gonic/gin"
)

const (
	_startingBalance = "4"
	_sponsorId       = 1
)

type assetsRoutes struct {
	w      usecase.WalletUseCase
	as     usecase.AssetUseCase
	m      HTTPControllerMessenger
	a      usecase.AuthUseCase
	l      usecase.LogTransactionUseCase
	logger *logger.Logger
}

func newAssetTomlRoutes(handler *gin.RouterGroup, w usecase.WalletUseCase, as usecase.AssetUseCase, m HTTPControllerMessenger, a usecase.AuthUseCase, l usecase.LogTransactionUseCase, logger *logger.Logger) {
	r := &assetsRoutes{w, as, m, a, l, logger}
	h := handler.Group("/").Use()
	{
		h.GET("/.well-known/stellar.toml", r.retrieveToml)
	}
}

func newAssetsRoutes(handler *gin.RouterGroup, w usecase.WalletUseCase, as usecase.AssetUseCase, m HTTPControllerMessenger, a usecase.AuthUseCase, l usecase.LogTransactionUseCase, logger *logger.Logger) {
	r := &assetsRoutes{w, as, m, a, l, logger}

	h := handler.Group("/assets")
	h.Use(Auth(r.a.ValidateToken()))
	{
		h.GET("", r.getAllAssets)
		h.POST("", r.createAsset)
		h.POST("/mint", r.mintAsset)
		h.POST("/update-auth-flags", r.updateAuthFlags)
		h.POST("/clawback", r.clawbackAsset)
		h.POST("/burn", r.burnAsset)
		h.POST("/transfer", r.transferAsset)
		h.GET("/:id", r.getAssetById)
		h.POST("/:id/image", r.uploadAssetImage)
		h.POST("/generate-toml", r.generateTOML)
		h.PUT("/update-toml", r.updateTOML)
		h.GET("/toml-data", r.getTomlData)
		h.GET("/:id/image.png", r.getAssetImage)
	}
}

type CreateAssetRequest struct {
	SponsorId int      `json:"sponsor_id"    example:"2"`
	Name      string   `json:"name"       binding:"required"  example:"USDC"`
	AssetType string   `json:"asset_type"       binding:"required"  example:"security_token"`
	Code      string   `json:"code"       binding:"required"  example:"USDC"`
	Limit     *int     `json:"limit"         example:"1000"`
	Amount    string   `json:"amount"        example:"1000"`
	SetFlags  []string `json:"set_flags"       example:"[\"AUTH_REQUIRED_FLAGS\", \"AUTH_REVOCABLE_FLAGS\",\"AUTH_CLAWBACK_ENABLED\"]"`
	Image     string   `json:"image"        example:"iVBORw0KGgoAAAANSUhEUgAACqoAAAMMCAMAAAAWqpRaAAADAFBMVEX///..."`
}

type BurnAssetRequest struct {
	Id               string  `json:"id"       binding:"required"  example:"001"`
	SponsorId        int     `json:"sponsor_id"        example:"2"`
	Amount           string  `json:"amount"       binding:"required"  example:"1000"`
	CurrentSupply    float64 `json:"current_supply"       example:"1000"`
	CurrentMainVault float64 `json:"current_main_vault"       example:"1000"`
}

type MintAssetRequest struct {
	Id               string  `json:"id"       binding:"required"  example:"12"`
	SponsorId        int     `json:"sponsor_id"       example:"2"`
	Code             string  `json:"code"       binding:"required"  example:"USDC"`
	Amount           string  `json:"amount"       binding:"required"  example:"1000"`
	CurrentSupply    float64 `json:"current_supply"       example:"1000"`
	CurrentMainVault float64 `json:"current_main_vault"       example:"1000"`
}

type ClawbackAssetRequest struct {
	SponsorId        int     `json:"sponsor_id"   example:"2"`
	Code             string  `json:"code"       binding:"required"  example:"USDC"`
	Amount           string  `json:"amount"       binding:"required"  example:"1000"`
	From             string  `json:"from"       binding:"required"  example:"GDKIJJIKXLOM2NRMPNQZUUYK24ZPVFC6426GZAICZ6E5PQG2MIPIMB2L"`
	CurrentSupply    float64 `json:"current_supply"       example:"1000"`
	CurrentMainVault float64 `json:"current_main_vault"       example:"1000"`
}

type TransferAssetRequest struct {
	SourceWalletID      int     `json:"source_wallet_id" binding:"required" example:"1"`
	SponsorId           int     `json:"sponsor_id" example:"2"`
	DestinationWalletPK string  `json:"destination_wallet_pk" binding:"required" example:"GABCD...."`
	AssetID             string  `json:"asset_id" binding:"required" example:"12"`
	Amount              string  `json:"amount" binding:"required" example:"12"`
	CurrentSupply       float64 `json:"current_supply"       example:"1000"`
	CurrentMainVault    float64 `json:"current_main_vault"       example:"1000"`
}

type UpdateAuthFlagsRequest struct {
	TrustorId  int      `json:"trustor_id"  example:"2"`
	Issuer     int      `json:"issuer"       binding:"required"  example:"2"`
	Code       string   `json:"code"       binding:"required"  example:"USDC"`
	SetFlags   []string `json:"set_flags"   example:"[\"TRUST_LINE_AUTHORIZED\", \"TRUST_LINE_AUTHORIZED_TO_MAINTAIN_LIABILITIES\",\"TRUST_LINE_CLAWBACK_ENABLED\"]"`
	ClearFlags []string `json:"clear_flags"  example:"[\"TRUST_LINE_CLAWBACK_ENABLED\"]"`
	TrustorPK  string   `json:"trustor_pk"   example:"2"`
}

type UploadAssetImageRequest struct {
	Image string `json:"image"        example:"iVBORw0KGgoAAAANSUhEUgAACqoAAAMMCAMAAAAWqpRaAAADAFBMVEX///..."`
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
	var imageBytes []byte

	if err := c.ShouldBindJSON(&request); err != nil {
		r.logger.Error(err, "http - v1 - create asset - bind")
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()), err)
		return
	}

	token := c.Request.Header.Get("Authorization")
	user, err := r.a.GetUserByToken(token)
	if err != nil {
		r.logger.Error(err, "http - v1 - create asset - get user by token")
		errorResponse(c, http.StatusNotFound, "user not found", err)
		return
	}

	userID, err := strconv.Atoi(user.ID)
	if err != nil {
		r.logger.Error(err, "http - v1 - create asset - parse user id")
		errorResponse(c, http.StatusNotFound, "error to parse user id", err)
		return
	}

	sponsorID := request.SponsorId
	if sponsorID == 0 {
		sponsorID = _sponsorId
	}

	sponsor, err := r.w.Get(sponsorID)
	if err != nil {
		r.logger.Error(err, "http - v1 - create asset - get sponsor")
		errorResponse(c, http.StatusNotFound, "sponsor wallet not found", err)
		return
	}

	res, err := r.m.SendMessage(entity.CreateKeypairChannel, entity.CreateKeypairRequest{Amount: 2})
	if err != nil {
		r.logger.Error(err, "http - v1 - create asset - create keypair")
		errorResponse(c, http.StatusInternalServerError, "kms messaging problems", err)
		return
	}

	kpRes, ok := res.Message.(entity.CreateKeypairResponse)
	if !ok || len(kpRes.PublicKeys) != 2 {
		r.logger.Error(err, "http - v1 - create asset - unexpected kms response")
		errorResponse(c, http.StatusInternalServerError, "unexpected kms response", err)
		return
	}
	issuerPk := kpRes.PublicKeys[0]
	distPk := kpRes.PublicKeys[1]

	ops := []entity.Operation{
		{
			Type:    entity.CreateAccountOp,
			Target:  issuerPk,
			Amount:  _startingBalance,
			Sponsor: sponsor.Key.PublicKey,
			Origin:  sponsor.Key.PublicKey,
		},
		{
			Type:    entity.CreateAccountOp,
			Target:  distPk,
			Amount:  _startingBalance,
			Sponsor: sponsor.Key.PublicKey,
			Origin:  sponsor.Key.PublicKey,
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

	Id := generateID()
	_, err = r.m.SendMessage(entity.EnvelopeChannel, entity.EnvelopeRequest{
		Id:         Id,
		MainSource: sponsor.Key.PublicKey,
		PublicKeys: []string{sponsor.Key.PublicKey, distPk, issuerPk},
		Operations: ops,
	})
	if err != nil {
		r.logger.Error(err, fmt.Sprintf("http - v1 - create asset - send message %d", Id))
		errorResponse(c, http.StatusInternalServerError, "starlabs messaging problems", err)
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

	if request.Image != "" {
		imageBytes, err = base64.StdEncoding.DecodeString(request.Image)
		if err != nil {
			r.logger.Error(err, "http - v1 - create asset - decode image")
			errorResponse(c, http.StatusBadRequest, "Failed to decode base64 image", err)
			return
		}
	}

	asset, err = r.as.Create(asset, imageBytes)
	if err != nil {
		r.logger.Error(err, "http - v1 - create asset - create asset")
		errorResponse(c, http.StatusNotFound, "database problems", err)
		return
	}

	amount, err := strconv.ParseFloat(request.Amount, 64)
	if err != nil {
		amount = 0
	}
	err = r.l.CreateLogTransaction(entity.LogTransaction{
		Asset:             asset,
		Amount:            amount,
		TransactionTypeID: entity.CreateAsset,
		UserID:            userID,
		Description:       createLogDescription(entity.CreateAsset, asset.Code, nil, nil),
	})
	if err != nil {
		r.logger.Error(err, "http - v1 - create asset - create log transaction")
		errorResponse(c, http.StatusNotFound, "error to create log transaction", err)
		return
	}

	// Set TOML data
	var tomlData entity.TomlData
	tomlData.Currencies = []entity.Currency{
		{
			Code:   asset.Code,
			Issuer: asset.Issuer.Key.PublicKey,
			Name:   asset.Name,
		},
	}

	if asset.Id == 1 {
		_, err = r.as.CreateToml(tomlData)
		if err != nil {
			r.logger.Error(err, "http - v1 - create asset - create toml")
			errorResponse(c, http.StatusNotFound, "error to create TOML ", err)
			return
		}
	}

	_, err = r.as.UpdateToml(tomlData)
	if err != nil {
		r.logger.Error(err, "http - v1 - create asset - update toml")
		errorResponse(c, http.StatusNotFound, "error to update TOML ", err)
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
		r.logger.Error(err, "http - v1 - mint asset - bind")
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()), err)
		return
	}

	token := c.Request.Header.Get("Authorization")
	user, err := r.a.GetUserByToken(token)
	if err != nil {
		r.logger.Error(err, "http - v1 - mint asset - get user by token")
		errorResponse(c, http.StatusNotFound, "user not found", err)
		return
	}

	userID, err := strconv.Atoi(user.ID)
	if err != nil {
		r.logger.Error(err, "http - v1 - mint asset - parse user id")
		errorResponse(c, http.StatusNotFound, "error to parse user id", err)
		return
	}

	sponsorID := request.SponsorId
	if sponsorID == 0 {
		_, err = r.w.Get(_sponsorId)
	} else {
		_, err = r.w.Get(request.SponsorId)
	}
	if err != nil {
		r.logger.Error(err, "http - v1 - mint asset - get sponsor")
		errorResponse(c, http.StatusNotFound, "sponsor wallet not found", err)
		return
	}

	asset, err := r.as.GetById(request.Id)
	if err != nil {
		r.logger.Error(err, "http - v1 - mint asset - get asset")
		errorResponse(c, http.StatusNotFound, "asset not found", err)
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
	Id := generateID()
	_, err = r.m.SendMessage(entity.EnvelopeChannel, entity.EnvelopeRequest{
		Id:         Id,
		MainSource: asset.Issuer.Key.PublicKey,
		PublicKeys: []string{asset.Issuer.Key.PublicKey},
		Operations: ops,
	})
	if err != nil {
		r.logger.Error(err, fmt.Sprintf("http - v1 - mint asset - send message %d", Id))
		errorResponse(c, http.StatusInternalServerError, "starlabs messaging problems", err)
		return
	}

	amount, err := strconv.ParseFloat(request.Amount, 64)
	if err != nil {
		amount = 0
	}

	err = r.l.CreateLogTransaction(entity.LogTransaction{
		Asset:             asset,
		Amount:            amount,
		TransactionTypeID: entity.MintAsset,
		UserID:            userID,
		Description:       createLogDescription(entity.MintAsset, asset.Code, nil, nil),
		CurrentSupply:     &request.CurrentSupply,
		CurrentMainVault:  &request.CurrentMainVault,
	})
	if err != nil {
		r.logger.Error(err, "http - v1 - mint asset - create log transaction")
		errorResponse(c, http.StatusNotFound, "error to create log transaction", err)
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
		r.logger.Error(err, "http - v1 - burn asset - bind")
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()), err)
		return
	}

	token := c.Request.Header.Get("Authorization")
	user, err := r.a.GetUserByToken(token)
	if err != nil {
		r.logger.Error(err, "http - v1 - burn asset - get user by token")
		errorResponse(c, http.StatusNotFound, "user not found", err)
		return
	}

	userID, err := strconv.Atoi(user.ID)
	if err != nil {
		r.logger.Error(err, "http - v1 - burn asset - parse user id")
		errorResponse(c, http.StatusNotFound, "error to parse user id", err)
		return
	}

	asset, err := r.as.GetById(request.Id)
	if err != nil {
		r.logger.Error(err, "http - v1 - burn asset - get asset")
		errorResponse(c, http.StatusNotFound, "asset not found", err)
		return
	}

	sponsorID := request.SponsorId
	if sponsorID == 0 {
		_, err = r.w.Get(_sponsorId)
	} else {
		_, err = r.w.Get(request.SponsorId)
	}
	if err != nil {
		r.logger.Error(err, "http - v1 - burn asset - get sponsor")
		errorResponse(c, http.StatusNotFound, "sponsor wallet not found", err)
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

	Id := generateID()
	_, err = r.m.SendMessage(entity.EnvelopeChannel, entity.EnvelopeRequest{
		Id:         Id,
		MainSource: asset.Distributor.Key.PublicKey,
		PublicKeys: []string{asset.Distributor.Key.PublicKey},
		Operations: ops,
	})
	if err != nil {
		r.logger.Error(err, fmt.Sprintf("http - v1 - burn asset - send message %d", Id))
		errorResponse(c, http.StatusInternalServerError, "starlabs messaging problems", err)
		return

	}

	amount, err := strconv.ParseFloat(request.Amount, 64)
	if err != nil {
		amount = 0
	}
	err = r.l.CreateLogTransaction(entity.LogTransaction{
		Asset:             asset,
		TransactionTypeID: entity.BurnAsset,
		Amount:            amount,
		UserID:            userID,
		Description:       createLogDescription(entity.BurnAsset, asset.Code, nil, nil),
		CurrentSupply:     &request.CurrentSupply,
		CurrentMainVault:  &request.CurrentMainVault,
	})
	if err != nil {
		r.logger.Error(err, "http - v1 - burn asset - create log transaction")
		errorResponse(c, http.StatusNotFound, "error to create log transaction", err)
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
		r.logger.Error(err, "http - v1 - transfer asset - bind")
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()), err)
		return
	}

	token := c.Request.Header.Get("Authorization")
	user, err := r.a.GetUserByToken(token)
	if err != nil {
		r.logger.Error(err, "http - v1 - transfer asset - get user by token")
		errorResponse(c, http.StatusNotFound, "user not found", err)
		return
	}

	userID, err := strconv.Atoi(user.ID)
	if err != nil {
		r.logger.Error(err, "http - v1 - transfer asset - parse user id")
		errorResponse(c, http.StatusNotFound, "error to parse user id", err)
		return
	}

	sourceWallet, err := r.w.Get(request.SourceWalletID)
	if err != nil {
		r.logger.Error(err, "http - v1 - transfer asset - get source wallet")
		errorResponse(c, http.StatusNotFound, "source wallet not found", err)
		return
	}

	sponsorID := request.SponsorId
	if sponsorID == 0 {
		_, err = r.w.Get(_sponsorId)
	} else {
		_, err = r.w.Get(request.SponsorId)
	}
	if err != nil {
		r.logger.Error(err, "http - v1 - transfer asset - get sponsor")
		errorResponse(c, http.StatusNotFound, "sponsor wallet not found", err)
		return
	}

	asset, err := r.as.GetById(request.AssetID)
	if err != nil {
		r.logger.Error(err, "http - v1 - transfer asset - get asset")
		errorResponse(c, http.StatusNotFound, "asset not found", err)
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

	Id := generateID()
	_, err = r.m.SendMessage(entity.EnvelopeChannel, entity.EnvelopeRequest{
		Id:         Id,
		MainSource: sourceWallet.Key.PublicKey,
		PublicKeys: []string{sourceWallet.Key.PublicKey},
		Operations: ops,
	})
	if err != nil {
		r.logger.Error(err, fmt.Sprintf("http - v1 - transfer asset - send message %d", Id))
		errorResponse(c, http.StatusInternalServerError, "starlabs messaging problems", err)
		return
	}

	amount, err := strconv.ParseFloat(request.Amount, 64)
	if err != nil {
		amount = 0
	}
	err = r.l.CreateLogTransaction(entity.LogTransaction{
		Asset:             asset,
		Amount:            amount,
		TransactionTypeID: entity.TransferAsset,
		UserID:            userID,
		Description:       createLogDescription(entity.TransferAsset, asset.Code, nil, nil),
		OriginPK:          &sourceWallet.Key.PublicKey,
		DestinationPK:     &request.DestinationWalletPK,
		CurrentSupply:     &request.CurrentSupply,
		CurrentMainVault:  &request.CurrentMainVault,
	})
	if err != nil {
		r.logger.Error(err, "http - v1 - transfer asset - create log transaction")
		errorResponse(c, http.StatusNotFound, "error to create log transaction", err)
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
		r.logger.Error(err, "http - v1 - clawback asset - bind")
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()), err)
		return
	}

	token := c.Request.Header.Get("Authorization")
	user, err := r.a.GetUserByToken(token)
	if err != nil {
		r.logger.Error(err, "http - v1 - clawback asset - get user by token")
		errorResponse(c, http.StatusNotFound, "user not found", err)
		return
	}

	userID, err := strconv.Atoi(user.ID)
	if err != nil {
		r.logger.Error(err, "http - v1 - clawback asset - parse user id")
		errorResponse(c, http.StatusNotFound, "error to parse user id", err)
		return
	}

	sponsorID := request.SponsorId
	var sponsor entity.Wallet

	if sponsorID == 0 {
		sponsor, err = r.w.Get(_sponsorId)
	} else {
		sponsor, err = r.w.Get(request.SponsorId)
	}

	if err != nil {
		r.logger.Error(err, "http - v1 - clawback asset - get sponsor")
		errorResponse(c, http.StatusNotFound, "sponsor wallet not found", err)
		return
	}

	asset, err := r.as.Get(request.Code)
	if err != nil {
		r.logger.Error(err, "http - v1 - clawback asset - get asset")
		errorResponse(c, http.StatusNotFound, "asset not found", err)
		return
	}

	ops := []entity.Operation{
		{
			Type:    entity.ClawbackOp,
			Target:  asset.Issuer.Key.PublicKey,
			Origin:  request.From,
			Amount:  fmt.Sprintf("%v", request.Amount),
			Sponsor: sponsor.Key.PublicKey,
			Asset: entity.OpAsset{
				Code:   request.Code,
				Issuer: asset.Issuer.Key.PublicKey,
			},
		},
	}

	Id := generateID()
	_, err = r.m.SendMessage(entity.EnvelopeChannel, entity.EnvelopeRequest{
		Id:         Id,
		MainSource: sponsor.Key.PublicKey,
		PublicKeys: []string{asset.Issuer.Key.PublicKey, sponsor.Key.PublicKey},
		Operations: ops,
	})
	if err != nil {
		r.logger.Error(err, fmt.Sprintf("http - v1 - clawback asset - send message %d", Id))
		errorResponse(c, http.StatusInternalServerError, "starlabs messaging problems", err)
		return
	}

	amount, err := strconv.ParseFloat(request.Amount, 64)
	if err != nil {
		amount = 0
	}
	err = r.l.CreateLogTransaction(entity.LogTransaction{
		Asset:             asset,
		TransactionTypeID: entity.ClawbackAsset,
		Amount:            amount,
		UserID:            userID,
		Description:       createLogDescription(entity.ClawbackAsset, asset.Code, nil, nil),
		CurrentSupply:     &request.CurrentSupply,
		CurrentMainVault:  &request.CurrentMainVault,
	})
	if err != nil {
		r.logger.Error(err, "http - v1 - clawback asset - create log transaction")
		errorResponse(c, http.StatusNotFound, "error to create log transaction", err)
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
		r.logger.Error(err, "http - v1 - update auth flags - bind")
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()), err)
		return
	}

	token := c.Request.Header.Get("Authorization")
	user, err := r.a.GetUserByToken(token)
	if err != nil {
		r.logger.Error(err, "http - v1 - clawback asset - get user by token")
		errorResponse(c, http.StatusNotFound, "user not found", err)
		return
	}

	userID, err := strconv.Atoi(user.ID)
	if err != nil {
		r.logger.Error(err, "http - v1 - clawback asset - parse user id")
		errorResponse(c, http.StatusNotFound, "error to parse user id", err)
		return
	}

	asset, err := r.as.Get(request.Code)
	if err != nil {
		r.logger.Error(err, "http - v1 - update auth flags - get asset")
		errorResponse(c, http.StatusNotFound, "asset not found", err)
		return
	}

	var trustor entity.Wallet
	if request.TrustorId != 0 {
		trustor, err = r.w.Get(request.TrustorId)
		if err != nil {
			r.logger.Error(err, "http - v1 - update auth flags - get trustor")
			errorResponse(c, http.StatusNotFound, "trustor wallet not found", err)
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
		r.logger.Error(err, "http - v1 - update auth flags - get sponsor")
		errorResponse(c, http.StatusNotFound, "sponsor wallet not found", err)
		return
	}

	Id := generateID()
	_, err = r.m.SendMessage(entity.EnvelopeChannel, entity.EnvelopeRequest{
		Id:         Id,
		MainSource: sponsor.Key.PublicKey,
		PublicKeys: []string{asset.Issuer.Key.PublicKey, sponsor.Key.PublicKey},
		Operations: []entity.Operation{op},
	})
	if err != nil {
		r.logger.Error(err, fmt.Sprintf("http - v1 - update auth flags- send message %d", Id))
		errorResponse(c, http.StatusInternalServerError, "starlabs messaging problems", err)
		return

	}

	err = r.l.CreateLogTransaction(entity.LogTransaction{
		Asset:             asset,
		TransactionTypeID: entity.UpdateAuthFlags,
		UserID:            userID,
		Description:       createLogDescription(entity.UpdateAuthFlags, asset.Code, request.SetFlags, request.ClearFlags),
	})
	if err != nil {
		r.logger.Error(err, "http - v1 - update auth flags - create log transaction")
		errorResponse(c, http.StatusNotFound, "error to create log transaction", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "authorization flags updated"})
}

// @Summary Get all assets
// @Description Get all assets with optional pagination
// @Tags        Assets
// @Accept      json
// @Produce     json
// @Param       page query int false "Page number"
// @Param       limit query int false "Number of items per page"
// @Success     200 {object} []entity.Asset
// @Failure     500 {object} response
// @Router      /assets [get]
func (r *assetsRoutes) getAllAssets(c *gin.Context) {
	pageQuery := c.Query("page")
	limitQuery := c.Query("limit")

	if pageQuery != "" && limitQuery != "" {
		// Parse query parameters for pagination
		page, err := strconv.Atoi(pageQuery)
		if err != nil {
			r.logger.Error(err, "http - v1 - get all assets - parse page")
			errorResponse(c, http.StatusBadRequest, "Invalid page parameter", err)
			return
		}
		limit, err := strconv.Atoi(limitQuery)
		if err != nil {
			r.logger.Error(err, "http - v1 - get all assets - parse limit")
			errorResponse(c, http.StatusBadRequest, "Invalid limit parameter", err)
			return
		}

		// Fetch paginated assets
		assets, err := r.as.GetPaginatedAssets(page, limit)
		if err != nil {
			r.logger.Error(err, "http - v1 - get all assets - get paginated")
			errorResponse(c, http.StatusInternalServerError, "error getting paginated assets", err)
			return
		}

		c.JSON(http.StatusOK, assets)
	} else {
		// Fetch all assets
		assets, err := r.as.GetAll()
		if err != nil {
			r.logger.Error(err, "http - v1 - get all assets - get all")
			errorResponse(c, http.StatusInternalServerError, "error getting all assets", err)
			return
		}

		c.JSON(http.StatusOK, assets)
	}
}

// @Summary Get asset by id
// @Description Get asset by id
// @Tags  	    Assets
// @Accept      json
// @Produce     json
// @Success     200 {object} entity.Asset
// @Failure     500 {object} response
// @Router      /asset [get]
func (r *assetsRoutes) getAssetById(c *gin.Context) {
	assetId := c.Param("id")
	assets, err := r.as.GetById(assetId)
	if err != nil {
		r.logger.Error(err, "http - v1 - get asset by id - get by id")
		errorResponse(c, http.StatusInternalServerError, "error getting asset", err)
		return
	}

	c.JSON(http.StatusOK, assets)
}

// @Summary Upload image for an asset
// @Description Upload a base64 encoded image for a specific asset by ID
// @Tags  	    Assets
// @Accept      json
// @Produce     json
// @Param       id path string true "Asset ID"
// @Param       image body string true "Base64 Encoded Asset Image"
// @Success     200 {object} response
// @Failure     400 {object} response
// @Failure     500 {object} response
// @Router      /assets/{id}/image [post]
func (r *assetsRoutes) uploadAssetImage(c *gin.Context) {
	var req UploadAssetImageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		r.logger.Error(err, "http - v1 - upload asset image - bind")
		errorResponse(c, http.StatusBadRequest, "Invalid request format", err)
		return
	}

	// Decode the base64 string to get raw bytes
	decodedBytes, err := base64.StdEncoding.DecodeString(req.Image)
	if err != nil {
		r.logger.Error(err, "http - v1 - upload asset image - decode image")
		errorResponse(c, http.StatusBadRequest, "Failed to decode base64 image", err)
		return
	}

	assetId := c.Param("id")
	if err := r.as.UploadImage(assetId, decodedBytes); err != nil {
		r.logger.Error(err, "http - v1 - upload asset image - upload image")
		errorResponse(c, http.StatusInternalServerError, "Failed to store the image", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Image uploaded successfully",
	})
}

// @Summary     Retrieve asset image
// @Description Fetch the image of a specified asset using its ID
// @Tags        Assets
// @Produce     png
// @Param       id path string true "Asset ID"
// @Success     200 {file} image/png "Asset Image"
// @Failure     500 {object} response "Internal Server Error"
// @Router      /assets/{id}/image.png [get]
func (r *assetsRoutes) getAssetImage(c *gin.Context) {
	assetId := c.Param("id")
	image, err := r.as.GetImage(assetId)
	if err != nil {
		r.logger.Error(err, "http - v1 - get asset image - get image")
		errorResponse(c, http.StatusInternalServerError, "error getting asset", err)
		return
	}

	c.Data(http.StatusOK, "image/png", image)
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
		r.logger.Error(err, "http - v1 - generate toml - bind")
		errorResponse(c, http.StatusBadRequest, "invalid request body: %s", err)
		return
	}
	toml, err := r.as.CreateToml(request)
	if err != nil {
		r.logger.Error(err, "http - v1 - generate toml - create toml")
		errorResponse(c, http.StatusInternalServerError, "error creating TOML", err)
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
		errorResponse(c, http.StatusInternalServerError, "error retrieving TOML", err)
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
		r.logger.Error(err, "http - v1 - update toml - bind")
		errorResponse(c, http.StatusBadRequest, "invalid request body", err)
		return
	}

	toml, err := r.as.UpdateToml(request)
	if err != nil {
		r.logger.Error(err, "http - v1 - update toml - update toml")
		errorResponse(c, http.StatusInternalServerError, "error updating TOML", err)
		return
	}

	c.Data(http.StatusOK, "application/toml", []byte(toml))
}

// @Summary Get TOML data
// @Description Get TOML data
// @Tags  	    Assets
// @Accept      json
// @Produce     json
// @Param       asset_issuer path string true "Asset issuer"
// @Success     200 {object} entity.TomlData
// @Failure     500 {object} response
// @Router      /assets/toml [get]
func (r *assetsRoutes) getTomlData(c *gin.Context) {
	tomlContent, err := r.as.GetTomlData()
	if err != nil {
		r.logger.Error(err, "http - v1 - get toml data - get toml data")
		errorResponse(c, http.StatusInternalServerError, "error retrieving TOML", err)
		return
	}

	c.JSON(http.StatusOK, tomlContent)
}
