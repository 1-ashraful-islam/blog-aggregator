// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: feeds.sql

package database

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
)

const createFeed = `-- name: CreateFeed :one
INSERT INTO feeds (
  id, created_at, updated_at, user_id, url, title, description
) VALUES (
  $1, $2, $3, $4, $5, $6, $7
) RETURNING id, created_at, updated_at, user_id, url, title, description, last_fetched_at
`

type CreateFeedParams struct {
	ID          uuid.UUID `json:"id"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	UserID      uuid.UUID `json:"user_id"`
	Url         string    `json:"url"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
}

func (q *Queries) CreateFeed(ctx context.Context, arg CreateFeedParams) (Feed, error) {
	row := q.db.QueryRowContext(ctx, createFeed,
		arg.ID,
		arg.CreatedAt,
		arg.UpdatedAt,
		arg.UserID,
		arg.Url,
		arg.Title,
		arg.Description,
	)
	var i Feed
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.UserID,
		&i.Url,
		&i.Title,
		&i.Description,
		&i.LastFetchedAt,
	)
	return i, err
}

const getFeedByID = `-- name: GetFeedByID :one
SELECT id, created_at, updated_at, user_id, url, title, description, last_fetched_at FROM feeds WHERE id = $1
`

func (q *Queries) GetFeedByID(ctx context.Context, id uuid.UUID) (Feed, error) {
	row := q.db.QueryRowContext(ctx, getFeedByID, id)
	var i Feed
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.UserID,
		&i.Url,
		&i.Title,
		&i.Description,
		&i.LastFetchedAt,
	)
	return i, err
}

const getFeedByURL = `-- name: GetFeedByURL :one
SELECT id, created_at, updated_at, user_id, url, title, description, last_fetched_at FROM feeds WHERE url = $1
`

func (q *Queries) GetFeedByURL(ctx context.Context, url string) (Feed, error) {
	row := q.db.QueryRowContext(ctx, getFeedByURL, url)
	var i Feed
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.UserID,
		&i.Url,
		&i.Title,
		&i.Description,
		&i.LastFetchedAt,
	)
	return i, err
}

const getFeeds = `-- name: GetFeeds :many
SELECT id, created_at, updated_at, user_id, url, title, description, last_fetched_at FROM feeds
`

func (q *Queries) GetFeeds(ctx context.Context) ([]Feed, error) {
	rows, err := q.db.QueryContext(ctx, getFeeds)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Feed
	for rows.Next() {
		var i Feed
		if err := rows.Scan(
			&i.ID,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.UserID,
			&i.Url,
			&i.Title,
			&i.Description,
			&i.LastFetchedAt,
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

const getNextFeedsToFetch = `-- name: GetNextFeedsToFetch :many
SELECT id, created_at, updated_at, user_id, url, title, description, last_fetched_at FROM feeds ORDER BY last_fetched_at ASC NULLS FIRST LIMIT $1
`

func (q *Queries) GetNextFeedsToFetch(ctx context.Context, limit int32) ([]Feed, error) {
	rows, err := q.db.QueryContext(ctx, getNextFeedsToFetch, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Feed
	for rows.Next() {
		var i Feed
		if err := rows.Scan(
			&i.ID,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.UserID,
			&i.Url,
			&i.Title,
			&i.Description,
			&i.LastFetchedAt,
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

const markFeedAsFetched = `-- name: MarkFeedAsFetched :one
UPDATE feeds SET last_fetched_at = $2, updated_at = $3 WHERE id = $1 RETURNING id, created_at, updated_at, user_id, url, title, description, last_fetched_at
`

type MarkFeedAsFetchedParams struct {
	ID            uuid.UUID    `json:"id"`
	LastFetchedAt sql.NullTime `json:"last_fetched_at"`
	UpdatedAt     time.Time    `json:"updated_at"`
}

func (q *Queries) MarkFeedAsFetched(ctx context.Context, arg MarkFeedAsFetchedParams) (Feed, error) {
	row := q.db.QueryRowContext(ctx, markFeedAsFetched, arg.ID, arg.LastFetchedAt, arg.UpdatedAt)
	var i Feed
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.UserID,
		&i.Url,
		&i.Title,
		&i.Description,
		&i.LastFetchedAt,
	)
	return i, err
}
