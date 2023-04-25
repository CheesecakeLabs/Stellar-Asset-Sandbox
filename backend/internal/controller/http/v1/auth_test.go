package v1_test

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	v1 "github.com/CheesecakeLabs/token-factory-v2/backend/internal/controller/http/v1"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestGenerateJWT(t *testing.T) {
	user := entity.User{
		ID:   "123",
		Name: "Test User",
	}

	jwtSecretKey := "test-secret-key"

	tokenString, err := v1.GenerateJWT(user, jwtSecretKey)

	assert.NoError(t, err)
	assert.NotEmpty(t, tokenString)
}

func TestValidateToken(t *testing.T) {
	jwtSecretKey := "test-secret-key"

	// Test case 1: invalid token
	err := v1.ValidateToken("invalid-token", jwtSecretKey)
	assert.Error(t, err)
	assert.Equal(t, "token contains an invalid number of segments", err.Error())

	// Test case 2: expired token
	expirationTime := time.Now().Add(-15 * time.Minute)
	claims := jwt.MapClaims{
		"id":   "user",
		"name": "name",
		"exp":  expirationTime.Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, _ := token.SignedString([]byte(jwtSecretKey))
	err = v1.ValidateToken(tokenString, jwtSecretKey)
	assert.Error(t, err)
	assert.Equal(t, "token is expired by 15m0s", err.Error())

	// Test case 3: valid token
	expirationTime = time.Now().Add(15 * time.Minute)
	claims = jwt.MapClaims{
		"id":   "user",
		"name": "name",
		"exp":  expirationTime.Unix(),
	}
	token = jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, _ = token.SignedString([]byte(jwtSecretKey))
	err = v1.ValidateToken(tokenString, jwtSecretKey)
	assert.NoError(t, err)
}

func TestAuth(t *testing.T) {
	jwtSecretKey := "test-secret"
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(v1.Auth(jwtSecretKey))

	// Create a test endpoint
	r.GET("/test", func(c *gin.Context) {
		c.String(http.StatusOK, "authenticated")
	})

	// Test case 1: missing authorization header
	req1 := httptest.NewRequest(http.MethodGet, "/test", nil)
	resp1 := httptest.NewRecorder()
	r.ServeHTTP(resp1, req1)
	assert.Equal(t, http.StatusUnauthorized, resp1.Code)

	// Test case 2: invalid token
	req2 := httptest.NewRequest(http.MethodGet, "/test", nil)
	req2.Header.Set("Authorization", "invalid-token")
	resp2 := httptest.NewRecorder()
	r.ServeHTTP(resp2, req2)
	assert.Equal(t, http.StatusUnauthorized, resp2.Code)

	// Test case 3: valid token
	user := entity.User{ID: "test-id", Name: "test-user"}
	token, err := v1.GenerateJWT(user, jwtSecretKey)
	assert.Nil(t, err)

	req3 := httptest.NewRequest(http.MethodGet, "/test", nil)
	req3.Header.Set("Authorization", token)
	resp3 := httptest.NewRecorder()
	r.ServeHTTP(resp3, req3)
	assert.Equal(t, http.StatusOK, resp3.Code)
	assert.Equal(t, "authenticated", resp3.Body.String())
}
