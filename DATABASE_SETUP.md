# Database Setup Guide

## Quick Setup

To enable full functionality for the reviews management system, you need to run the database schema in your Supabase project.

### Steps:

1. **Open Supabase Dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Sign in to your account
   - Select your project

2. **Open SQL Editor**
   - In the left sidebar, click on "SQL Editor"
   - Click "New Query"

3. **Run the Schema**
   - Copy the entire contents of `supabase-schema.sql` from your project root
   - Paste it into the SQL Editor
   - Click "Run" to execute the schema

4. **Verify Setup**
   - Go to "Table Editor" in the left sidebar
   - You should see a new `reviews` table
   - The table should contain 5 sample reviews

### What This Does:

- Creates the `reviews` table with proper structure
- Sets up Row Level Security (RLS) policies
- Adds sample review data
- Enables full CRUD operations for reviews

### After Setup:

- ✅ You can add new reviews through the admin panel
- ✅ You can edit and delete reviews
- ✅ Reviews will be stored in the database
- ✅ The home page will display real data instead of sample data

### Troubleshooting:

**If you see "Reviews table not found" errors:**
- Make sure you've run the complete schema
- Check that the `reviews` table exists in your Supabase project
- Verify your Supabase connection settings in `.env.local`

**If you see "row-level security policy" errors:**
- Run the `fix-reviews-policies.sql` script in your Supabase SQL Editor
- This adds the missing INSERT, UPDATE, and DELETE policies for the reviews table
- The main schema has been updated to include these policies automatically

### Current Status:

- **Without Database**: Shows sample data, cannot add/edit/delete
- **With Database**: Full functionality, all operations work
