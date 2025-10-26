-- Migration: Add 'type' column to services table
-- Run this SQL in your Supabase SQL editor if you have an existing database

-- Add the type column if it doesn't exist
ALTER TABLE services ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'Product';

-- Add the CHECK constraint for type validation
ALTER TABLE services ADD CONSTRAINT check_service_type 
  CHECK (type IN ('Product', 'Skill'));

-- Update existing services to have a default type of 'Product' (if they don't have one)
UPDATE services SET type = 'Product' WHERE type IS NULL;

