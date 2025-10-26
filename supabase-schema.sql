-- Portfolio Database Schema for Supabase
-- Run this SQL in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  type VARCHAR(50) DEFAULT 'Product' CHECK (type IN ('Product', 'Skill')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Tools table
CREATE TABLE IF NOT EXISTS tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  short_description TEXT NOT NULL,
  thumbnail_url TEXT,
  full_description TEXT,
  tools_used TEXT[] DEFAULT '{}',
  case_study_content TEXT,
  external_link TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  start_date VARCHAR(7), -- Format: YYYY-MM
  end_date VARCHAR(7), -- Format: YYYY-MM
  type VARCHAR(100), -- Project type
  status VARCHAR(50), -- Project status
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(255),
  project_type VARCHAR(255) NOT NULL,
  budget_range VARCHAR(50),
  timeline VARCHAR(50),
  message TEXT NOT NULL,
  preferred_contact_method VARCHAR(20) CHECK (preferred_contact_method IN ('email', 'phone', 'either')),
  newsletter_signup BOOLEAN DEFAULT FALSE,
  files TEXT[] DEFAULT '{}',
  lead_score INTEGER DEFAULT 0,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Admin Users table (for future use)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_read ON leads(read);
CREATE INDEX IF NOT EXISTS idx_reviews_project_id ON reviews(project_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for services" ON services
  FOR SELECT USING (true);

CREATE POLICY "Public read access for tools" ON tools
  FOR SELECT USING (true);

CREATE POLICY "Public read access for projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Public read access for reviews" ON reviews
  FOR SELECT USING (true);

-- Create policies for reviews (full CRUD for authenticated users)
CREATE POLICY "Public insert access for reviews" ON reviews
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update access for reviews" ON reviews
  FOR UPDATE USING (true);

CREATE POLICY "Public delete access for reviews" ON reviews
  FOR DELETE USING (true);

-- Create policies for leads (insert for public, full access for authenticated users)
CREATE POLICY "Public insert access for leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access for leads" ON leads
  FOR SELECT USING (true);

CREATE POLICY "Public update access for leads" ON leads
  FOR UPDATE USING (true);

CREATE POLICY "Public delete access for leads" ON leads
  FOR DELETE USING (true);

-- Create policies for admin users (read only for public)
CREATE POLICY "Public read access for admin_users" ON admin_users
  FOR SELECT USING (true);

-- Insert sample data
INSERT INTO services (title, description, icon_url) VALUES
('Web Development', 'Custom websites and web applications built with modern technologies like React, Next.js, and Node.js.', 'https://cdn-icons-png.flaticon.com/512/1055/1055687.png'),
('E-commerce Solutions', 'Online stores and e-commerce platforms with payment integration, inventory management, and admin dashboards.', 'https://cdn-icons-png.flaticon.com/512/2942/2942811.png'),
('Mobile-First Design', 'Responsive web design that works perfectly on all devices, from mobile phones to desktop computers.', 'https://cdn-icons-png.flaticon.com/512/1055/1055687.png'),
('API Development', 'RESTful and GraphQL APIs for seamless data integration and third-party service connections.', 'https://cdn-icons-png.flaticon.com/512/1055/1055687.png'),
('Database Design', 'Optimized database schemas and queries for scalable applications with PostgreSQL and MongoDB.', 'https://cdn-icons-png.flaticon.com/512/1055/1055687.png'),
('Performance Optimization', 'Speed up your website with code optimization, image compression, and caching strategies.', 'https://cdn-icons-png.flaticon.com/512/1055/1055687.png');

INSERT INTO tools (name, logo_url, link) VALUES
('React', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', 'https://reactjs.org'),
('Next.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', 'https://nextjs.org'),
('TypeScript', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', 'https://www.typescriptlang.org'),
('Tailwind CSS', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg', 'https://tailwindcss.com'),
('Node.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', 'https://nodejs.org'),
('PostgreSQL', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', 'https://www.postgresql.org'),
('MongoDB', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', 'https://www.mongodb.com'),
('Express', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', 'https://expressjs.com'),
('Prisma', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg', 'https://www.prisma.io'),
('Vercel', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg', 'https://vercel.com'),
('Git', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', 'https://git-scm.com'),
('Docker', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', 'https://www.docker.com');

INSERT INTO projects (title, short_description, thumbnail_url, full_description, tools_used, case_study_content, external_link, slug, start_date, end_date, type, status) VALUES
('E-commerce Platform', 'A full-stack e-commerce solution with modern design and seamless user experience.', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80', 'A comprehensive e-commerce platform built with modern web technologies.', ARRAY['React', 'Next.js', 'TypeScript', 'Stripe'], 'This project involved building a complete e-commerce solution from scratch. The platform features a modern, responsive design with seamless user experience across all devices.

## Key Features
- Product catalog with advanced filtering and search
- Secure payment processing with Stripe integration
- User authentication and account management
- Admin dashboard for inventory management
- Order tracking and email notifications

## Technical Implementation
The frontend was built using React and Next.js for optimal performance and SEO. TypeScript was used throughout for type safety and better developer experience. The backend API was developed with Node.js and Express, with PostgreSQL as the database.

## Results
- 40% increase in conversion rate compared to previous platform
- 99.9% uptime achieved
- Mobile traffic increased by 60%
- Customer satisfaction score of 4.8/5', 'https://example-ecommerce.com', 'ecommerce-platform', '2024-01', '2024-06', 'E-commerce', 'Completed'),

('Task Management App', 'A collaborative task management application with real-time updates and team collaboration features.', 'https://images.unsplash.com/photo-1611224923853-80b023ee02d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80', 'A modern task management application built for teams.', ARRAY['React', 'Node.js', 'MongoDB', 'Socket.io'], 'A comprehensive task management solution designed to improve team productivity and collaboration.

## Key Features
- Real-time task updates and notifications
- Team collaboration and assignment features
- Project organization with boards and lists
- Time tracking and progress monitoring
- Mobile-responsive design

## Technical Implementation
Built with React for the frontend and Node.js with Express for the backend. Real-time features powered by Socket.io, with MongoDB for data persistence.

## Results
- 50% improvement in team productivity
- 30% reduction in project completion time
- 95% user satisfaction rate', 'https://example-tasks.com', 'task-management-app', '2023-09', '2024-02', 'SaaS Platform', 'Completed'),

('Restaurant Website', 'A modern restaurant website with online ordering, menu display, and reservation system.', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80', 'A complete restaurant website with online ordering capabilities.', ARRAY['Next.js', 'TypeScript', 'Stripe', 'Prisma'], 'A comprehensive restaurant website that combines beautiful design with functional online ordering and reservation systems.

## Key Features
- Interactive menu with categories and filtering
- Online ordering with cart functionality
- Table reservation system
- Payment processing integration
- Admin dashboard for order management

## Technical Implementation
Built with Next.js and TypeScript for type safety. Integrated Stripe for payments and Prisma for database management. Responsive design ensures great experience on all devices.

## Results
- 200% increase in online orders
- 40% improvement in customer engagement
- 99.9% uptime during peak hours', 'https://example-restaurant.com', 'restaurant-website', '2024-03', '2024-05', 'Web Development', 'Completed'),

('SaaS Dashboard', 'A comprehensive SaaS dashboard with analytics, user management, and subscription billing.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80', 'A modern SaaS dashboard with comprehensive analytics and user management.', ARRAY['React', 'Node.js', 'PostgreSQL', 'Chart.js'], 'A sophisticated SaaS dashboard designed to provide comprehensive insights and user management capabilities.

## Key Features
- Real-time analytics and reporting
- User management and role-based access
- Subscription billing and payment tracking
- Data visualization with interactive charts
- API integration for third-party services

## Technical Implementation
React-based frontend with Node.js backend. PostgreSQL for data storage and Chart.js for data visualization. Secure authentication and authorization system.

## Results
- 60% improvement in user engagement
- 35% increase in subscription conversions
- 99.5% system reliability', 'https://example-saas.com', 'saas-dashboard', '2023-11', '2024-01', 'SaaS Platform', 'Completed'),

('Portfolio Website', 'A modern, responsive portfolio website showcasing web development projects and skills.', 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80', 'A personal portfolio website built with modern web technologies.', ARRAY['Next.js', 'TypeScript', 'Tailwind CSS'], 'This portfolio website was designed to showcase my web development skills and projects in a clean, professional manner.

## Design Philosophy
The design focuses on minimalism and user experience, with smooth animations and responsive layouts that work perfectly on all devices.

## Technical Features
- Server-side rendering with Next.js for optimal SEO
- TypeScript for type safety and better code quality
- Tailwind CSS for rapid styling and consistency
- Optimized images and lazy loading for performance

## Performance
- Lighthouse score: 95+
- Core Web Vitals: All green
- Mobile-first responsive design
- Fast loading times under 2 seconds', 'https://example-portfolio.com', 'portfolio-website', '2024-07', '2024-08', 'Portfolio Website', 'Completed');

-- Insert sample reviews (linked to specific projects)
-- Note: These will be linked to projects after they are created
INSERT INTO reviews (name, company, content, rating, project_id) VALUES
('Sarah Johnson', 'TechStart Inc.', 'Working with this developer was an absolute pleasure. The attention to detail and technical expertise delivered exactly what we needed. Our website performance improved significantly after the redesign.', 5, (SELECT id FROM projects WHERE slug = 'ecommerce-platform' LIMIT 1)),
('Michael Chen', 'Digital Solutions LLC', 'Exceptional work on our e-commerce platform. The developer understood our requirements perfectly and delivered a solution that exceeded our expectations. Highly recommended for any web development project.', 5, (SELECT id FROM projects WHERE slug = 'ecommerce-platform' LIMIT 1)),
('Emily Rodriguez', 'Creative Agency Co.', 'Outstanding work on our portfolio website. The developer was professional, responsive, and delivered exactly what we envisioned. The final product exceeded our expectations and helped us win new clients.', 5, (SELECT id FROM projects WHERE slug = 'portfolio-website' LIMIT 1)),
('David Thompson', 'StartupXYZ', 'The developer transformed our idea into a beautiful, functional web application. Their technical skills and attention to detail are impressive. We could not have asked for a better development partner.', 5, (SELECT id FROM projects WHERE slug = 'task-management-app' LIMIT 1)),
('Lisa Wang', 'E-commerce Plus', 'Professional, reliable, and incredibly talented. The developer delivered our e-commerce platform on time and within budget. The user experience is flawless and our sales have increased by 40%.', 5, (SELECT id FROM projects WHERE slug = 'ecommerce-platform' LIMIT 1));

-- Create storage bucket for contact form files
INSERT INTO storage.buckets (id, name, public) VALUES ('contact-files', 'contact-files', true);

-- Create storage policy for contact files
CREATE POLICY "Public upload access for contact files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'contact-files');

CREATE POLICY "Public read access for contact files" ON storage.objects
  FOR SELECT USING (bucket_id = 'contact-files');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
