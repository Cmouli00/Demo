package post

type CreatePostDTO struct {
	Title string `json:"title" binding:"required,min=3,max=200"`

	Content string `json:"content" binding:"required,min=10"`

	Status string `json:"status" binding:"required,oneof=draft published archived"`
}

type UpdatePostDTO struct {
	Title *string `json:"title" binding:"omitempty,min=3,max=200"`

	Content *string `json:"content" binding:"omitempty,min=10"`

	Status *string `json:"status" binding:"omitempty,oneof=draft published archived"`
}

type PostSearchParams struct {
	Keyword string `form:"keyword"`

	Status string `form:"status" binding:"omitempty,oneof=draft published archived"`

	Page int64 `form:"page,default=1" binding:"min=1"`

	Limit int64 `form:"limit,default=10" binding:"min=1,max=100"`

	SortBy string `form:"sortBy"`

	SortOrder string `form:"sortOrder,default=desc" binding:"oneof=asc desc"`
}
