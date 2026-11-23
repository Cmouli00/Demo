package post

import "github.com/gin-gonic/gin"

func RegisterRoutes(
	router *gin.RouterGroup,
	handler *Handler,
) {
	posts := router.Group("/posts")

	{
		posts.POST("", handler.Create)
		posts.GET("", handler.Search)
		posts.GET("/:id", handler.GetByID)
		posts.PUT("/:id", handler.Update)
		posts.DELETE("/:id", handler.Delete)
	}
}
