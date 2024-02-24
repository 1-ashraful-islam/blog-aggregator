-- name: CreateUser :one
INSERT INTO users (id, created_at, updated_at, name)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetUserByName :one
SELECT * FROM users WHERE name = $1;

-- name: GetUser :one
SELECT * FROM users WHERE api_key = $1;

-- name: GetUsers :many
SELECT * FROM users;

-- name: UpdateUser :one
UPDATE users
SET updated_at = $2, name = $3
WHERE id = $1
RETURNING *;

-- name: DeleteUser :exec
DELETE FROM users WHERE id = $1;
