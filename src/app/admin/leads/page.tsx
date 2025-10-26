'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lead } from '@/types';
import { ArrowLeft, Mail, User, Calendar, Eye, EyeOff, Trash2, Check } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchLeads();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if admin is authenticated via localStorage
      const isAuthenticated = localStorage.getItem('admin_authenticated');
      if (!isAuthenticated) {
        router.push('/admin/login');
        return;
      }
      
      // Also check if we can access the database
      const { data, error } = await supabase
        .from('leads')
        .select('id')
        .limit(1);
        
      if (error) {
        console.error('Database access error:', error);
        toast.error('Database connection failed. Please check your configuration.');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/admin/login');
    }
  };

  const fetchLeads = async () => {
    try {
      console.log('Fetching leads...');
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching leads:', error);
        throw new Error(`Database error: ${error.message || 'Failed to fetch leads'}`);
      }
      
      console.log('Leads fetched successfully:', data);
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error(`Failed to fetch leads: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;
      toast.success('Marked as read');
      await fetchLeads();
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const markAsUnread = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ read: false })
        .eq('id', id);

      if (error) throw error;
      toast.success('Marked as unread');
      await fetchLeads();
    } catch (error) {
      console.error('Error marking as unread:', error);
      toast.error('Failed to mark as unread');
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Lead deleted successfully');
      await fetchLeads();
      setSelectedLead(null);
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    }
  };

  const filteredLeads = leads.filter(lead => {
    if (filter === 'unread') return !lead.read;
    if (filter === 'read') return lead.read;
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">
                {filteredLeads.length} {filter === 'all' ? 'total' : filter} leads
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Manage Leads</h1>
          <p className="text-slate-300 text-lg">View and manage contact form submissions</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl transition-colors ${
              filter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Leads
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-xl transition-colors ${
              filter === 'unread'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-xl transition-colors ${
              filter === 'read'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Read
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leads List */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedLead?.id === lead.id
                      ? 'bg-emerald-600'
                      : lead.read
                      ? 'bg-slate-800 hover:bg-slate-700'
                      : 'bg-slate-800 hover:bg-slate-700 border-l-4 border-emerald-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${selectedLead?.id === lead.id ? 'text-white' : 'text-white'}`}>
                        {lead.name}
                      </h3>
                      <p className={`text-sm ${selectedLead?.id === lead.id ? 'text-white/80' : 'text-slate-400'}`}>
                        {lead.email}
                      </p>
                      <p className={`text-xs mt-1 ${selectedLead?.id === lead.id ? 'text-white/60' : 'text-slate-500'}`}>
                        {formatDate(lead.created_at)}
                      </p>
                    </div>
                    {!lead.read && (
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredLeads.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">No leads found</p>
              </div>
            )}
          </div>

          {/* Lead Details */}
          <div className="lg:col-span-2">
            {selectedLead ? (
              <div className="bg-slate-900 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedLead.name}</h2>
                    <div className="flex items-center space-x-4 text-slate-400">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{selectedLead.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(selectedLead.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {selectedLead.read ? (
                      <button
                        onClick={() => markAsUnread(selectedLead.id)}
                        className="p-2 text-slate-400 hover:text-yellow-400 transition-colors"
                        title="Mark as unread"
                      >
                        <EyeOff className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => markAsRead(selectedLead.id)}
                        className="p-2 text-slate-400 hover:text-green-400 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteLead(selectedLead.id)}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete lead"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Project Type</h3>
                    <p className="text-slate-300 bg-slate-800 px-4 py-2 rounded-xl inline-block">
                      {selectedLead.project_type}
                    </p>
                  </div>

                  {selectedLead.company && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Company</h3>
                      <p className="text-slate-300">{selectedLead.company}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Message</h3>
                    <div className="bg-slate-800 rounded-xl p-4">
                      <p className="text-slate-300 whitespace-pre-wrap">{selectedLead.message}</p>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-2xl p-12 text-center">
                <User className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Select a Lead</h3>
                <p className="text-slate-400">Choose a lead from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}