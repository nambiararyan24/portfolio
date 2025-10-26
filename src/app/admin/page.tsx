'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User, Settings, Plus, Eye, Edit, Trash2, ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';

interface AdminStats {
  totalServices: number;
  totalProjects: number;
  totalLeads: number;
  totalReviews: number;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalServices: 0,
    totalProjects: 0,
    totalLeads: 0,
    totalReviews: 0,
  });
  const router = useRouter();

  useEffect(() => {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co') {
      // Show demo mode message instead of redirecting
      setLoading(false);
      return;
    }
    
    checkUser();
    fetchStats();
  }, []);

  const checkUser = async () => {
    try {
      // Check if we're on the client side
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      // Check if admin is authenticated via localStorage
      const isAuthenticated = localStorage.getItem('admin_authenticated');
      const adminEmail = localStorage.getItem('admin_email');
      
      if (!isAuthenticated || !adminEmail) {
        router.push('/admin/login');
        return;
      }
      
      setUser({ email: adminEmail });
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [servicesRes, projectsRes, leadsRes, reviewsRes] = await Promise.all([
        supabase.from('services').select('id', { count: 'exact' }),
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('leads').select('id', { count: 'exact' }),
        supabase.from('reviews').select('id', { count: 'exact' }),
      ]);

      const totalLeads = leadsRes.data?.length || 0;
      const totalReviews = reviewsRes.data?.length || 0;

      setStats({
        totalServices: servicesRes.count || 0,
        totalProjects: projectsRes.count || 0,
        totalLeads,
        totalReviews,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = async () => {
    // Clear admin session from localStorage
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_email');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full border-b-2 border-emerald-500 mx-auto h-8 w-8 mb-4"></div>
          <div className="text-white text-xl">Loading Admin Dashboard...</div>
        </div>
      </div>
    );
  }

  // Show demo mode if Supabase is not properly configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co') {
    return (
      <div className="min-h-screen bg-slate-950">
        {/* Header */}
        <header className="bg-slate-900 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2 text-white hover:text-emerald-400 transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Portfolio</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-slate-300">Demo Mode</span>
                <Link
                  href="/admin/setup"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-colors"
                >
                  Configure Supabase
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Demo Mode Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard - Demo Mode</h1>
            <p className="text-slate-300 text-lg mb-6">
              This is a demo of the admin dashboard. To access full functionality, please configure Supabase.
            </p>
            <div className="bg-slate-900 rounded-2xl p-6 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-white mb-4">What you can do:</h2>
              <ul className="text-slate-300 space-y-2 text-left">
                <li>• View the admin dashboard interface</li>
                <li>• Navigate between different sections</li>
                <li>• See the responsive design</li>
                <li>• Test the UI components</li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/admin/setup"
                  className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Configure Supabase for Full Access
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Redirecting to login...</div>
          <div className="animate-spin rounded-full border-b-2 border-emerald-500 mx-auto h-6 w-6"></div>
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
              <Link href="/" className="flex items-center space-x-2 text-white hover:text-emerald-400 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Portfolio</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">Welcome, {user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-300 text-lg">Manage your portfolio content and leads</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 rounded-2xl p-6 hover:bg-slate-800 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Services</p>
                <p className="text-3xl font-bold text-white">{stats.totalServices}</p>
              </div>
              <div className="bg-emerald-600/20 p-3 rounded-xl">
                <Settings className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 hover:bg-slate-800 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Projects</p>
                <p className="text-3xl font-bold text-white">{stats.totalProjects}</p>
              </div>
              <div className="bg-blue-600/20 p-3 rounded-xl">
                <Eye className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 hover:bg-slate-800 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Leads</p>
                <p className="text-3xl font-bold text-white">{stats.totalLeads}</p>
              </div>
              <div className="bg-purple-600/20 p-3 rounded-xl">
                <User className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 hover:bg-slate-800 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Reviews</p>
                <p className="text-3xl font-bold text-white">{stats.totalReviews}</p>
              </div>
              <div className="bg-yellow-600/20 p-3 rounded-xl">
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/admin/services"
            className="group bg-slate-900 rounded-2xl p-6 hover:bg-slate-800 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-600/20 p-3 rounded-xl group-hover:bg-emerald-600/30 transition-colors">
                <Settings className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  Manage Services
                </h3>
                <p className="text-slate-400 text-sm">Add, edit, or remove services</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/projects"
            className="group bg-slate-900 rounded-2xl p-6 hover:bg-slate-800 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600/20 p-3 rounded-xl group-hover:bg-blue-600/30 transition-colors">
                <Eye className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Manage Projects
                </h3>
                <p className="text-slate-400 text-sm">Add, edit, or remove projects</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/leads"
            className="group bg-slate-900 rounded-2xl p-6 hover:bg-slate-800 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-600/20 p-3 rounded-xl group-hover:bg-purple-600/30 transition-colors">
                <User className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                  View Leads
                </h3>
                <p className="text-slate-400 text-sm">Manage contact form submissions</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/reviews"
            className="group bg-slate-900 rounded-2xl p-6 hover:bg-slate-800 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-600/20 p-3 rounded-xl group-hover:bg-yellow-600/30 transition-colors">
                <User className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
                  Manage Reviews
                </h3>
                <p className="text-slate-400 text-sm">Add, edit, or remove client reviews</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}