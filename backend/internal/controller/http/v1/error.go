package v1

import (
	"github.com/gin-gonic/gin"
)

type response struct {
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}

func errorResponse(c *gin.Context, code int, msg string, err error) {
	var errorMsg string
	if err != nil {
		errorMsg = err.Error()
	}
	resp := response{
		Message: msg,
		Error:   errorMsg,
	}
	c.AbortWithStatusJSON(code, resp)
}
