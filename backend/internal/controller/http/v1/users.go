package v1

import (
	"fmt"
	"net/http"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	rolePermission "github.com/CheesecakeLabs/token-factory-v2/backend/internal/controller/http/role_permission"
	"github.com/gin-gonic/gin"
)

type usersRoutes struct {
	t usecase.UserUseCase
	a usecase.AuthUseCase
	rP usecase.RolePermissionUseCase
	// l logger.Interface
}

func newUserRoutes(handler *gin.RouterGroup, t usecase.UserUseCase, a usecase.AuthUseCase, rP usecase.RolePermissionUseCase) {
	r := &usersRoutes{t, a, rP}

	h := handler.Group("/users")
	{
		h.POST("/create", r.createUser)
		h.POST("/login", r.autentication)
		h.POST("/logout", r.logout)
		secured := h.Group("/").Use(Auth(a.ValidateToken())).Use(rolePermission.Validate(rP))
		{
			secured.GET("/approve-new-accounts", r.detail)
		}
	}
}

type userResponse struct {
	User  entity.User `json:"user"`
}

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
		errorResponse(c, http.StatusBadRequest, "invalid request body")
		fmt.Println(err)
		return
	}
	// check if user exists and password is correct
	user, err := r.t.Autentication(user.Name, user.Password)
	if err != nil {
		// r.l.Error(err, "http - v1 - create")
		errorResponse(c, http.StatusInternalServerError, "database problems")
		fmt.Println(err)
		return
	}
	tokenString, err := GenerateJWT(user, r.a.ValidateToken())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Abort()
		return
	}
	err = r.a.UpdateToken(user.ID, tokenString)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Abort()
		return
	}
	user.Token = tokenString
	c.JSON(http.StatusOK, userResponse{User: user})
}

// @Summary Logout User
// @Description Logout User
// @ID logout
// @Tags user
// @Accept json
// @Produce json
// @Success 200 {object} userResponse
// @Failure 500 {object} response
// @Router /user/logout [post]
func (r *usersRoutes) logout(c *gin.Context) {
	var user entity.User
	if err := c.ShouldBindJSON(&user); err != nil {
		// r.l.Error(err, "http - v1 - create")
		// errorResponse(c, http.StatusBadRequest, "invalid request body")
		fmt.Println(err)
		return
	}
	err := r.a.UpdateToken(user.Name, "")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, userResponse{User: user})
}
