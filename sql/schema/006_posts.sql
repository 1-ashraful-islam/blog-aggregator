-- +goose Up
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  feed_id UUID NOT NULL REFERENCES feeds(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  publish_date TIMESTAMPTZ NOT NULL
);

-- +goose Down
DROP TABLE posts;

-- +goose Statement Comments
-- This migration creates the posts table.
