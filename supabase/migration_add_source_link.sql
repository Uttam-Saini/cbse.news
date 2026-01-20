-- Migration: Add source_link column to news table
-- Run this SQL in your Supabase SQL Editor if you have an existing database

ALTER TABLE news 
ADD COLUMN IF NOT EXISTS source_link TEXT;

-- The column is nullable by default, so no default value is needed
-- Existing rows will have NULL for source_link, which is the desired behavior
