-- +goose Up
ALTER TABLE feeds ADD COLUMN last_fetched_at TIMESTAMPTZ;

-- +goose Down
ALTER TABLE feeds DROP COLUMN last_fetched_at;

-- +goose Statement Comments
-- This migration adds the last_fetched_at column to the feeds table.
