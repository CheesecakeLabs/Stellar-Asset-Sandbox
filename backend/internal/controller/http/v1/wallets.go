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
	// l logger.Interface
}

func newWalletsRoutes(handler *gin.RouterGroup, t usecase.WalletUseCase) {
	r := &walletsRoutes{t}

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

// @Summary     Show history
// @Description Show all translation history
// @ID          history
// @Tags  	    translation
// @Accept      json
// @Produce     json
// @Success     200 {object} userResponse
// @Failure     500 {object} response
// @Router      /translation/history [get]
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
	// create keypair in kms
	// send to starlabs
	wallet, err := r.t.Create(entity.Wallet{Type: entity.SponsorType})
	if err != nil {
		// r.l.Error(err, "http - v1 - history")
		// errorResponse(c, http.StatusInternalServerError, "database problems")
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusOK, walletResponse{Wallet: wallet})
}
