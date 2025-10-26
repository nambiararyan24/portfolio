-- Migration: Add 'display_order' column to services and projects tables
-- Run this SQL in your Supabase SQL editor

-- Add the display_order column to services table if it doesn't exist
ALTER TABLE services ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Add the display_order column to projects table if it doesn't exist
ALTER TABLE projects ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Update existing services to have a display_order based on created_at
UPDATE services SET display_order = row_number 
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_number 
  FROM services
) as ordered 
WHERE services.id = ordered.id;

-- Update existing projects to have a display_order based on created_at
UPDATE projects SET display_order = row_number 
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_number 
  FROM projects
) as ordered 
WHERE projects.id = ordered.id;

