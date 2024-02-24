-- +goose Up
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL
);

-- +goose Down
DROP TABLE users;

-- +goose Statement Comments
-- This migration creates the users table.
