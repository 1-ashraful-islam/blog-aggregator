-- +goose Up
CREATE TABLE feed_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  feed_id UUID NOT NULL REFERENCES feeds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE feed_follows;

-- +goose Statement Comments
-- This migration creates the feed_follows table.
