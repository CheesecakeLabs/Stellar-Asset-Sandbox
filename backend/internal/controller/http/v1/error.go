package v1

import (
	"github.com/gin-gonic/gin"
)

type response struct {
	Error string `json:"error" example:"message"`
}

func errorResponse(c *gin.Context, code int, msg string, err error) {
	c.AbortWithStatusJSON(code, gin.H{
		"message": msg,
		"error":   err,
	})
}
