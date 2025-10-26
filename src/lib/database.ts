import { supabase } from './supabase';
import { Service, Tool, Project, Lead, ContactFormData, Review } from '@/types';
import { sampleServices, sampleTools, sampleProjects, sampleReviews } from './sample-data';

// Services
export async function getServices(): Promise<Service[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    return sampleServices;
  }
}

export async function createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('services')
    .insert(service)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateService(id: string, updates: Partial<Service>) {
  const { data, error } = await supabase
    .from('services')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteService(id: string) {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Tools
export async function getTools(): Promise<Tool[]> {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching tools:', error);
    return sampleTools;
  }
}

export async function createTool(tool: Omit<Tool, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('tools')
    .insert(tool)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateTool(id: string, updates: Partial<Tool>) {
  const { data, error } = await supabase
    .from('tools')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteTool(id: string) {
  const { error } = await supabase
    .from('tools')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Projects
export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return sampleProjects;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  console.log('=== getProjectBySlug called ===');
  console.log('Looking for slug:', slug);
  console.log('Slug type:', typeof slug);
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();
    
    console.log('Supabase query result:', { data, error });
    
    if (error) {
      console.log('Supabase error, falling back to sample data');
      const sampleProject = sampleProjects.find(project => project.slug === slug);
      console.log('Found in sample data:', sampleProject);
      return sampleProject || null;
    }
    
    console.log('Found project in database:', data);
    return data;
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    const sampleProject = sampleProjects.find(project => project.slug === slug);
    console.log('Exception caught, using sample data:', sampleProject);
    return sampleProject || null;
  }
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateProject(id: string, updates: Partial<Project>) {
  const { data, error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Reviews
export async function getReviews(): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return sampleReviews;
  }
}

export async function getReviewsByProjectId(projectId: string): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching reviews by project ID:', error);
    return [];
  }
}

export async function createReview(review: Omit<Review, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error creating review:', error);
      throw new Error(`Database error: ${error.message || 'Failed to create review'}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in createReview function:', error);
    throw error;
  }
}

export async function updateReview(id: string, updates: Partial<Review>) {
  const { data, error } = await supabase
    .from('reviews')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteReview(id: string) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Leads
export async function getLeads(): Promise<Lead[]> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
}

export async function createLead(leadData: ContactFormData) {
  console.log('createLead called with data:', leadData);
  
  // Calculate lead score
  const leadScore = calculateLeadScore(leadData);
  console.log('Calculated lead score:', leadScore);
  
  const insertData = {
    name: leadData.name,
    email: leadData.email,
    company: leadData.company,
    project_type: leadData.project_type,
    message: leadData.message,
    files: [],
    lead_score: leadScore,
    read: false,
    created_at: new Date().toISOString(),
  };
  
  console.log('Inserting lead data:', insertData);
  
  const { data, error } = await supabase
    .from('leads')
    .insert(insertData)
    .select()
    .single();
  
  if (error) {
    console.error('Supabase error creating lead:', error);
    throw new Error(`Database error: ${error.message || 'Failed to create lead'}`);
  }
  
  console.log('Lead created successfully:', data);
  return data;
}

function calculateLeadScore(data: ContactFormData): number {
  let score = 0;
  
  // Base score for filling out the form
  score += 10;
  
  // Project type scoring
  const highValueProjects = ['Web Application', 'E-commerce Store'];
  if (highValueProjects.includes(data.project_type)) {
    score += 20;
  }
  
  // Additional contact info
  if (data.company) score += 15;
  
  // Message length indicates engagement
  if (data.message.length > 100) score += 10;
  if (data.message.length > 200) score += 5;
  
  return Math.min(score, 100); // Cap at 100
}

export async function markLeadAsRead(id: string) {
  const { error } = await supabase
    .from('leads')
    .update({ read: true })
    .eq('id', id);
  
  if (error) throw error;
}

export async function deleteLead(id: string) {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}
