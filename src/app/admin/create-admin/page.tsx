'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CreateAdmin() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const createAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Log environment variables for debugging
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing');

      // Test database connection first
      const { data: testData, error: testError } = await supabase
        .from('admin_users')
        .select('count')
        .limit(1);

      if (testError) {
        toast.error('Database connection failed. Please make sure you have run the SQL schema in Supabase.');
        console.error('Database test error:', testError);
        setLoading(false);
        return;
      }

      // Sign up the admin user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(`Signup failed: ${error instanceof Error ? error.message : String(error)}`);
        console.error('Signup error:', error);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Add user to admin_users table
        const { error: insertError } = await supabase
          .from('admin_users')
          .insert([{ email }]);

        if (insertError) {
          console.error('Error adding to admin_users:', insertError);
          toast.error('Admin user created but failed to add to admin table. You can still login.');
        } else {
          toast.success('Admin user created successfully!');
        }

        setSuccess(true);
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-slate-900 rounded-2xl p-8 text-center">
            <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Admin Created!</h1>
            <p className="text-slate-300 mb-6">
              Your admin user has been created successfully. You'll be redirected to the login page.
            </p>
            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-slate-300 text-sm">
                <strong>Email:</strong> {email}<br />
                <strong>Password:</strong> {password}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back to Portfolio */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Portfolio</span>
          </Link>
        </div>

        {/* Create Admin Form */}
        <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="bg-emerald-600/20 p-3 rounded-xl w-fit mx-auto mb-4">
              <UserPlus className="h-8 w-8 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Admin User</h1>
            <p className="text-slate-400">Set up your admin account for the dashboard</p>
          </div>

          <form onSubmit={createAdmin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                placeholder="admin@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                placeholder="Enter a secure password"
                required
                minLength={6}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full border-b-2 border-white mr-2 h-4 w-4" />
                  Creating Admin...
                </div>
              ) : (
                'Create Admin User'
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-slate-800/50 rounded-xl">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-slate-400 text-sm">
                <p className="font-medium text-white mb-1">Important:</p>
                <p>Make sure you've run the database schema in Supabase before creating the admin user.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
