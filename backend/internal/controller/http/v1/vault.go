package v1

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

type vaultRoutes struct {
	m  HTTPControllerMessenger
	a  usecase.AuthUseCase
	v  usecase.VaultUseCase
	vc usecase.VaultCategoryUseCase
	w  usecase.WalletUseCase
	as usecase.AssetUseCase
}

func newVaultRoutes(handler *gin.RouterGroup, m HTTPControllerMessenger, a usecase.AuthUseCase, v usecase.VaultUseCase, vc usecase.VaultCategoryUseCase,
	w usecase.WalletUseCase, as usecase.AssetUseCase,
) {
	r := &vaultRoutes{m, a, v, vc, w, as}
	h := handler.Group("/vault").Use(Auth(r.a.ValidateToken()))
	{
		h.GET("/:id", r.getVaultById)
		h.POST("", r.createVault)
		h.GET("list", r.getAllVaults)
		h.PUT("/vault-category/:id", r.updateVaultCategory)
		h.PUT("/vault-asset/:id", r.updateVaultAsset)
		h.PUT("/vault-delete/:id", r.deleteVault)
	}
}

type CreateVaultRequest struct {
	Name            string `json:"name" binding:"required" example:"Treasury"`
	VaultCategoryId int    `json:"vault_category_id" binding:"required" example:"1"`
	AssetsId        []int  `json:"assets_id" binding:"required"`
}

type UpdateVaultCategoryRequest struct {
	Name            string `json:"name" example:"Vault 2"`
	VaultCategoryId int    `json:"vault_category_id"   binding:"required"  example:"1"`
}

type UpdateVaultAssetRequest struct {
	AssetCode     string `json:"asset_code"   binding:"required"  example:"1"`
	AssetIssuerPK string `json:"asset_issuer_pk"   binding:"required"  example:"1"`
	IsAdd         bool   `json:"is_add"   example:"true"`
	IsRemove      bool   `json:"is_remove"   example:"false"`
}

// @Summary     Create a new vault
// @Description Create and issue a new asset on Stellar
// @Tags  	    Vault
// @Accept      json
// @Produce     json
// @Param       request body CreateVaultRequest true "CreateVaultRequest"
// @Success     200 {object} entity.Vault
// @Failure     400 {object} response
// @Failure     404 {object} response
// @Failure     500 {object} response
// @Router      /vault [post]
func (r *vaultRoutes) createVault(c *gin.Context) {
	var request CreateVaultRequest
	var err error

	if err := c.ShouldBindJSON(&request); err != nil {
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()), err)
		return
	}

	vaultCategory, err := r.vc.GetById(request.VaultCategoryId)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "source wallet not found", err)
		return
	}

	sponsorID := _sponsorId

	sponsor, err := r.w.Get(sponsorID)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "sponsor wallet not found", err)
		return
	}

	res, err := r.m.SendMessage(entity.CreateKeypairChannel, entity.CreateKeypairRequest{Amount: 1})
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "kms messaging problems", err)
		return
	}

	kpRes, ok := res.Message.(entity.CreateKeypairResponse)
	if !ok || len(kpRes.PublicKeys) != 1 {
		errorResponse(c, http.StatusInternalServerError, "unexpected kms response", err)
		return
	}
	walletPk := kpRes.PublicKeys[0]

	ops := []entity.Operation{
		{
			Type:    entity.CreateAccountOp,
			Target:  walletPk,
			Amount:  _startingBalance,
			Origin:  sponsor.Key.PublicKey,
			Sponsor: sponsor.Key.PublicKey,
		},
	}

	for _, assetId := range request.AssetsId {
		asset, err := r.as.GetById(strconv.Itoa(assetId))
		if err != nil {
			errorResponse(c, http.StatusNotFound, "asset not found", err)
			return
		}

		ops = append(ops, entity.Operation{
			Type:    entity.ChangeTrustOp,
			Sponsor: sponsor.Key.PublicKey,
			Asset: entity.OpAsset{
				Code:   asset.Code,
				Issuer: asset.Issuer.Key.PublicKey,
			},
			Origin: walletPk,
		})
	}

	res, err = r.m.SendMessage(entity.EnvelopeChannel, entity.EnvelopeRequest{
		MainSource: sponsor.Key.PublicKey,
		PublicKeys: []string{sponsor.Key.PublicKey, walletPk},
		Operations: ops,
	})
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "starlabs messaging problems", err)
		return
	}
	_, ok = res.Message.(entity.EnvelopeResponse)
	if !ok {
		errorResponse(c, http.StatusInternalServerError, "unexpected starlabs response", err)
		return
	}

	wallet := entity.Wallet{
		Type:   entity.DistributorType,
		Funded: true,
		Key: entity.Key{
			PublicKey: walletPk,
			Weight:    1,
		},
	}

	vault := entity.Vault{
		Name:          request.Name,
		VaultCategory: vaultCategory,
		Wallet:        wallet,
	}

	vault, err = r.v.Create(vault)
	if err != nil {
		errorResponse(c, http.StatusNotFound, fmt.Sprintf("error: %s", err.Error()), err)
		return
	}

	c.JSON(http.StatusOK, vault)
}

