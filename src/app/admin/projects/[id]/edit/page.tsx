'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, X, Eye } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [projectId, setProjectId] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    thumbnail_url: '',
    tools_used: '',
    case_study_content: '',
    external_link: '',
    slug: '',
    start_date: '',
    end_date: '',
    type: '',
    status: '',
  });
  const router = useRouter();

  useEffect(() => {
    const getParams = async () => {
      const { id } = await params;
      setProjectId(id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    if (!projectId) return;
    
    try {
      console.log('Fetching project with ID:', projectId);
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      console.log('Project fetch result:', { data, error });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (!data) {
        console.error('No project found with ID:', projectId);
        throw new Error('Project not found');
      }
      
      setProject(data);
      setFormData({
        title: data.title || '',
        short_description: data.short_description || '',
        thumbnail_url: data.thumbnail_url || '',
        tools_used: data.tools_used ? data.tools_used.join(', ') : '',
        case_study_content: data.case_study_content || '',
        external_link: data.external_link || '',
        slug: data.slug || '',
        start_date: data.start_date || '',
        end_date: data.end_date || '',
        type: data.type || '',
        status: data.status || '',
      });
      
      console.log('Project loaded successfully:', data.title);
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error(`Failed to fetch project: ${error instanceof Error ? error.message : String(error)}`);
      router.push('/admin/projects');
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate slug if not provided
      const slug = formData.slug || generateSlug(formData.title);
      
      // Convert tools_used string to array
      const toolsArray = formData.tools_used
        .split(',')
        .map(tool => tool.trim())
        .filter(tool => tool.length > 0);

      console.log('Updating project with data:', {
        ...formData,
        tools_used: toolsArray,
        slug
      });

      const { data, error } = await supabase
        .from('projects')
        .update({
          title: formData.title,
          short_description: formData.short_description,
          thumbnail_url: formData.thumbnail_url,
          tools_used: toolsArray,
          case_study_content: formData.case_study_content,
          external_link: formData.external_link,
          slug: slug,
          start_date: formData.start_date,
          end_date: formData.end_date,
          type: formData.type,
          status: formData.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId)
        .select();

      console.log('Project update result:', { data, error });
      if (error) throw error;

      toast.success('Project updated successfully!');
      router.push('/admin/projects');
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error(`Failed to update project: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  if (!projectId || !project) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full border-b-2 border-emerald-500 mx-auto h-8 w-8 mb-4"></div>
          <div className="text-white text-xl">Loading project...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/projects" className="flex items-center space-x-2 text-white hover:text-emerald-400 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Projects</span>
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-white">Edit Project</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-slate-900 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter project title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="project-slug (auto-generated if empty)"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Short Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Brief description of the project"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Thumbnail URL
              </label>
              <input
                type="url"
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Start Date
                </label>
                <input
                  type="month"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  End Date
                </label>
                <input
                  type="month"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select Type</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="SaaS Platform">SaaS Platform</option>
                  <option value="Portfolio Website">Portfolio Website</option>
                  <option value="Landing Page">Landing Page</option>
                  <option value="API Development">API Development</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select Status</option>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Planning">Planning</option>
                </select>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="bg-slate-900 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Detailed Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tools Used (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tools_used}
                  onChange={(e) => setFormData({ ...formData, tools_used: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="React, Next.js, TypeScript, Tailwind CSS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  External Link
                </label>
                <input
                  type="url"
                  value={formData.external_link}
                  onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Case Study Content (Markdown)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{showPreview ? 'Show Editor' : 'Show Preview'}</span>
                  </button>
                </div>
                {showPreview ? (
                  <div className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl min-h-[300px] max-h-[600px] overflow-y-auto">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => <h1 className="text-3xl font-bold text-white mb-4 mt-6">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-bold text-white mb-3 mt-5">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-bold text-white mb-2 mt-4">{children}</h3>,
                        h4: ({ children }) => <h4 className="text-lg font-bold text-white mb-2 mt-3">{children}</h4>,
                        p: ({ children }) => <p className="text-slate-300 mb-4 leading-relaxed">{children}</p>,
                        strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                        em: ({ children }) => <em className="italic text-slate-300">{children}</em>,
                        ul: ({ children }) => <ul className="list-disc list-inside text-slate-300 mb-4 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside text-slate-300 mb-4 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="text-slate-300">{children}</li>,
                        code: ({ children }) => <code className="bg-slate-900 text-emerald-400 px-1.5 py-0.5 rounded font-mono text-sm">{children}</code>,
                        pre: ({ children }) => <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg mb-4 overflow-x-auto">{children}</pre>,
                        a: ({ href, children }) => <a href={href} className="text-emerald-400 hover:text-emerald-300 underline">{children}</a>,
                      hr: () => <hr className="border-slate-700 my-6" />,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-slate-400 mb-4">{children}</blockquote>,
                      img: ({ src, alt }) => (
                        <div className="my-4">
                          <img 
                            src={src} 
                            alt={alt} 
                            className="max-w-full h-auto rounded-xl shadow-lg border border-slate-700"
                          />
                        </div>
                      ),
                    }}
                    >
                      {formData.case_study_content || '*No content yet. Start typing to see the preview.*'}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <textarea
                    rows={12}
                    value={formData.case_study_content}
                    onChange={(e) => setFormData({ ...formData, case_study_content: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm resize-y"
                    placeholder={`# Project Title

## Overview
Describe your project...

## Key Features
- Feature 1
- **Bold feature**
- *Italic feature*

## Technical Implementation
Explain the technical details...

### Subsection
More details...

## Results
Describe the outcomes...`}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/projects"
              className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Updating...' : 'Update Project'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
