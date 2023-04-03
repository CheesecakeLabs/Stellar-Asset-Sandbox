package v1

import (
	"fmt"
	"net/http"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

type usersRoutes struct {
	t usecase.UserUseCase
	// l logger.Interface
}

func newUserRoutes(handler *gin.RouterGroup, t usecase.UserUseCase) {
	r := &usersRoutes{t}

	h := handler.Group("/users")
	{
		h.GET("/history", r.detail)
	}
}

type userResponse struct {
	User entity.User `json:"user"`
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
func (r *usersRoutes) detail(c *gin.Context) {
	user, err := r.t.Detail("name")
	if err != nil {
		// r.l.Error(err, "http - v1 - history")
		// errorResponse(c, http.StatusInternalServerError, "database problems")
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusOK, userResponse{user})
}
