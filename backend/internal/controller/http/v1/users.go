package v1

import (
	"fmt"
	"net/http"

	rolePermission "github.com/CheesecakeLabs/token-factory-v2/backend/internal/controller/http/role_permission"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

type usersRoutes struct {
	t  usecase.UserUseCase
	a  usecase.AuthUseCase
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
		h.POST("/request-password-reset", r.requestPasswordReset)
		h.GET("/validate-reset-token", r.validateResetToken)
		h.POST("/set-new-password", r.setNewPassword)

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
		// r.l.Error(err, "http - v1 - create")
		// errorResponse(c, http.StatusBadRequest, "invalid request body")
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	tokenString, err := GenerateJWT(user, r.a.ValidateToken())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Abort()
		return
	}
	user.Token = tokenString

	if err := r.t.CreateUser(user); err != nil {
		// r.l.Error(err, "http - v1 - create")
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Abort()
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
		errorResponse(c, http.StatusBadRequest, "invalid request body", err)
		fmt.Println(err)
		return
	}
	// check if user exists and password is correct
	user, err := r.t.Autentication(user.Email, user.Password)
	if err != nil {
		// r.l.Error(err, "http - v1 - create")
		errorResponse(c, http.StatusInternalServerError, "database problems", err)
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
	err := r.a.UpdateToken(user.Email, "")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Abort()
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
	fmt.Println(users)
	if err != nil {
		// r.l.Error(err, "http - v1 - history")
		// errorResponse(c, http.StatusInternalServerError, "database problems")
		fmt.Println(err)
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
		// r.l.Error(err, "http - v1 - create")
		// errorResponse(c, http.StatusBadRequest, "invalid request body")
		fmt.Println(err)
		return
	}

	if err := r.t.EditUsersRole(userRole); err != nil {
		// r.l.Error(err, "http - v1 - create")
		// errorResponse(c, http.StatusInternalServerError, "database problems")
		fmt.Println(err)
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
		// r.l.Error(err, "http - v1 - history")
		// errorResponse(c, http.StatusInternalServerError, "database problems")
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusOK, profile)
}

// @Summary     Request password reset
// @Description Request a password reset link to be sent to the user's email
// @ID requestPasswordReset
// @Tags  	    user
// @Accept      json
// @Produce     json
// @Success     200 {object} response
// @Failure     500 {object} response
// @Router      /users/request-password-reset [post]
func (r *usersRoutes) requestPasswordReset(c *gin.Context) {
	var user entity.User
	if err := c.ShouldBindJSON(&user); err != nil {
		// r.l.Error(err, "http - v1 - create")
		errorResponse(c, http.StatusBadRequest, "invalid request body", err)
		return
	}

	err := r.t.RequestPasswordReset(user.Email)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "error to request passwrod reset", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password reset email sent."})
}

// @Summary Validate Password Reset Token
// @Description Validate the token from the password reset link
// @ID validateResetToken
// @Tags user
// @Accept json
// @Produce json
// @Param token query string true "Password reset token"
// @Success 200 {object} response
// @Failure 400 {object} response
// @Failure 500 {object} response
// @Router /users/validate-reset-token [get]
func (r *usersRoutes) validateResetToken(c *gin.Context) {
	token := c.Query("token")
	email := c.Query("email") // Assuming the email is also passed as a query parameter

	isValid, err := r.t.ValidateResetToken(email, token)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, "error to validate token", err)
		return
	}

	if !isValid {
		errorResponse(c, http.StatusBadRequest, "invalid token", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Token is valid"})
}

// @Summary Set New Password
// @Description Set a new password after validating the reset token
// @ID setNewPassword
// @Tags user
// @Accept json
// @Produce json
// @Param email query string true "User email"
// @Param password body string true "New password"
// @Success 200 {object} response
// @Failure 400 {object} response
// @Failure 500 {object} response
// @Router /users/set-new-password [post]
func (r *usersRoutes) setNewPassword(c *gin.Context) {
	var request struct {
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	email := c.Query("email")

	err := r.t.UpdatePassword(email, request.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password updated successfully"})
}
