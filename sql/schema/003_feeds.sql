-- +goose Up
CREATE TABLE feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL
);

-- +goose Down
DROP TABLE feeds;

-- +goose Statement Comments
-- This migration creates the feeds table.
