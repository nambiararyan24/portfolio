import { Service, Tool, Project, Review } from '@/types';

export const sampleServices: Service[] = [
  {
    id: '1',
    title: 'Web Development',
    description: 'Custom websites and web applications built with modern technologies like React, Next.js, and TypeScript.',
    icon_url: '/icons/web-dev.svg',
    type: 'Product',
    display_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'E-commerce Solutions',
    description: 'Complete e-commerce platforms with payment integration, inventory management, and admin dashboards.',
    icon_url: '/icons/ecommerce.svg',
    type: 'Product',
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Mobile-First Design',
    description: 'Responsive designs that work perfectly on all devices, from mobile phones to desktop computers.',
    icon_url: '/icons/mobile.svg',
    type: 'Skill',
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Performance Optimization',
    description: 'Fast-loading websites with optimized images, code splitting, and modern performance techniques.',
    icon_url: '/icons/performance.svg',
    type: 'Skill',
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const sampleTools: Tool[] = [
  {
    id: '1',
    name: 'React',
    logo_url: '/logos/react.svg',
    link: 'https://reactjs.org',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Next.js',
    logo_url: '/logos/nextjs.svg',
    link: 'https://nextjs.org',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'TypeScript',
    logo_url: '/logos/typescript.svg',
    link: 'https://www.typescriptlang.org',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Tailwind CSS',
    logo_url: '/logos/tailwind.svg',
    link: 'https://tailwindcss.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Supabase',
    logo_url: '/logos/supabase.svg',
    link: 'https://supabase.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Vercel',
    logo_url: '/logos/vercel.svg',
    link: 'https://vercel.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform',
    short_description: 'A modern e-commerce platform with payment integration and admin dashboard.',
    thumbnail_url: '/images/project-1.jpg',
    full_description: 'A comprehensive e-commerce solution built with Next.js, featuring a modern design, secure payment processing, and a complete admin dashboard for managing products, orders, and customers.',
    tools_used: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe', 'Supabase'],
    display_order: 0,
    case_study_content: `# E-commerce Platform Case Study

## Project Overview
This project involved building a complete e-commerce platform from scratch, including both customer-facing and admin interfaces.

## Key Features
- Product catalog with search and filtering
- Shopping cart and checkout process
- Payment integration with Stripe
- Admin dashboard for inventory management
- Order tracking and customer management

## Technical Implementation
- **Frontend**: Next.js with TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **Backend**: Supabase for database and authentication
- **Payments**: Stripe for secure payment processing
- **Deployment**: Vercel for fast global delivery

## Results
- 40% increase in conversion rate
- 60% faster page load times
- 99.9% uptime achieved
- Positive feedback from both customers and admin users`,
    external_link: 'https://example-ecommerce.com',
    slug: 'ecommerce-platform',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Portfolio Website',
    short_description: 'A modern portfolio website with contact form and project showcase.',
    thumbnail_url: '/images/project-2.jpg',
    full_description: 'A responsive portfolio website featuring a clean design, smooth animations, and an integrated contact form with file upload capabilities.',
    tools_used: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion'],
    display_order: 1,
    case_study_content: `# Portfolio Website Case Study

## Project Overview
A personal portfolio website designed to showcase projects and skills while providing an easy way for potential clients to get in touch.

## Key Features
- Responsive design for all devices
- Smooth scroll animations
- Contact form with file upload
- Project showcase with detailed case studies
- SEO optimized for better visibility

## Technical Implementation
- **Framework**: Next.js for optimal performance
- **Styling**: Tailwind CSS for utility-first styling
- **Animations**: Framer Motion for smooth transitions
- **Forms**: React Hook Form with validation
- **Deployment**: Vercel for automatic deployments

## Results
- 95+ PageSpeed score
- Mobile-first responsive design
- Easy content management
- Professional presentation of work`,
    external_link: 'https://example-portfolio.com',
    slug: 'portfolio-website',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'SaaS Dashboard',
    short_description: 'A comprehensive dashboard for managing users, analytics, and business metrics.',
    thumbnail_url: '/images/project-3.jpg',
    full_description: 'A full-featured SaaS dashboard with user management, analytics visualization, and real-time data updates.',
    tools_used: ['React', 'TypeScript', 'Chart.js', 'Supabase', 'Tailwind CSS'],
    display_order: 2,
    case_study_content: `# SaaS Dashboard Case Study

## Project Overview
A comprehensive dashboard application for a SaaS business, providing insights into user behavior, business metrics, and system performance.

## Key Features
- Real-time analytics and metrics
- User management and permissions
- Interactive charts and graphs
- Export functionality for reports
- Mobile-responsive design

## Technical Implementation
- **Frontend**: React with TypeScript
- **Charts**: Chart.js for data visualization
- **Backend**: Supabase for real-time data
- **Styling**: Tailwind CSS for consistent design
- **State Management**: React Context for global state

## Results
- 50% improvement in data visibility
- Real-time updates for better decision making
- Intuitive user interface
- Scalable architecture for future growth`,
    external_link: 'https://example-dashboard.com',
    slug: 'saas-dashboard',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const sampleReviews: Review[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'TechStart Inc.',
    content: 'Working with this developer was an absolute pleasure. The attention to detail and technical expertise delivered exactly what we needed. Our website performance improved significantly after the redesign.',
    rating: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'Digital Solutions LLC',
    content: 'Exceptional work on our e-commerce platform. The developer understood our requirements perfectly and delivered a solution that exceeded our expectations. Highly recommended for any web development project.',
    rating: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    company: 'Creative Agency Co.',
    content: 'Outstanding work on our portfolio website. The developer was professional, responsive, and delivered exactly what we envisioned. The final product exceeded our expectations and helped us win new clients.',
    rating: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'David Thompson',
    company: 'StartupXYZ',
    content: 'The developer transformed our idea into a beautiful, functional web application. Their technical skills and attention to detail are impressive. We could not have asked for a better development partner.',
    rating: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Lisa Wang',
    company: 'E-commerce Plus',
    content: 'Professional, reliable, and incredibly talented. The developer delivered our e-commerce platform on time and within budget. The user experience is flawless and our sales have increased by 40%.',
    rating: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];