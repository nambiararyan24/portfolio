-- Add approval field to reviews table
-- Run this SQL in your Supabase SQL editor

-- Add is_approved column with default value false
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Add comment explaining the field
COMMENT ON COLUMN reviews.is_approved IS 'Whether the review is approved to be displayed on the website';

-- Update existing reviews to be approved by default
UPDATE reviews 
SET is_approved = true 
WHERE is_approved IS NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);

