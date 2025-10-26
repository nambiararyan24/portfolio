# Freelancer Portfolio + Admin Dashboard

A modern, minimal portfolio website with a fully functional admin dashboard for managing content dynamically.

## Features

### Public Website
- **Hero Section**: Introduction with call-to-action
- **Services**: Dynamic service cards with icons
- **Tools & Technologies**: Grid display of tech stack
- **Projects**: Project showcase with case study links
- **Contact Form**: Lead capture with validation
- **Case Study Pages**: Dynamic project detail pages

### Admin Dashboard
- **Authentication**: Secure login with Supabase Auth
- **Content Management**: CRUD operations for all content
- **Lead Management**: View and manage contact form submissions
- **Analytics**: Overview of content and leads
- **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel
- **Forms**: React Hook Form + Zod validation
- **UI**: Lucide React icons, custom components

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd portfolio
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Run the SQL schema in your Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase-schema.sql
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Set up Authentication

1. In Supabase Dashboard, go to Authentication > Settings
2. Configure your site URL (e.g., `http://localhost:3000` for development)
3. Add redirect URLs for admin login
4. Create an admin user in Authentication > Users

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your portfolio.

Visit `http://localhost:3000/admin` to access the admin dashboard.

## Project Structure

```
src/
├── app/
│   ├── admin/                 # Admin dashboard pages
│   ├── project/[slug]/        # Dynamic case study pages
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── admin/                # Admin-specific components
│   ├── sections/             # Page sections
│   ├── Header.tsx            # Main header
│   └── Footer.tsx            # Main footer
├── lib/
│   ├── database.ts           # Database operations
│   ├── supabase.ts           # Supabase client
│   └── utils.ts              # Utility functions
└── types/
    └── index.ts              # TypeScript interfaces
```

## Database Schema

The project uses the following main tables:

- **services**: Service offerings with title, description, and icon
- **tools**: Technology stack with name, logo, and optional link
- **projects**: Projects with case study content and metadata
- **leads**: Contact form submissions
- **admin_users**: Admin user management

## Customization

### Adding Content

1. **Services**: Add through admin dashboard or directly in database
2. **Tools**: Manage tech stack in admin dashboard
3. **Projects**: Create projects with full case study content
4. **Hero Content**: Update in the Hero component or make it dynamic

### Styling

- Colors and themes are defined in `globals.css`
- Tailwind configuration in `tailwind.config.ts`
- Component styles use Tailwind classes with custom CSS variables

### Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Admin Dashboard Usage

### Accessing Admin
1. Go to `/admin/login`
2. Sign in with your Supabase admin credentials
3. Access all management features

### Managing Content
- **Services**: Add, edit, delete service offerings
- **Tools**: Manage your technology stack
- **Projects**: Create detailed project case studies
- **Leads**: View and manage contact form submissions

## Features in Detail

### Contact Form
- Client-side validation with Zod
- Server-side processing with Supabase
- Success/error notifications
- Lead capture and storage

### Case Study Pages
- Dynamic routing with Next.js
- SEO-optimized with meta tags
- Responsive design
- Image optimization

### Admin Dashboard
- Secure authentication
- Real-time data updates
- Intuitive interface
- Mobile-responsive

## Performance

- Server-side rendering for SEO
- Image optimization
- Lazy loading
- Optimized bundle size
- Lighthouse score: 90+

## Security

- Row Level Security (RLS) in Supabase
- Input validation and sanitization
- Secure authentication
- Protected admin routes

## Support

For issues or questions:
1. Check the documentation
2. Review the code comments
3. Open an issue in the repository

## License

This project is open source and available under the MIT License.