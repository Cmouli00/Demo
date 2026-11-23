package middleware

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func ConfigureCORS(
	appOne string,
	appTwo string,
) gin.HandlerFunc {

	return cors.New(cors.Config{
		AllowOrigins: []string{
			appOne,
			appTwo,
		},

		AllowMethods: []string{
			"GET",
			"POST",
			"PUT",
			"PATCH",
			"DELETE",
			"OPTIONS",
		},

		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Authorization",
			"Accept",
		},

		AllowCredentials: true,

		MaxAge: 12 * time.Hour,
	})
}
