'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle, Mail, Building, User, MessageSquare, Shield, AlertCircle } from 'lucide-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { cn } from '@/lib/utils';
import { createLead } from '@/lib/database';
import { ContactFormData } from '@/types';
import toast from 'react-hot-toast';
import { useFormAnalytics } from '@/hooks/useFormAnalytics';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  company: z.string().optional(),
  project_type: z.string().min(1, 'Please select a project type'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  recaptcha_token: z.string().optional(),
});

const projectTypes = [
  'Website Development',
  'Web Application',
  'E-commerce Store',
  'Portfolio Website',
  'Landing Page',
  'Mobile App',
  'API Development',
  'Other',
];


interface EnhancedContactFormProps {
  isFixed?: boolean;
}

export default function EnhancedContactForm({ isFixed = false }: EnhancedContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const { executeRecaptcha } = useGoogleReCaptcha();
  const analytics = useFormAnalytics({ 
    formName: 'contact-form',
    trackAbandonment: true,
    trackFieldInteractions: true 
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });


  const watchedFields = watch();

  // Track form data for analytics - use useMemo to prevent infinite loops
  const formDataForAnalytics = useMemo(() => watchedFields, [watchedFields]);

  // Track form abandonment
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formDataForAnalytics && Object.keys(formDataForAnalytics).length > 0 && !isSubmitted) {
        analytics.trackFormAbandonment();
      }
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [formDataForAnalytics, isSubmitted, analytics]);



  const onSubmit = async (data: ContactFormData) => {
    console.log('Form submission started with data:', data);
    setIsSubmitting(true);
    
    try {
      // Execute reCAPTCHA (optional - won't fail if not configured)
      let recaptchaToken = '';
      if (executeRecaptcha) {
        try {
          recaptchaToken = await executeRecaptcha('contact_form_submit');
        } catch (recaptchaError) {
          console.warn('reCAPTCHA failed, continuing without it:', recaptchaError);
        }
      }

      // Create lead with reCAPTCHA token
      const leadData = {
        ...data,
        recaptcha_token: recaptchaToken,
      };

      const createdLead = await createLead(leadData);
      console.log('Lead created successfully:', createdLead);

      // Send email notifications (optional - won't fail if not configured)
      try {
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!emailResponse.ok) {
          console.warn('Email notification failed, but lead was saved');
        }
      } catch (emailError) {
        console.warn('Email notification failed, but lead was saved:', emailError);
      }

      analytics.trackFormSubmit(true);
      setIsSubmitted(true);
      reset();
      setCharCount(0);
      toast.success('Thank you! Your message has been sent successfully.');
    } catch (error) {
      console.error('Error submitting form:', error);
      analytics.trackFormSubmit(false, error instanceof Error ? error.message : 'Unknown error');
      toast.error(`Sorry, there was an error sending your message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Thank You!
        </h2>
        <p className="text-muted-foreground text-sm mb-8">
          Your message has been sent successfully. I'll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <form 
        id={isFixed ? "contact-form-fixed" : "contact-form"} 
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-3"
      >
        {/* Honeypot field for spam protection */}
        <input 
          type="text" 
          name="website" 
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Row 1: Name, Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="name" className={cn("block font-medium text-white mb-2", isFixed ? "text-sm" : "text-sm")}>
              <User className={cn("inline mr-1", isFixed ? "h-4 w-4" : "h-4 w-4")} />
              Name *
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className={cn(
                'w-full rounded-xl bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors',
                isFixed ? 'px-4 py-3 text-base' : 'px-3 py-2',
                errors.name && 'focus:ring-red-500'
              )}
              placeholder="Your full name"
              onFocus={() => analytics.trackFieldFocus('name')}
              onBlur={(e) => analytics.trackFieldBlur('name', e.target.value)}
            />
            <div className="mt-2">
              {errors.name && (
                <div className={cn("flex items-center space-x-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg", isFixed ? "text-xs" : "text-sm")}>
                  <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                  <p className="text-red-300 font-medium">{errors.name.message}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className={cn("block font-medium text-white mb-2", isFixed ? "text-sm" : "text-sm")}>
              <Mail className={cn("inline mr-1", isFixed ? "h-4 w-4" : "h-4 w-4")} />
              Email *
            </label>
            <input
              {...register('email')}
              type="text"
              id="email"
              className={cn(
                'w-full rounded-xl bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors',
                isFixed ? 'px-4 py-3 text-base' : 'px-3 py-2',
                errors.email && 'focus:ring-red-500'
              )}
              placeholder="your@email.com"
              onFocus={() => analytics.trackFieldFocus('email')}
              onBlur={(e) => analytics.trackFieldBlur('email', e.target.value)}
            />
            <div className="mt-2">
              {errors.email && (
                <div className={cn("flex items-center space-x-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg", isFixed ? "text-xs" : "text-sm")}>
                  <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                  <p className="text-red-300 font-medium">{errors.email.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Company, Project Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="company" className={cn("block font-medium text-white mb-2", isFixed ? "text-sm" : "text-sm")}>
              <Building className={cn("inline mr-1", isFixed ? "h-4 w-4" : "h-4 w-4")} />
              Company (Optional)
            </label>
            <input
              {...register('company')}
              type="text"
              id="company"
              className={cn(
                'w-full rounded-xl bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors',
                isFixed ? 'px-4 py-3 text-base' : 'px-3 py-2'
              )}
              placeholder="Your company name"
              onFocus={() => analytics.trackFieldFocus('company')}
              onBlur={(e) => analytics.trackFieldBlur('company', e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="project_type" className={cn("block font-medium text-white mb-2", isFixed ? "text-sm" : "text-sm")}>
              Project Type *
            </label>
            <select
              {...register('project_type')}
              id="project_type"
              className={cn(
                'w-full rounded-xl bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors appearance-none bg-no-repeat bg-right',
                isFixed ? 'px-4 py-3 text-base pr-10' : 'px-3 py-2 pr-8',
                errors.project_type && 'focus:ring-red-500'
              )}
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.5em 1.5em'
              }}
              onFocus={() => analytics.trackFieldFocus('project_type')}
              onBlur={(e) => analytics.trackFieldBlur('project_type', e.target.value)}
            >
              <option value="">Select project type</option>
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.project_type && (
              <div className={cn("mt-2 flex items-center space-x-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg", isFixed ? "text-xs" : "text-sm")}>
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <p className="text-red-300 font-medium">{errors.project_type.message}</p>
              </div>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className={cn("block font-medium text-white mb-2", isFixed ? "text-sm" : "text-sm")}>
            <MessageSquare className="inline h-4 w-4 mr-1" />
            Message *
          </label>
          <textarea
            {...register('message')}
            id="message"
            rows={1}
            maxLength={1000}
            className={cn(
              'w-full rounded-xl bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors resize-none',
              isFixed ? 'px-4 py-3 text-base' : 'px-3 py-2',
              errors.message && 'focus:ring-red-500'
            )}
            placeholder="Tell me about your project..."
            onChange={(e) => setCharCount(e.target.value.length)}
          />
          <div className="mt-2">
            {errors.message && (
              <div className={cn("flex items-center space-x-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg", isFixed ? "text-xs" : "text-sm")}>
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <p className="text-red-300 font-medium">{errors.message.message}</p>
              </div>
            )}
          </div>
        </div>



        {/* Submit Button */}
        {!isFixed && (
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'inline-flex items-center bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none',
                'px-6 py-2',
                isSubmitting && 'animate-pulse'
              )}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full border-b-2 border-white mr-2 h-4 w-4" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
