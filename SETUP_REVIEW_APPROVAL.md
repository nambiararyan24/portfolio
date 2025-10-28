# Quick Setup: Review Approval Feature

## ⚠️ Error: "Failed to update approval status"

This error occurs because the database doesn't have the `is_approved` column yet. Follow these steps to fix it:

## Step 1: Run the Database Migration

1. **Go to your Supabase Dashboard**: https://app.supabase.com
2. **Open your project**
3. **Go to SQL Editor** (in the left sidebar)
4. **Copy and paste this SQL**:
```sql
-- Add is_approved column to reviews table
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Set existing reviews to approved (optional)
UPDATE reviews 
SET is_approved = true 
WHERE is_approved IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'reviews' AND column_name = 'is_approved';
```

5. **Click "Run"** or press Ctrl+Enter
6. **You should see**: "Success. No rows returned" or the column details

## Step 2: Restart Your Development Server

1. **Stop the server** (Ctrl+C in the terminal)
2. **Start it again**:
```bash
npm run dev
```

## Step 3: Test the Feature

1. Go to http://localhost:3001/admin/reviews (or your port)
2. You should see "Live" and "Hidden" badges on reviews
3. Click the Eye icon to approve/hide reviews
4. It should work without errors now!

## Alternative: Using Supabase SQL Directly

If you prefer to use a file:

1. Open `add-approval-to-reviews-migration.sql`
2. Copy all the contents
3. Paste into Supabase SQL Editor
4. Run it

## How to Verify It's Working

After running the migration, you can verify it worked:

```sql
-- Check if column exists
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'reviews';
```

You should see `is_approved` in the results.

Or test with:

```sql
-- See current approval status of all reviews
SELECT id, name, company, is_approved 
FROM reviews 
ORDER BY created_at DESC;
```

## Still Getting Errors?

### Check the Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any Supabase errors
4. The error message will tell you exactly what's wrong

### Common Issues

**Issue:** "Column 'is_approved' does not exist"
- **Solution:** You haven't run the migration yet. Follow Step 1 above.

**Issue:** "Permission denied" or "Unauthorized"
- **Solution:** Check your Supabase RLS (Row Level Security) policies in the dashboard

**Issue:** Still shows old data
- **Solution:** 
  - Clear browser cache
  - Hard refresh (Ctrl+Shift+R)
  - Restart dev server

## What This Does

After running the migration:
- ✅ Adds `is_approved` column to reviews table
- ✅ Sets default value to `false` (hidden)
- ✅ Creates an index for faster queries
- ✅ Only approved reviews appear on homepage
- ✅ Admin can toggle approval status easily

## Need Help?

1. Check the browser console for detailed error messages
2. Look at the terminal output for server-side errors
3. Verify your Supabase credentials in `.env.local`
4. Make sure you're connected to the correct Supabase project

---

**Quick Test After Setup:**

1. Submit a review through the feedback form at `/feedback`
2. Go to `/admin/reviews`
3. The new review should have a red "Hidden" badge
4. Click the Eye icon to approve it
5. Go to homepage - it should now appear!

