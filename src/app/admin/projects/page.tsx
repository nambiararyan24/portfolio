'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Edit, Trash2, FolderOpen, ExternalLink, ArrowLeft, GripVertical, Search } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Project } from '@/types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableProject({ project, onDelete }: { 
  project: Project; 
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-900 rounded-2xl overflow-hidden hover:bg-slate-800 transition-all duration-300 hover:shadow-lg"
    >
      {/* Project Image */}
      <div className="relative h-48 bg-slate-800">
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FolderOpen className="w-12 h-12 text-slate-400" />
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-white text-lg">{project.title}</h3>
          <div className="flex items-center space-x-2">
            <button
              {...attributes}
              {...listeners}
              className="p-2 text-slate-400 hover:text-slate-300 cursor-grab active:cursor-grabbing transition-colors"
              title="Drag to reorder"
            >
              <GripVertical className="w-4 h-4" />
            </button>
            <Link
              href={`/admin/projects/${project.id}/edit`}
              className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Edit project"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => onDelete(project.id)}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Delete project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-slate-300 text-sm mb-4 line-clamp-2">
          {project.short_description}
        </p>

        {/* Tools Used */}
        {project.tools_used && project.tools_used.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.tools_used.slice(0, 3).map((tool, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md"
              >
                {tool}
              </span>
            ))}
            {project.tools_used.length > 3 && (
              <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md">
                +{project.tools_used.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Created {formatDate(project.created_at)}</span>
          {project.external_link && (
            <a
              href={project.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Live Site
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    checkAuth();
    fetchProjects();
  }, []);

  // Filter projects based on search query
  useEffect(() => {
    let filtered = projects;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        project =>
          project.title.toLowerCase().includes(query) ||
          project.short_description.toLowerCase().includes(query) ||
          project.slug.toLowerCase().includes(query)
      );
    }
    
    setFilteredProjects(filtered);
  }, [projects, searchQuery]);

  const checkAuth = () => {
    // Check if we're on the client side
    if (typeof window === 'undefined') {
      return;
    }

    const isAuthenticated = localStorage.getItem('admin_authenticated');
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((item) => item.id === active.id);
    const newIndex = projects.findIndex((item) => item.id === over.id);

    const newProjects = arrayMove(projects, oldIndex, newIndex);
    setProjects(newProjects);

    // Update display_order in database
    try {
      const updates = newProjects.map((project, index) => ({
        id: project.id,
        display_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from('projects')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      toast.success('Order updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
      // Revert on error
      fetchProjects();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
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
              <Link href="/admin" className="flex items-center space-x-2 text-white hover:text-emerald-400 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <Link
              href="/admin/projects/new"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Project</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Manage Projects</h1>
          <p className="text-slate-300 text-lg">Add, edit, or remove your projects</p>
        </div>

        {/* Search Bar */}
        {projects.length > 0 && (
          <div className="bg-slate-900 rounded-2xl p-6 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects by title, description, or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No projects yet</h3>
            <p className="text-slate-400 mb-4">Add your first project to showcase your work.</p>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Link>
          </div>
        ) : filteredProjects.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredProjects.map((p) => p.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProjects.map((project) => (
                  <SortableProject
                    key={project.id}
                    project={project}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-12 bg-slate-900 rounded-2xl">
            <p className="text-slate-400 text-lg mb-4">
              No projects match your search criteria.
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
