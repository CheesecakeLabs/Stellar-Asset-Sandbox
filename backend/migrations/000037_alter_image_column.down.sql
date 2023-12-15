-- Migration Down Script
ALTER TABLE asset ALTER COLUMN image TYPE BYTEA USING image::BYTEA;
