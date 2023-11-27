package v1

import (
	"fmt"
	"net/http"

	rolePermission "github.com/CheesecakeLabs/token-factory-v2/backend/internal/controller/http/role_permission"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/logger"
	"github.com/gin-gonic/gin"
)

type usersRoutes struct {
	t  usecase.UserUseCase
	a  usecase.AuthUseCase
	rP usecase.RolePermissionUseCase
	v  usecase.VaultUseCase
	// l logger.Interface
	l  logger.Interface
}

func newUserRoutes(handler *gin.RouterGroup, t usecase.UserUseCase, a usecase.AuthUseCase, rP usecase.RolePermissionUseCase, l logger.Interface, v usecase.VaultUseCase) {
	r := &usersRoutes{t, a, rP, l}

	h := handler.Group("/users")
	{
		h.POST("/create", r.createUser)
		h.POST("/login", r.autentication)
		h.POST("/logout", r.logout)

		secured := h.Group("/").Use(Auth(a.ValidateToken()))
		{
			secured.POST("/edit-profile", r.editUsersRole)
			secured.GET("/profile", r.getProfile)
			secured.GET("/list-users", r.getAllUsers)
		}

		allowedRoute := h.Group("/").Use(Auth(a.ValidateToken())).Use(rolePermission.Validate(rP))
		{
			allowedRoute.GET("/approve-new-accounts", r.detail)
			allowedRoute.POST("/edit-users-role", r.editUsersRole)
		}
	}
}

type userResponse struct {
	User entity.User `json:"user"`
}

func (r *usersRoutes) detail(c *gin.Context) {
	user, err := r.t.Detail("email")
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
		r.l.Error(err, "http - v1 - create - ShouldBindJSON")
		errorResponse(c, http.StatusBadRequest, "invalid request body", err)
		return
	}

	tokenString, err := GenerateJWT(user, r.a.ValidateToken())
	if err != nil {
		r.l.Error(err, "http - v1 - create - GenerateJWT")
		errorResponse(c, http.StatusInternalServerError, "error generating token", err)
		return
	}
	user.Token = tokenString

	if err := r.t.CreateUser(user); err != nil {
		r.l.Error(err, "http - v1 - create - CreateUser")
		errorResponse(c, http.StatusInternalServerError, "database problems", err)
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
		r.l.Error(err, "http - v1 - autentication - ShouldBindJSON")
		errorResponse(c, http.StatusBadRequest, "invalid request body", err)
		return
	}
	// check if user exists and password is correct
	user, err := r.t.Autentication(user.Email, user.Password)
	if err != nil {
		r.l.Error(err, "http - v1 - autentication - Autentication")
		errorResponse(c, http.StatusInternalServerError, "database problems", err)
		return
	}
	tokenString, err := GenerateJWT(user, r.a.ValidateToken())
	if err != nil {
		r.l.Error(err, "http - v1 - autentication - GenerateJWT")
		errorResponse(c, http.StatusInternalServerError, "error generating token", err)
		return
	}
	err = r.a.UpdateToken(user.ID, tokenString)
	if err != nil {
		r.l.Error(err, "http - v1 - autentication - UpdateToken")
		errorResponse(c, http.StatusInternalServerError, "error updating token", err)
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
		r.l.Error(err, "http - v1 - logout - ShouldBindJSON")
		errorResponse(c, http.StatusBadRequest, "invalid request body", err)
		return
	}
	err := r.a.UpdateToken(user.Email, "")
	if err != nil {
		r.l.Error(err, "http - v1 - logout - UpdateToken")
		errorResponse(c, http.StatusInternalServerError, "error updating token", err)
		return
	}
	c.JSON(http.StatusOK, userResponse{User: user})
}

// @Summary GET All Users
// @Description List users
// @Schemes
// @Tags user
// @Accept json
// @Produce json
// @Success 200  {object} []entity.UserResponse
// @Router /users/list-users [get]
func (r *usersRoutes) getAllUsers(c *gin.Context) {
	users, err := r.t.GetAllUsers()
	if err != nil {
		r.l.Error(err, "http - v1 - getAllUsers")
		errorResponse(c, http.StatusInternalServerError, "database problems", err)
		return
	}

	c.JSON(http.StatusOK, users)
}

// @Summary     Edit users role
// @Description Edit users role
// @ID          editUsersRole
// @Tags  	    user
// @Accept      json
// @Produce     json
// @Success     200 {object} entity.UserRole
// @Failure     500 {object} response
// @Router      /users/edit-users-role [post]
func (r *usersRoutes) editUsersRole(c *gin.Context) {
	var userRole entity.UserRole
	if err := c.ShouldBindJSON(&userRole); err != nil {
		r.l.Error(err, "http - v1 - editUserRole - ShouldBindJSON")
		errorResponse(c, http.StatusBadRequest, "invalid request body", err)
		return
	}

	if err := r.t.EditUsersRole(userRole); err != nil {
		r.l.Error(err, "http - v1 - editUsersRole - EditUsersRole")
		errorResponse(c, http.StatusInternalServerError, "database problems", err)
		return
	}

	c.JSON(http.StatusOK, userRole)
}

// @Summary GET Profile
// @Description Get PRofile
// @Schemes
// @Tags user
// @Accept json
// @Produce json
// @Success 200  {object} entity.UserResponse
// @Router /users/profile [get]
func (r *usersRoutes) getProfile(c *gin.Context) {
	token := c.GetHeader("Authorization")
	profile, err := r.t.GetProfile(token)
	if err != nil {
		r.l.Error(err, "http - v1 - getProfile - GetProfile")
		errorResponse(c, http.StatusInternalServerError, "database problems", err)
		return
	}

	if profile.VaultId != nil {
		vault, err := r.v.GetById(*profile.VaultId)
		if err != nil {
			fmt.Println(err)
			return
		}

		profile.Vault = &vault
	}

	c.JSON(http.StatusOK, profile)
}
