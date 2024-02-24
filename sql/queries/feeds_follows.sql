-- name: CreateFeedFollow :one
INSERT INTO feed_follows (
  id, created_at, updated_at, feed_id, user_id
  ) VALUES (
  $1, $2, $3, $4, $5
  ) RETURNING *;

-- name: GetFeedFollows :one
SELECT * FROM feed_follows WHERE feed_id = $1 AND user_id = $2;

-- name: GetFeedFollowsByUser :many
SELECT * FROM feeds WHERE id IN (SELECT feed_id FROM feed_follows WHERE feed_follows.user_id = $1);

-- name: DeleteFeedFollow :exec
DELETE FROM feed_follows WHERE feed_id = $1 AND user_id = $2;
