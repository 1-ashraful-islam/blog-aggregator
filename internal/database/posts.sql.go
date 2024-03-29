// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: posts.sql

package database

import (
	"context"
	"time"

	"github.com/google/uuid"
)

const createPost = `-- name: CreatePost :one
INSERT INTO posts (
  id, created_at, updated_at, feed_id, title, url, description, publish_date
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8
) RETURNING id, created_at, updated_at, feed_id, title, url, description, publish_date
`

type CreatePostParams struct {
	ID          uuid.UUID `json:"id"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	FeedID      uuid.UUID `json:"feed_id"`
	Title       string    `json:"title"`
	Url         string    `json:"url"`
	Description string    `json:"description"`
	PublishDate time.Time `json:"publish_date"`
}

func (q *Queries) CreatePost(ctx context.Context, arg CreatePostParams) (Post, error) {
	row := q.db.QueryRowContext(ctx, createPost,
		arg.ID,
		arg.CreatedAt,
		arg.UpdatedAt,
		arg.FeedID,
		arg.Title,
		arg.Url,
		arg.Description,
		arg.PublishDate,
	)
	var i Post
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.FeedID,
		&i.Title,
		&i.Url,
		&i.Description,
		&i.PublishDate,
	)
	return i, err
}

const getPostByURL = `-- name: GetPostByURL :one
SELECT id, created_at, updated_at, feed_id, title, url, description, publish_date FROM posts WHERE url = $1
`

func (q *Queries) GetPostByURL(ctx context.Context, url string) (Post, error) {
	row := q.db.QueryRowContext(ctx, getPostByURL, url)
	var i Post
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.FeedID,
		&i.Title,
		&i.Url,
		&i.Description,
		&i.PublishDate,
	)
	return i, err
}

const getPostsByFeedID = `-- name: GetPostsByFeedID :many
SELECT id, created_at, updated_at, feed_id, title, url, description, publish_date FROM posts WHERE feed_id = $1 ORDER BY publish_date DESC OFFSET $2 LIMIT $3
`

type GetPostsByFeedIDParams struct {
	FeedID uuid.UUID `json:"feed_id"`
	Offset int32     `json:"offset"`
	Limit  int32     `json:"limit"`
}

func (q *Queries) GetPostsByFeedID(ctx context.Context, arg GetPostsByFeedIDParams) ([]Post, error) {
	rows, err := q.db.QueryContext(ctx, getPostsByFeedID, arg.FeedID, arg.Offset, arg.Limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Post
	for rows.Next() {
		var i Post
		if err := rows.Scan(
			&i.ID,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.FeedID,
			&i.Title,
			&i.Url,
			&i.Description,
			&i.PublishDate,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getPostsByUser = `-- name: GetPostsByUser :many
SELECT id, created_at, updated_at, feed_id, title, url, description, publish_date FROM posts WHERE feed_id IN (SELECT id FROM feeds WHERE user_id = $1) ORDER BY publish_date DESC OFFSET $2 LIMIT $3
`

type GetPostsByUserParams struct {
	UserID uuid.UUID `json:"user_id"`
	Offset int32     `json:"offset"`
	Limit  int32     `json:"limit"`
}

func (q *Queries) GetPostsByUser(ctx context.Context, arg GetPostsByUserParams) ([]Post, error) {
	rows, err := q.db.QueryContext(ctx, getPostsByUser, arg.UserID, arg.Offset, arg.Limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Post
	for rows.Next() {
		var i Post
		if err := rows.Scan(
			&i.ID,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.FeedID,
			&i.Title,
			&i.Url,
			&i.Description,
			&i.PublishDate,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
