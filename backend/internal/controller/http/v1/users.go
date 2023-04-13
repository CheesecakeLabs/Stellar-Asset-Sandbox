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
	a usecase.AuthUseCase
	// l logger.Interface
}

func newUserRoutes(handler *gin.RouterGroup, t usecase.UserUseCase, a usecase.AuthUseCase) {
	r := &usersRoutes{t, a}

	h := handler.Group("/users")
	{
		h.POST("/create", r.createUser)
		h.POST("/login", r.autentication)
		secured := h.Group("/").Use(Auth(a.GetJWTSecretKey()))
		{
			secured.GET("/detail", r.detail)
		}
	}
}

type userResponse struct {
	User  entity.User `json:"user"`
	Token string
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

	c.JSON(http.StatusOK, userResponse{User: user})
}

// @Summary     Create user
// @Description Create user
// @ID          create
// @Tags  	    user
// @Accept      json
// @Produce     json
// @Success     200 {object} userResponse
// @Failure     500 {object} response
// @Router      /user/create [post]
func (r *usersRoutes) createUser(c *gin.Context) {
	var user entity.User
	if err := c.ShouldBindJSON(&user); err != nil {
		// r.l.Error(err, "http - v1 - create")
		// errorResponse(c, http.StatusBadRequest, "invalid request body")
		fmt.Println(err)
		return
	}

	if err := r.t.CreateUser(user); err != nil {
		// r.l.Error(err, "http - v1 - create")
		// errorResponse(c, http.StatusInternalServerError, "database problems")
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusOK, userResponse{User: user})
}

// @Summary Autentication User
// @Description Autentication User
// @ID autentication
// @Tags user
// @Accept json
// @Produce json
// @Success 200 {object} userResponse
// @Failure 500 {object} response
// @Router /user/login [post]
func (r *usersRoutes) autentication(c *gin.Context) {
	var user entity.User
	if err := c.ShouldBindJSON(&user); err != nil {
		// r.l.Error(err, "http - v1 - create")
		// errorResponse(c, http.StatusBadRequest, "invalid request body")
		fmt.Println(err)
		return
	}
	// check if user exists and password is correct
	user, err := r.t.Autentication(user.Name, user.Password)
	if err != nil {
		// r.l.Error(err, "http - v1 - create")
		// errorResponse(c, http.StatusInternalServerError, "database problems")
		fmt.Println(err)
		return
	}
	tokenString, err := GenerateJWT(user, r.a.GetJWTSecretKey())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Abort()
		return
	}
	err = r.a.UpdateToken(user.Name, tokenString)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, userResponse{User: user, Token: tokenString})
}
