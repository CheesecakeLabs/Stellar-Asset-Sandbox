package v1

import (
	"errors"
	"time"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type JWTClaim struct {
	ID   string `json:"id"`
	Name string `json:"name"`
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
		return
	}
	_, ok := token.Claims.(*JWTClaim)
	if !ok {
		err = errors.New("couldn't parse claims")
		return
	}

	return
}

func GenerateJWT(user entity.User, jwtSecretKey string) (tokenString string, err error) {
	expirationTime := time.Now().Add(15 * time.Minute)
	claims := &JWTClaim{
		ID:   user.ID, // TODO
		Name: user.Name,
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
			context.JSON(401, gin.H{"error": "request does not contain an access token"})
			context.Abort()
			return
		}
		err := ValidateToken(tokenString, jwtSecretKey)
		if err != nil {
			context.JSON(401, gin.H{"error": err.Error()})
			context.Abort()
			return
		}
		context.Next()
	}
}
