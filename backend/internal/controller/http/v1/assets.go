package v1

import (
	"net/http"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

type assetsRoutes struct {
	w usecase.WalletUseCase
	m HTTPControllerMessenger
}

func newAssetsRoutes(handler *gin.RouterGroup, w usecase.WalletUseCase, m HTTPControllerMessenger) {
	r := &assetsRoutes{w, m}
	h := handler.Group("/assets")
	{
		h.POST("", r.createAsset)
	}
}

type CreateAssetRequest struct {
	Code  string `json:"code"       binding:"required"  example:"USDC"`
	Limit int    `json:"limit"         example:"1000"`
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

	// wallet, err := r.w.Get(request.Id)
	// if err != nil {
	// 	fmt.Println(err)
	// 	errorResponse(c, http.StatusNotFound, "wallet not found")
	// 	return
	// }

	// if wallet.Funded {
	// 	errorResponse(c, http.StatusBadRequest, "wallet is already funded")
	// 	return
	// }

	// res, err := r.m.SendMessage(entity.HorizonChannel, entity.HorizonRequest{
	// 	Id:      wallet.Id,
	// 	Type:    "fundWithFriendbot",
	// 	Account: wallet.Key.PublicKey,
	// })
	// if err != nil {
	// 	errorResponse(c, http.StatusInternalServerError, "messaging problems")
	// }

	// fundRes := res.Message.(entity.HorizonResponse)

	// if fundRes.StatusCode != 200 {
	// 	errorResponse(c, http.StatusInternalServerError, "friendbot error")
	// 	return
	// }

	// wallet.Funded = true
	// wallet, err = r.w.Update(wallet)
	// if err != nil {
	// 	fmt.Println(err)
	// 	errorResponse(c, http.StatusInternalServerError, "database problems")
	// 	return
	// }

	c.JSON(http.StatusOK, nil)
}