// @Summary Get all vault
// @Description Get all vault
// @Tags  	    Vault
// @Accept      json
// @Produce     json
// @Success     200 {object} []entity.Vault
// @Failure     500 {object} response
// @Router      /vault/list [get]
func (r *vaultRoutes) getAllVaults(c *gin.Context) {
	vault, err := r.v.GetAll()
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "error getting vault", err)
		return
	}

	c.JSON(http.StatusOK, vault)
}

// @Summary Get vault
// @Description Get vault
// @Tags  	    Vault
// @Accept      json
// @Produce     json
// @Success     200 {object} entity.Vault
// @Failure     500 {object} response
// @Router      /vault/{id} [get]
func (r *vaultRoutes) getVaultById(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, "invalid vault ID", err)
		return
	}

	vault, err := r.v.GetById(id)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "error getting vault", err)
		return
	}

	c.JSON(http.StatusOK, vault)
}

// @Summary     Update a vault category
// @Description Update a vault category by providing the Vault Category ID and the updated information.
// @Tags  	    Vault Category
// @Accept      json
// @Produce     json
// @Param       id path string true "Vault Category ID" Format(uuid)
// @Param       request body UpdateVaultCategoryRequest true "Vault Category info"
// @Success     200 {object} entity.Vault "Updated vault category information"
// @Failure     400 {object} response "Bad Request: Invalid input data"
// @Failure     404 {object} response "Not Found: Vault category not found"
// @Failure     500 {object} response "Internal Server Error: Failed to update vault category"
// @Router      /vault-category/{id} [put]
func (r *vaultRoutes) updateVaultCategory(c *gin.Context) {
	// Get the ID of the vault to be updated from the URL parameters
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, "invalid vault ID", err)
		return
	}

	var request UpdateVaultCategoryRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()), err)
		return
	}

	// Find the existing vault by its ID
	existingVault, err := r.v.GetById(id)
	if err != nil {
		if err.Error() == "VaultRepo - GetVaultById - Vault not found" {
			errorResponse(c, http.StatusNotFound, "vault not found", err)
			return
		}
		errorResponse(c, http.StatusInternalServerError, "error finding vault", err)
		return
	}

	// Update the vault data
	existingVault.Name = request.Name
	existingVault.VaultCategory.Id = request.VaultCategoryId

	updatedVault, err := r.v.UpdateVault(existingVault)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "error updating vault category", err)
		return
	}

	c.JSON(http.StatusOK, updatedVault)
}

