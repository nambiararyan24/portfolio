# Client Onboarding Form - Complete Guide

## 📋 Overview

A comprehensive 5-step client onboarding form to gather all necessary information before starting a project. Located at `/onboarding`.

## 🎨 Design Features

- **Same UI as Feedback Form**: Matches the compact, professional design
- **Dark Theme**: Slate-based gradient background (slate-900 → slate-800)
- **Green Accents**: Emerald green progress bar, buttons, and focus rings
- **Compact Layout**: Fits on desktop screen without scrolling
- **Multi-step Navigation**: Previous/Next buttons for easy navigation
- **Progress Bar**: Visual indicator of completion percentage

## 📝 Form Steps

### Step 1: Client Information
**Required Fields:**
- Full Name
- Email Address
- Company Name
- Phone Number

### Step 2: Project Information
**Required Fields:**
- Project Type (Website, Web App, E-commerce, etc.)
- Budget Range (Under $5K to $30K+)
- Timeline (ASAP to Flexible)
- Preferred Contact Method (Email, Phone, or Either)

**Project Type Options:**
- Website Development
- Web Application
- E-commerce Store
- Landing Page
- Portfolio Website
- API Development
- Other

**Budget Ranges:**
- Under $5,000
- $5,000 - $15,000
- $15,000 - $30,000
- $30,000+
- Let's discuss

**Timeline Options:**
- ASAP
- Within 1 month
- 2-3 months
- Flexible
- Still planning

### Step 3: Project Details
**Required Fields:**
- Project Description (minimum 20 characters)
- Project Goals (minimum 10 characters)
- Target Audience (minimum 10 characters)

### Step 4: Additional Information
**Optional Fields:**
- How did you hear about us? (Google, LinkedIn, Referral, etc.)
- Additional Information (free text)
- Newsletter Signup (checkbox)

### Step 5: Thank You Page
- Success confirmation
- Next steps information
- Return to home button

## 🎯 What Information is Collected

### Contact Details
✅ Name, Email, Phone, Company

### Project Requirements
✅ Type, Budget, Timeline, Contact Preference

### Project Vision
✅ Description, Goals, Target Audience

### Additional Context
✅ Referral Source, Extra Details, Newsletter Preference

## 💾 Data Storage

The form submits to the **leads** table in your Supabase database, which includes:
- All contact information
- Project requirements
- Budget and timeline preferences
- Detailed project description
- Custom message formatting

**Message Format:**
```
Project Description: [user input]

Goals: [user input]

Target Audience: [user input]

How they heard about us: [selected option]

Additional Info: [user input or None]

Newsletter Signup: Yes/No
```

## 🚀 How to Access

**URL:** `http://localhost:3001/onboarding`

Or in production: `https://yourdomain.com/onboarding`

## 📁 Files Created

1. **`src/app/onboarding/page.tsx`** - Onboarding page route
2. **`src/components/OnboardingForm.tsx`** - Main form component
3. **`src/app/api/submit-onboarding/route.ts`** - API endpoint

## ✅ Features

- ✅ 5-step multi-page form
- ✅ Form validation at each step
- ✅ Progress indicator
- ✅ Green color scheme
- ✅ Compact desktop-friendly layout
- ✅ Previous/Next navigation
- ✅ Required/optional field indicators
- ✅ Database integration (leads table)
- ✅ Toast notifications
- ✅ Thank you confirmation page

## 🎨 UI Elements

### Colors
- **Background**: Dark slate gradient
- **Form Container**: `bg-slate-800` with `border-slate-700`
- **Inputs**: `bg-slate-900` with green focus rings
- **Buttons**: Green (`emerald-600`) with hover effects
- **Progress Bar**: Green (`emerald-500`)
- **Text**: White for headings, slate-300/400 for descriptions

### Layout
- **Max Width**: `max-w-4xl` for optimal desktop viewing
- **Spacing**: Compact `space-y-3`, `space-y-4`
- **Padding**: `p-6` for form container
- **Responsive**: Grid layouts for side-by-side fields

### Validation
- Real-time error messages
- Required field indicators (red asterisk)
- Character count for text areas
- Step-by-step validation before proceeding

## 🔄 Workflow

1. Client visits `/onboarding`
2. Enters contact information (Step 1)
3. Selects project details (Step 2)
4. Describes their project (Step 3)
5. Adds optional information (Step 4)
6. Submits form
7. Sees thank you page
8. Data saved to leads table
9. Admin reviews in `/admin/leads`

## 📊 Use Case

**Perfect for:**
- New client inquiries
- Project kickoff preparation
- Lead qualification
- Requirement gathering
- Project scoping

**Benefits:**
- Saves time on initial calls
- Gathers comprehensive information upfront
- Professional first impression
- Structured data collection
- Easy to review in admin panel

## 🎯 Next Steps for Admins

Once a client submits the onboarding form:

1. **View in Admin Dashboard**: Go to `/admin/leads`
2. **Review Information**: Check all project details
3. **Calculate Lead Score**: Automatically calculated based on:
   - Budget range
   - Timeline urgency
   - Project type
   - Contact method preference
4. **Contact Client**: Use preferred contact method
5. **Start Project**: With all information already gathered!

## 🔗 Related Forms

- **Feedback Form** (`/feedback`): Collect client reviews after project completion
- **Contact Form**: Available on homepage for quick inquiries
- **Onboarding Form** (`/onboarding`): Comprehensive project kickoff (this form)

---

**Ready to use!** The form is fully integrated with your existing leads database and will appear in your admin panel automatically.

