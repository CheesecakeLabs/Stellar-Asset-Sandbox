package v1

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func loggingTransactionMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// c.Writer.Header().Set("X-Content-Type-Options", "nosniff")
		c.Next()
		fmt.Printf("%s \n %s \n %s \n ,=%s\n",
			c.Request.Method,
			c.Request.RequestURI,
			c.Request.URL,
			c.Request.Response.Body,
		)
		return
	}
}
