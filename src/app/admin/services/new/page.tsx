'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createService } from '@/lib/database';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  icon_url: z.string().optional(),
});

type ServiceForm = z.infer<typeof serviceSchema>;

export default function NewServicePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
  });

  const onSubmit = async (data: ServiceForm) => {
    setIsSubmitting(true);
    
    try {
      await createService({
        ...data,
        icon_url: data.icon_url || '',
      });
      
      toast.success('Service created successfully!');
      router.push('/admin/services');
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Failed to create service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/services"
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New Service</h1>
          <p className="text-muted-foreground">Create a new service offering</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-background border border-border rounded-xl p-6 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                Service Title *
              </label>
              <input
                {...register('title')}
                type="text"
                id="title"
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Web Development"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                Description *
              </label>
              <textarea
                {...register('description')}
                id="description"
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Describe what this service includes and how it helps clients..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="icon_url" className="block text-sm font-medium text-foreground mb-2">
                Image URL (Optional)
              </label>
              <input
                {...register('icon_url')}
                type="url"
                id="icon_url"
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://example.com/image.png"
              />
              {errors.icon_url && (
                <p className="mt-1 text-sm text-destructive">{errors.icon_url.message}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                Provide a URL to an image for this service
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? 'Creating...' : 'Create Service'}
            </button>
            
            <Link
              href="/admin/services"
              className="px-4 py-2 border border-border text-foreground rounded-xl hover:bg-accent transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
