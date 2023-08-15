package v1

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func loggingTransactionMiddleware() gin.HandlerFunc {
	// Handle request

	return func(c *gin.Context) {
		c.Writer.Header().Set("X-Content-Type-Options", "nosniff")

		c.Next()

		fmt.Printf("%d %s %s\n",
			c.Writer.Status(),
			c.Request.Method,
			c.Request.RequestURI,
		)
	}
}
