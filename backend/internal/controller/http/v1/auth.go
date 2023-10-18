package v1

import (
	"errors"
	"net/http"
	"time"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type JWTClaim struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	jwt.StandardClaims
}

func ValidateToken(signedToken string, jwtSecretKey string) (err error) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&JWTClaim{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtSecretKey), nil
		},
	)
	if err != nil {
		return err
	}
	_, ok := token.Claims.(*JWTClaim)
	if !ok {
		err = errors.New("couldn't parse claims")
		return err
	}

	return nil
}

func GenerateJWT(user entity.User, jwtSecretKey string) (tokenString string, err error) {
	expirationTime := time.Now().Add(1440 * time.Minute)
	claims := &JWTClaim{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err = token.SignedString([]byte(jwtSecretKey))
	return
}

func Auth(jwtSecretKey string) gin.HandlerFunc {
	return func(context *gin.Context) {
		tokenString := context.GetHeader("Authorization")
		if tokenString == "" {
			context.String(http.StatusUnauthorized, "Unauthorized")
			context.Abort()
			return
		}
		err := ValidateToken(tokenString, jwtSecretKey)
		if err != nil {
			context.String(http.StatusUnauthorized, err.Error())
			context.Abort()
			return
		}
		context.Next()
	}
}
