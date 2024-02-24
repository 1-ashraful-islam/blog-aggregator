-- name: CreatePost :one
INSERT INTO posts (
  id, created_at, updated_at, feed_id, title, url, description, publish_date
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8
) RETURNING *;

-- name: GetPostsByUser :many
SELECT * FROM posts WHERE feed_id IN (SELECT id FROM feeds WHERE user_id = $1) ORDER BY publish_date DESC OFFSET $2 LIMIT $3;

-- name: GetPostByURL :one
SELECT * FROM posts WHERE url = $1;

-- name: GetPostsByFeedID :many
SELECT * FROM posts WHERE feed_id = $1 ORDER BY publish_date DESC OFFSET $2 LIMIT $3;
