package post

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{
		service: service,
	}
}

func (h *Handler) Create(c *gin.Context) {
	var dto CreatePostDTO

	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid post data",
			"error":   err.Error(),
		})
		return
	}

	post, err := h.service.Create(
		c.Request.Context(),
		dto,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Unable to create post",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"data": post,
	})
}

func (h *Handler) GetByID(c *gin.Context) {
	post, err := h.service.GetByID(
		c.Request.Context(),
		c.Param("id"),
	)

	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Post not found",
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": post,
	})
}

func (h *Handler) Update(c *gin.Context) {
	var dto UpdatePostDTO

	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid update data",
			"error":   err.Error(),
		})
		return
	}

	err := h.service.Update(
		c.Request.Context(),
		c.Param("id"),
		dto,
	)

	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Post not found",
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Post updated successfully",
	})
}

func (h *Handler) Delete(c *gin.Context) {
	err := h.service.Delete(
		c.Request.Context(),
		c.Param("id"),
	)

	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Post not found",
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Post deleted successfully",
	})
}

func (h *Handler) Search(c *gin.Context) {
	var params PostSearchParams

	if err := c.ShouldBindQuery(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid search parameters",
			"error":   err.Error(),
		})
		return
	}

	result, err := h.service.Search(
		c.Request.Context(),
		params,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Unable to retrieve posts",
		})
		return
	}

	c.JSON(http.StatusOK, result)
}
