export interface Service {
  id: string;
  title: string;
  description: string;
  icon_url: string;
  type: 'Product' | 'Skill';
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Tool {
  id: string;
  name: string;
  logo_url: string;
  link?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  short_description: string;
  thumbnail_url: string;
  full_description: string;
  tools_used: string[];
  case_study_content: string; // Markdown content
  external_link?: string;
  slug: string;
  start_date?: string; // Format: YYYY-MM
  end_date?: string; // Format: YYYY-MM
  type?: string; // Project type
  status?: string; // Project status
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  name: string;
  company: string;
  content: string;
  rating: number;
  project_id?: string;
  is_approved?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  project_type: string;
  budget_range?: string;
  timeline?: string;
  message: string;
  preferred_contact_method?: 'email' | 'phone' | 'either';
  newsletter_signup?: boolean;
  files?: string[]; // Array of file URLs
  lead_score?: number;
  created_at: string;
  read: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  project_type: string;
  message: string;
  recaptcha_token?: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  cta_text: string;
  background_image?: string;
}

export interface FooterContent {
  social_links: {
    platform: string;
    url: string;
    icon: string;
  }[];
  resume_url?: string;
}