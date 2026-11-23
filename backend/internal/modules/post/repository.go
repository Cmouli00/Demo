package post

import (
	"context"
	"regexp"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Repository struct {
	collection *mongo.Collection
}

func NewRepository(db *mongo.Database) *Repository {
	return &Repository{
		collection: db.Collection("posts"),
	}
}

func (r *Repository) Create(
	ctx context.Context,
	post *Post,
) error {

	now := time.Now().UTC()

	post.CreatedAt = now
	post.UpdatedAt = now

	result, err := r.collection.InsertOne(ctx, post)
	if err != nil {
		return err
	}

	post.ID = result.InsertedID.(primitive.ObjectID)

	return nil
}

func (r *Repository) GetByID(
	ctx context.Context,
	id primitive.ObjectID,
) (*Post, error) {

	var post Post

	err := r.collection.FindOne(
		ctx,
		bson.M{"_id": id},
	).Decode(&post)

	if err != nil {
		return nil, err
	}

	return &post, nil
}

func (r *Repository) Update(
	ctx context.Context,
	id primitive.ObjectID,
	updates bson.M,
) error {

	updates["updatedAt"] = time.Now().UTC()

	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"_id": id},
		bson.M{"$set": updates},
	)

	return err
}

func (r *Repository) Delete(
	ctx context.Context,
	id primitive.ObjectID,
) error {

	_, err := r.collection.DeleteOne(
		ctx,
		bson.M{"_id": id},
	)

	return err
}

func (r *Repository) Search(
	ctx context.Context,
	params PostSearchParams,
) ([]Post, int64, error) {

	filter := bson.M{}

	if params.Keyword != "" {
		escaped := regexp.QuoteMeta(params.Keyword)

		filter["$or"] = []bson.M{
			{
				"title": bson.M{
					"$regex":   escaped,
					"$options": "i",
				},
			},
			{
				"content": bson.M{
					"$regex":   escaped,
					"$options": "i",
				},
			},
		}
	}

	if params.Status != "" {
		filter["status"] = params.Status
	}

	total, err := r.collection.CountDocuments(
		ctx,
		filter,
	)

	if err != nil {
		return nil, 0, err
	}

	sortField := "createdAt"

	switch params.SortBy {
	case "title", "createdAt", "updatedAt", "status":
		sortField = params.SortBy
	}

	sortDirection := -1

	if params.SortOrder == "asc" {
		sortDirection = 1
	}

	skip := (params.Page - 1) * params.Limit

	findOptions := options.Find().
		SetSkip(skip).
		SetLimit(params.Limit).
		SetSort(bson.D{
			{
				Key:   sortField,
				Value: sortDirection,
			},
			{
				Key:   "_id",
				Value: 1,
			},
		})

	cursor, err := r.collection.Find(
		ctx,
		filter,
		findOptions,
	)

	if err != nil {
		return nil, 0, err
	}

	defer cursor.Close(ctx)

	posts := make([]Post, 0)

	if err := cursor.All(ctx, &posts); err != nil {
		return nil, 0, err
	}

	return posts, total, nil
}
