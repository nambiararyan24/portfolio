'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Service } from '@/types';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, GripVertical, Search } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
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

function SortableService({ service, onEdit, onDelete }: { 
  service: Service; 
  onEdit: (service: Service) => void; 
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-900 rounded-2xl overflow-hidden hover:bg-slate-800 transition-all duration-300"
    >
      {service.icon_url && (
        <div className="w-full h-48 bg-slate-800 overflow-hidden">
          <img
            src={service.icon_url}
            alt={service.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              service.type === 'Product' 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'bg-purple-500/20 text-purple-400'
            }`}>
              {service.type}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              {...attributes}
              {...listeners}
              className="p-2 text-slate-400 hover:text-slate-300 cursor-grab active:cursor-grabbing transition-colors"
              title="Drag to reorder"
            >
              <GripVertical className="h-5 w-5" />
            </button>
            <button
              onClick={() => onEdit(service)}
              className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(service.id)}
              className="p-2 text-slate-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">{service.description}</p>
      </div>
    </div>
  );
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Product' | 'Skill'>('All');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Product' as 'Product' | 'Skill',
    icon_url: '',
  });
  const router = useRouter();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    checkAuth();
    fetchServices();
  }, []);

  // Filter services based on search query and type
  useEffect(() => {
    let filtered = services;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        service =>
          service.title.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by type
    if (typeFilter !== 'All') {
      filtered = filtered.filter(service => service.type === typeFilter);
    }
    
    setFilteredServices(filtered);
  }, [services, searchQuery, typeFilter]);

  const checkAuth = () => {
    // Check if we're on the client side
    if (typeof window === 'undefined') {
      return;
    }

    const isAuthenticated = localStorage.getItem('admin_authenticated');
    console.log('Admin authentication check:', { isAuthenticated });
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      router.push('/admin/login');
    } else {
      console.log('Admin is authenticated');
    }
  };

  const fetchServices = async () => {
    try {
      console.log('Fetching services...');
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      console.log('Services fetch result:', { data, error });
      if (error) throw error;
      setServices(data || []);
      console.log('Services set:', data?.length || 0, 'items');
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error(`Failed to fetch services: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = services.findIndex((item) => item.id === active.id);
    const newIndex = services.findIndex((item) => item.id === over.id);

    const newServices = arrayMove(services, oldIndex, newIndex);
    setServices(newServices);

    // Update display_order in database
    try {
      const updates = newServices.map((service, index) => ({
        id: service.id,
        display_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from('services')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      toast.success('Order updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
      // Revert on error
      fetchServices();
    }
  };

  // Clear search and filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setTypeFilter('All');
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({ title: '', description: '', type: 'Product', icon_url: '' });
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setIsAdding(false);
    setFormData({
      title: service.title,
      description: service.description,
      type: service.type,
      icon_url: service.icon_url || '',
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ title: '', description: '', type: 'Product', icon_url: '' });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      console.log('Saving service:', formData);
      
      if (editingId) {
        // Update existing service
        console.log('Updating service with ID:', editingId);
        const { data, error } = await supabase
          .from('services')
          .update({
            title: formData.title,
            description: formData.description,
            type: formData.type,
            icon_url: formData.icon_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId)
          .select();

        console.log('Update result:', { data, error });
        if (error) throw error;
        toast.success('Service updated successfully');
      } else {
        // Add new service
        console.log('Adding new service');
        const { data, error } = await supabase
          .from('services')
          .insert({
            title: formData.title,
            description: formData.description,
            type: formData.type,
            icon_url: formData.icon_url,
          })
          .select();

        console.log('Insert result:', { data, error });
        if (error) throw error;
        toast.success('Service added successfully');
      }

      await fetchServices();
      handleCancel();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error(`Failed to save service: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      console.log('Deleting service with ID:', id);
      const { data, error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)
        .select();

      console.log('Delete result:', { data, error });
      if (error) throw error;
      toast.success('Service deleted successfully');
      await fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error(`Failed to delete service: ${error instanceof Error ? error.message : String(error)}`);
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
            <button
              onClick={handleAdd}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Service</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Manage Services</h1>
          <p className="text-slate-300 text-lg">Add, edit, or remove your services</p>
        </div>

        {/* Search Bar and Filters */}
        <div className="bg-slate-900 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search services by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setTypeFilter('All')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  typeFilter === 'All'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTypeFilter('Product')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  typeFilter === 'Product'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Product
              </button>
              <button
                onClick={() => setTypeFilter('Skill')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  typeFilter === 'Skill'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Skill
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <div className="bg-slate-900 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingId ? 'Edit Service' : 'Add New Service'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Service title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Product' | 'Skill' })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="Product">Product</option>
                  <option value="Skill">Skill</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  placeholder="Service description"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.icon_url}
                  onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="https://example.com/image.png"
                />
                {formData.icon_url && (
                  <div className="mt-3">
                    <p className="text-sm text-slate-400 mb-2">Preview:</p>
                    <img
                      src={formData.icon_url}
                      alt="Icon preview"
                      className="w-64 h-64 object-contain bg-slate-800 border border-slate-700 rounded-lg p-2"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        )}

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredServices.map((s) => s.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <SortableService
                    key={service.id}
                    service={service}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-12 bg-slate-900 rounded-2xl">
            <p className="text-slate-400 text-lg mb-4">
              {services.length === 0 
                ? 'No services found. Add your first service!' 
                : 'No services match your search criteria.'}
            </p>
            {services.length > 0 && (searchQuery || typeFilter !== 'All') && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}