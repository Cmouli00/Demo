package router

import (
	"company.com/m/internal/config"
	"company.com/m/internal/middleware"
	"company.com/m/internal/modules/post"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	// Import news and client packages here.
)

func Setup(db *mongo.Database) *gin.Engine {

	cfg := config.Load()

	router := gin.Default()

	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(middleware.ConfigureCORS(
		cfg.AppOneOrigin,
		cfg.AppTwoOrigin,
	))

	api := router.Group("/api/v1")

	// POST MODULE
	postRepository := post.NewRepository(db)
	postService := post.NewService(postRepository)
	postHandler := post.NewHandler(postService)

	post.RegisterRoutes(api, postHandler)

	// NEWS MODULE
	// newsRepository := news.NewRepository(db)
	// newsService := news.NewService(newsRepository)
	// newsHandler := news.NewHandler(newsService)
	// news.RegisterRoutes(api, newsHandler)

	// CLIENT MODULE
	// clientRepository := client.NewRepository(db)
	// clientService := client.NewService(clientRepository)
	// clientHandler := client.NewHandler(clientService)
	// client.RegisterRoutes(api, clientHandler)

	return router
}