// @Summary     Update a vault asset
// @Description Update a vault by providing the Vault ID and the updated the asset.
// @Tags  	    Vault
// @Accept      json
// @Produce     json
// @Param       id path string true "Vault ID" Format(uuid)
// @Param       request body UpdateVaultAssetRequest true "Vault asset info"
// @Success     200 {object} entity.Vault "Updated vault asset information"
// @Failure     400 {object} response "Bad Request: Invalid input data"
// @Failure     404 {object} response "Not Found: Vault not found"
// @Failure     500 {object} response "Internal Server Error: Failed to update vault asset"
// @Router      /vault-asset/{id} [put]
func (r *vaultRoutes) updateVaultAsset(c *gin.Context) {
	// Get the ID of the vault to be updated from the URL parameters
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, "invalid vault ID", err)
		return
	}

	var request []UpdateVaultAssetRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		errorResponse(c, http.StatusBadRequest, fmt.Sprintf("invalid request body: %s", err.Error()), err)
		return
	}

	// Get the vault by its ID and the asset by its ID
	vault, err := r.v.GetById(id)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "vault not found", err)
		return
	}

	sponsor, err := r.w.Get(_sponsorId)
	if err != nil {
		errorResponse(c, http.StatusNotFound, "sponsor wallet not found", err)
		return
	}

	// Create the the envelope transaction
	_trustLimit := 0
	ops := []entity.Operation{}

	for _, asset := range request {
		if asset.IsAdd {
			ops = append(ops, entity.Operation{
				Type:    entity.ChangeTrustOp,
				Sponsor: sponsor.Key.PublicKey,
				Asset: entity.OpAsset{
					Code:   asset.AssetCode,
					Issuer: asset.AssetIssuerPK,
				},
				Origin: vault.Wallet.Key.PublicKey,
			})
		}
		if asset.IsRemove {
			ops = append(ops, entity.Operation{
				Type:    entity.ChangeTrustOp,
				Origin:  vault.Wallet.Key.PublicKey,
				Sponsor: sponsor.Key.PublicKey,
				Asset: entity.OpAsset{
					Code:   asset.AssetCode,
					Issuer: asset.AssetIssuerPK,
				}, TrustLimit: &_trustLimit, // Initialize directly as a pointer to int and set 0
			})
		}
	}

	res, err := r.m.SendMessage(entity.EnvelopeChannel, entity.EnvelopeRequest{
		MainSource: sponsor.Key.PublicKey,
		PublicKeys: []string{sponsor.Key.PublicKey, vault.Wallet.Key.PublicKey},
		Operations: ops,
	})
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "starlabs messaging problems", err)
		return
	}

	_, ok := res.Message.(entity.EnvelopeResponse)
	if !ok {
		errorResponse(c, http.StatusInternalServerError, "unexpected starlabs response", err)
		return
	}

	c.JSON(http.StatusOK, vault)
}

// @Summary     Update a vault status
// @Description Update a vault by providing the Vault ID and the updated the status.
// @Tags  	    Vault
// @Accept      json
// @Produce     json
// @Param       id path string true "Vault ID" Format(uuid)
// @Success     200 {object} entity.Vault "Updated vault status information"
// @Failure     400 {object} response "Bad Request: Invalid input data"
// @Failure     404 {object} response "Not Found: Vault not found"
// @Failure     500 {object} response "Internal Server Error: Failed to update vault status"
// @Router      /vault-delete/{id} [put]
func (r *vaultRoutes) deleteVault(c *gin.Context) {
	// Get the ID of the vault to be updated from the URL parameters
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, "invalid vault ID", err)
		return
	}

	// Find the existing vault by its ID
	existingVault, err := r.v.GetById(id)
	if err != nil {
		if err.Error() == "VaultRepo - GetVaultById - Vault not found" {
			errorResponse(c, http.StatusNotFound, "vault not found", err)
			return
		}
		errorResponse(c, http.StatusInternalServerError, "error finding vault", err)
		return
	}

	// Delete the vault data
	existingVault.Active = 0

	deletedVault, err := r.v.DeleteVault(existingVault)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "error delete vault", err)
		return
	}

	c.JSON(http.StatusOK, deletedVault)
}
