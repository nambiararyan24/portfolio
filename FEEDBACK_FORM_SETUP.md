# Client Feedback Form - Setup & Troubleshooting

## 📋 What Was Created

### Files Created:
1. **`src/app/feedback/page.tsx`** - The feedback form page
2. **`src/components/FeedbackForm.tsx`** - Multi-step feedback form component
3. **`src/app/api/submit-feedback/route.ts`** - API endpoint for submitting feedback

### Features:
- ✅ 4-step form (Client Details → Rating → Feedback → Thank You)
- ✅ Previous/Next navigation buttons
- ✅ Progress bar showing completion percentage
- ✅ Form validation with clear error messages
- ✅ 5-star rating system with hover effects
- ✅ Responsive design matching your site's color scheme
- ✅ Toast notifications for success/error messages
- ✅ Integrated with Supabase database (reviews table)

## 🔧 How to Fix the "Failed to submit feedback" Error

The error you're experiencing is likely due to missing or incorrect Supabase environment variables. Here's how to fix it:

### Step 1: Set Up Environment Variables

Create a `.env.local` file in your project root with the following:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**How to get your Supabase credentials:**
1. Go to your Supabase project dashboard
2. Navigate to Project Settings → API
3. Copy the "Project URL" and paste it as `NEXT_PUBLIC_SUPABASE_URL`
4. Copy the "anon public" key and paste it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 2: Verify Database Setup

Make sure your Supabase database has the reviews table. Run this in your Supabase SQL editor:

```sql
-- Verify the reviews table exists
SELECT * FROM information_schema.tables 
WHERE table_name = 'reviews';

-- If it doesn't exist, run the schema from supabase-schema.sql
```

### Step 3: Check RLS (Row Level Security) Policies

The reviews table should allow public inserts. Verify with:

```sql
-- Check if insert policy exists
SELECT * FROM pg_policies 
WHERE tablename = 'reviews' AND policyname = 'Public insert access for reviews';

-- If it doesn't exist, create it:
CREATE POLICY "Public insert access for reviews" ON reviews
  FOR INSERT WITH CHECK (true);
```

### Step 4: Restart the Development Server

After setting up your environment variables:

```bash
npm run dev
```

## 🧪 Testing the Form

1. Navigate to: `http://localhost:3000/feedback`
2. Fill out the form:
   - **Step 1**: Enter name and company
   - **Step 2**: Select a rating (1-5 stars)
   - **Step 3**: Write your feedback
   - **Step 4**: Submit and see the thank you page
3. Check the browser console (F12) for any error messages
4. Check the terminal where `npm run dev` is running for server-side errors

## 🐛 Common Issues & Solutions

### Issue: "Failed to submit feedback"
**Solution:** 
- Check that your `.env.local` file exists and has correct Supabase credentials
- Verify the Supabase URL and key are correct
- Make sure you've restarted the dev server after creating `.env.local`

### Issue: "Permission denied" error
**Solution:**
- Run the SQL policy creation (see Step 3 above)
- Verify your Supabase project allows public writes to the reviews table

### Issue: Form shows but doesn't submit
**Solution:**
- Open browser console (F12) and check for JavaScript errors
- Check the Network tab for failed API calls
- Verify the API route is accessible at `/api/submit-feedback`

### Issue: "Missing required fields" error
**Solution:**
- Make sure all fields in step 1 and 2 are filled
- A rating must be selected before proceeding
- The feedback text must be at least 10 characters

## 📊 Database Schema

The feedback form submits data to the `reviews` table with these fields:

```sql
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎨 Customization

### Change the number of form steps:
Edit `src/components/FeedbackForm.tsx` and modify the `MAX_STEPS` constant.

### Change the fields:
Modify the `feedbackSchema` in `src/components/FeedbackForm.tsx` and add/remove fields in the form JSX.

### Change the styling:
The form uses Tailwind CSS classes that match your site's design tokens:
- `--background`, `--foreground` for colors
- `--border` for borders
- `--primary` for buttons
- Font family: Poppins (defined in `src/app/layout.tsx`)

## 📝 Next Steps

1. ✅ Create `.env.local` with your Supabase credentials
2. ✅ Verify the reviews table exists in your Supabase project
3. ✅ Restart the development server
4. ✅ Test the form at `/feedback`
5. ✅ Check submitted feedback in your Supabase dashboard

## 🔗 Access the Form

Once set up, you can access the feedback form at:
- Local: `http://localhost:3000/feedback`
- Production: `https://yourdomain.com/feedback`

---

**Need help?** Check the browser console and terminal output for detailed error messages.

