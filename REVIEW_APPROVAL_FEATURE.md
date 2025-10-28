# Review Approval Feature - Implementation Summary

## Overview
Added the ability to approve/hide reviews before they appear on the website. This is especially useful for managing reviews submitted through the feedback form.

## What Was Changed

### 1. Database Schema
**File:** `add-approval-to-reviews-migration.sql`

Added a new column to the reviews table:
```sql
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
```

**To apply this migration:**
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `add-approval-to-reviews-migration.sql`
4. Run the query

### 2. Type Definition
**File:** `src/types/index.ts`

Updated the `Review` interface to include:
```typescript
export interface Review {
  // ... existing fields
  is_approved?: boolean;
  // ... rest of fields
}
```

### 3. Database Functions
**File:** `src/lib/database.ts`

- Updated `getReviews()` to only fetch approved reviews (`is_approved = true`)
- Updated `getReviewsByProjectId()` to only fetch approved reviews
- Added new function `getAllReviews()` for admin dashboard (returns all reviews)

### 4. Admin Reviews Page
**File:** `src/app/admin/reviews/page.tsx`

Added features:
- **Approval Toggle**: Eye icon to approve reviews, EyeOff icon to hide reviews
- **Status Badges**: Shows "Live" (green) for approved reviews, "Hidden" (red) for unapproved
- **Toggle Function**: `toggleApproval()` function to quickly approve/hide reviews
- **Visual Feedback**: Toast notifications when toggling approval status

**UI Elements:**
- Green "Live" badge for approved reviews
- Red "Hidden" badge for unapproved reviews
- Eye icon button to approve hidden reviews
- EyeOff icon button to hide approved reviews

### 5. Edit Review Page
**File:** `src/app/admin/reviews/[id]/edit/page.tsx`

Added:
- Checkbox to control approval status
- Help text explaining the feature
- Form data includes `is_approved` field

### 6. New Review Page
**File:** `src/app/admin/reviews/new/page.tsx`

Added:
- Checkbox to set approval status when creating new reviews
- Defaults to `is_approved: false`
- Same approval checkbox as edit page

### 7. Sample Data
**File:** `src/lib/sample-data.ts`

Updated all sample reviews to include `is_approved: true` so they display properly.

## How It Works

### For Admins:
1. **Viewing Reviews**: Go to `/admin/reviews` to see all reviews (approved and unapproved)
2. **Approving Reviews**: 
   - Click the Eye icon (👁️) on a hidden review to approve it
   - The review will immediately show the "Live" badge
3. **Hiding Reviews**:
   - Click the EyeOff icon (👁️‍🗨️) on an approved review to hide it
   - The review will show the "Hidden" badge
4. **Creating/Editing Reviews**:
   - Check the "Approve for Display" checkbox when creating or editing
   - Unchecked reviews won't appear on the website

### For Website Visitors:
- Only reviews with `is_approved = true` are displayed on the homepage
- Reviews submitted through the feedback form default to `is_approved = false` and must be manually approved by the admin

## Badge Meanings

- **🟢 "Live"** - Review is approved and visible on the website
- **🔴 "Hidden"** - Review is not approved and hidden from the website
- **🟡 "Sample"** - This is sample data, cannot be edited

## Database Query Changes

### Before:
```typescript
// Fetched all reviews
const { data } = await supabase
  .from('reviews')
  .select('*');
```

### After:
```typescript
// Only fetches approved reviews for the website
const { data } = await supabase
  .from('reviews')
  .select('*')
  .eq('is_approved', true);  // Only approved reviews

// Admin dashboard gets all reviews
const { data } = await supabase
  .from('reviews')
  .select('*');  // All reviews for admin management
```

## Migration Steps

To apply this feature to your database:

```sql
-- 1. Add the column
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- 2. Update existing reviews to be approved (optional)
UPDATE reviews 
SET is_approved = true 
WHERE is_approved IS NULL;

-- 3. Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);
```

## Testing

1. **Test Approval Flow**:
   - Submit a review through the feedback form
   - Go to `/admin/reviews`
   - Find the new review with "Hidden" badge
   - Click the Eye icon to approve it
   - Check the homepage - it should now be visible

2. **Test Hiding**:
   - Find an approved review
   - Click the EyeOff icon
   - Verify it disappears from the homepage

3. **Test Edit Page**:
   - Click Edit on any review
   - Toggle the "Approve for Display" checkbox
   - Save and verify the status changes

## Benefits

✅ **Moderation**: Control which reviews appear on your website  
✅ **Quality Control**: Review and approve feedback before it goes live  
✅ **Spam Protection**: Hide inappropriate or low-quality reviews  
✅ **Curated Content**: Showcase only the best reviews  
✅ **Flexible**: Easy toggle with visual feedback  

## Files Modified

1. ✅ `src/types/index.ts` - Added `is_approved` to Review interface
2. ✅ `src/lib/database.ts` - Updated queries to filter by approval status
3. ✅ `src/app/admin/reviews/page.tsx` - Added approval toggle UI
4. ✅ `src/app/admin/reviews/[id]/edit/page.tsx` - Added approval checkbox
5. ✅ `src/app/admin/reviews/new/page.tsx` - Added approval checkbox
6. ✅ `src/lib/sample-data.ts` - Updated sample data

## Files Created

1. ✅ `add-approval-to-reviews-migration.sql` - Database migration script
2. ✅ `REVIEW_APPROVAL_FEATURE.md` - This documentation

---

**Note**: Make sure to run the SQL migration in your Supabase project before using this feature!

