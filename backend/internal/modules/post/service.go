package post

import (
	"context"
	"errors"
	"math"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Service struct {
	repository *Repository
}

func NewService(repository *Repository) *Service {
	return &Service{
		repository: repository,
	}
}

func (s *Service) Create(
	ctx context.Context,
	dto CreatePostDTO,
) (*Post, error) {

	post := &Post{
		Title:   dto.Title,
		Content: dto.Content,
		Status:  dto.Status,
	}

	err := s.repository.Create(ctx, post)
	if err != nil {
		return nil, err
	}

	return post, nil
}

func (s *Service) GetByID(
	ctx context.Context,
	id string,
) (*Post, error) {

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, errors.New("invalid post ID")
	}

	return s.repository.GetByID(ctx, objectID)
}

func (s *Service) Update(
	ctx context.Context,
	id string,
	dto UpdatePostDTO,
) error {

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("invalid post ID")
	}

	updates := bson.M{}

	if dto.Title != nil {
		updates["title"] = *dto.Title
	}

	if dto.Content != nil {
		updates["content"] = *dto.Content
	}

	if dto.Status != nil {
		updates["status"] = *dto.Status
	}

	if len(updates) == 0 {
		return errors.New("no fields provided for update")
	}

	existing, err := s.repository.GetByID(ctx, objectID)
	if err != nil {
		return err
	}

	_ = existing

	return s.repository.Update(ctx, objectID, updates)
}

func (s *Service) Delete(
	ctx context.Context,
	id string,
) error {

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("invalid post ID")
	}

	_, err = s.repository.GetByID(ctx, objectID)
	if err != nil {
		return err
	}

	return s.repository.Delete(ctx, objectID)
}

func (s *Service) Search(
	ctx context.Context,
	params PostSearchParams,
) (bson.M, error) {

	if params.Page < 1 {
		params.Page = 1
	}

	if params.Limit < 1 {
		params.Limit = 10
	}

	if params.Limit > 100 {
		params.Limit = 100
	}

	if params.SortOrder == "" {
		params.SortOrder = "desc"
	}

	posts, total, err := s.repository.Search(
		ctx,
		params,
	)

	if err != nil {
		return nil, err
	}

	totalPages := int64(math.Ceil(
		float64(total) / float64(params.Limit),
	))

	return bson.M{
		"data": posts,
		"meta": bson.M{
			"page":       params.Page,
			"limit":      params.Limit,
			"total":      total,
			"totalPages": totalPages,
		},
	}, nil
}

func isNotFound(err error) bool {
	return errors.Is(err, mongo.ErrNoDocuments)
}
