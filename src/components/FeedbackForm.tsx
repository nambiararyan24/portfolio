'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, Star, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const API_ROUTE = '/api/submit-feedback';

const feedbackSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().min(1, 'Company name is required'),
  rating: z.number().min(1, 'Please select a rating').max(5),
  content: z.string().min(10, 'Feedback must be at least 10 characters'),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

const MAX_STEPS = 4;

export default function FeedbackForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    watch,
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    mode: 'onChange',
    defaultValues: {
      rating: 0,
    },
  });

  const watchedContent = watch('content', '');

  const validateStep = async () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = await trigger(['name', 'company']);
        break;
      case 2:
        isValid = await trigger(['rating']);
        break;
      case 3:
        isValid = await trigger(['content']);
        break;
    }

    return isValid;
  };

  const handleNext = async () => {
    // For step 2, check if rating is selected
    if (currentStep === 2 && selectedRating === 0) {
      toast.error('Please select a rating before continuing');
      return;
    }
    
    const isValid = await validateStep();
    if (isValid && currentStep < MAX_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(API_ROUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          company: data.company,
          rating: data.rating,
          content: data.content,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit feedback');
      }

      setIsSubmitted(true);
      setCurrentStep(MAX_STEPS);
      toast.success('Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    setValue('rating', rating);
    trigger('rating');
  };

  if (isSubmitted && currentStep === MAX_STEPS) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <CheckCircle2 className="h-20 w-20 mx-auto text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-white">Thank You!</h1>
          <p className="text-slate-300 mb-8">
            Your feedback has been submitted successfully. We appreciate you taking the time to share your experience with us.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-4xl">
        {/* Page Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-1 text-white">Client Feedback Form</h1>
          <p className="text-slate-300 text-sm">
            We value your opinion. Share your experience with us.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium text-slate-300">
              Step {currentStep} of {MAX_STEPS}
            </span>
            <span className="text-xs text-slate-400">
              {Math.round((currentStep / MAX_STEPS) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / MAX_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Client Details */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-slide-up">
                <div>
                  <h2 className="text-xl font-bold mb-1 text-white">Your Details</h2>
                  <p className="text-slate-400 text-sm">
                    Please provide your name and company
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium mb-1 text-slate-300">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      {...register('name')}
                      id="name"
                      type="text"
                      className={cn(
                        'w-full px-3 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors',
                        errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-emerald-500 focus:ring-emerald-500'
                      )}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-xs font-medium mb-1 text-slate-300">
                      Company Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      {...register('company')}
                      id="company"
                      type="text"
                      className={cn(
                        'w-full px-3 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors',
                        errors.company ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-emerald-500 focus:ring-emerald-500'
                      )}
                      placeholder="Acme Corporation"
                    />
                    {errors.company && (
                      <p className="text-xs text-red-400 mt-1">{errors.company.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Rating */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-slide-up">
                <div>
                  <h2 className="text-xl font-bold mb-1 text-white">Rate Your Experience</h2>
                  <p className="text-slate-400 text-sm">
                    How would you rate your experience working with us?
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => handleRatingClick(rating)}
                        onMouseEnter={() => setHoveredRating(rating)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={cn(
                            'h-10 w-10 transition-colors',
                            (hoveredRating >= rating || selectedRating >= rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600'
                          )}
                        />
                      </button>
                    ))}
                  </div>

                  {errors.rating && (
                    <p className="text-xs text-red-400 text-center">{errors.rating.message}</p>
                  )}

                  {selectedRating > 0 && (
                    <p className="text-center text-slate-300 text-sm">
                      {selectedRating === 1 && 'Poor'}
                      {selectedRating === 2 && 'Fair'}
                      {selectedRating === 3 && 'Good'}
                      {selectedRating === 4 && 'Very Good'}
                      {selectedRating === 5 && 'Excellent'}
                    </p>
                  )}
                </div>

                <input {...register('rating', { required: true })} type="hidden" />
              </div>
            )}

            {/* Step 3: Feedback */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-slide-up">
                <div>
                  <h2 className="text-xl font-bold mb-1 text-white">Share Your Feedback</h2>
                  <p className="text-slate-400 text-sm">
                    Tell us about your experience in detail
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="content" className="block text-xs font-medium mb-1 text-slate-300">
                      Your Feedback <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      {...register('content')}
                      id="content"
                      rows={6}
                      className={cn(
                        'w-full px-3 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors resize-none',
                        errors.content ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-emerald-500 focus:ring-emerald-500'
                      )}
                      placeholder="Share your experience, what went well, what could be improved..."
                    />
                    {errors.content && (
                      <p className="text-xs text-red-400 mt-1">{errors.content.message}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      {watchedContent.length} characters
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6 pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={cn(
                  'px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                  currentStep === 1
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                )}
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>

              {currentStep < MAX_STEPS - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

