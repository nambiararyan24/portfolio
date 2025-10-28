'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Edit, Trash2, Star, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Review } from '@/types';
import { sampleReviews } from '@/lib/sample-data';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchReviews();
  }, []);

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

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Use sample data as fallback when database is not available
      setReviews(sampleReviews);
      toast.error('Using sample data - database not available');
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_approved: !currentStatus })
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        
        // Check if the error is about missing column
        if (error.message?.includes('is_approved') || error.code === '42703') {
          toast.error('The is_approved column does not exist. Please run the database migration first.', {
            duration: 6000,
          });
          return;
        }
        
        throw error;
      }
      
      toast.success(`Review ${!currentStatus ? 'approved' : 'unapproved'} successfully`);
      await fetchReviews();
    } catch (error) {
      console.error('Error toggling approval:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to update approval status: ${errorMessage}`, {
        duration: 6000,
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      // Check if this is sample data
      const isSampleData = sampleReviews.some(review => review.id === id);
      if (isSampleData) {
        toast.error('Cannot delete sample data. Please add reviews to the database first.');
        return;
      }

      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Review deleted successfully');
      await fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full border-b-2 border-emerald-500 mx-auto h-8 w-8 mb-4"></div>
          <div className="text-white text-xl">Loading Reviews...</div>
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
              <Link href="/admin" className="flex items-center space-x-2 text-white hover:text-emerald-400 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/reviews/new"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-colors inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Review
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Manage Reviews</h1>
          <p className="text-slate-300 text-lg">Add, edit, or remove client reviews</p>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No reviews yet</h3>
            <p className="text-slate-400 mb-4">Add your first client review to get started.</p>
            <Link
              href="/admin/reviews/new"
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Review
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-slate-900 rounded-2xl p-6 hover:bg-slate-800 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">{review.name}</h3>
                      {sampleReviews.some(sample => sample.id === review.id) && (
                        <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 text-xs rounded-full">
                          Sample
                        </span>
                      )}
                      {!review.is_approved && (
                        <span className="px-2 py-1 bg-red-600/20 text-red-400 text-xs rounded-full">
                          Hidden
                        </span>
                      )}
                      {review.is_approved && (
                        <span className="px-2 py-1 bg-emerald-600/20 text-emerald-400 text-xs rounded-full">
                          Live
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{review.company}</p>
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!review.is_approved && !sampleReviews.some(sample => sample.id === review.id) && (
                      <button
                        onClick={() => toggleApproval(review.id, false)}
                        className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-900/20 rounded-lg transition-colors"
                        title="Approve review"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {review.is_approved && !sampleReviews.some(sample => sample.id === review.id) && (
                      <button
                        onClick={() => toggleApproval(review.id, true)}
                        className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-yellow-900/20 rounded-lg transition-colors"
                        title="Hide review"
                      >
                        <EyeOff className="w-4 h-4" />
                      </button>
                    )}
                    {sampleReviews.some(sample => sample.id === review.id) ? (
                      <div className="p-2 text-slate-500 cursor-not-allowed" title="Cannot edit sample data">
                        <Edit className="w-4 h-4" />
                      </div>
                    ) : (
                      <Link
                        href={`/admin/reviews/${review.id}/edit`}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    )}
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">
                  "{review.content}"
                </p>
                
                <div className="text-xs text-slate-500">
                  Added {formatDate(review.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
