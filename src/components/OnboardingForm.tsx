'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const API_ROUTE = '/api/submit-onboarding';

const FEATURES_OPTIONS = [
  'CMS (Editable Pages)',
  'E-Commerce Setup',
  'Forms / Booking',
  'API Integrations',
  'SEO Setup',
  'Payment Integration',
  'User Authentication',
  'Blog / News Section',
  'Portfolio Gallery',
  'Social Media Integration',
];

const onboardingSchema = z.object({
  // Step 1: Client Information
  client_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(1, 'Company name is required'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  
  // Step 2: Project Information
  project_type: z.string().min(1, 'Project type is required'),
  existing_website: z.string().refine(
    (val) => !val || val === '' || z.string().url().safeParse(val).success,
    { message: 'Please enter a valid URL' }
  ).optional(),
  budget_range: z.string().min(1, 'Budget range is required'),
  timeline: z.string().min(1, 'Timeline is required'),
  preferred_contact: z.string().min(1, 'Preferred contact method is required'),
  features_needed: z.array(z.string()).default([]),
  
  // Step 3: Project Details
  project_description: z.string().min(10, 'Please describe your project'),
  project_goals: z.string().min(1, 'Please select a goal'),
  target_audience: z.string().min(5, 'Please describe your target audience'),
  design_style: z.string().optional(),
  inspiration_links: z.string().optional(),
  design_avoid: z.string().optional(),
  
  // Step 4: Additional Information
  how_hear: z.string().optional(),
  additional_info: z.string().optional(),
  newsletter_signup: z.boolean().default(false),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

const MAX_STEPS = 5;

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    watch,
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onChange',
    defaultValues: {
      newsletter_signup: false,
    },
  });

  const validateStep = async () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = await trigger(['client_name', 'email', 'company', 'phone']);
        break;
      case 2:
        isValid = await trigger(['project_type', 'budget_range', 'timeline', 'preferred_contact']);
        setValue('features_needed', selectedFeatures);
        break;
      case 3:
        isValid = await trigger(['project_description', 'project_goals', 'target_audience']);
        break;
      case 4:
        // Step 4 is optional, always allow to proceed
        isValid = true;
        break;
    }

    return isValid;
  };

  const handleNext = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
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

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(API_ROUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          features_needed: selectedFeatures,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit onboarding form');
      }

      setIsSubmitted(true);
      setCurrentStep(MAX_STEPS);
      toast.success('Thank you! We will get back to you soon.');
    } catch (error) {
      console.error('Error submitting onboarding:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted && currentStep === MAX_STEPS) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <CheckCircle2 className="h-20 w-20 mx-auto text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-white">You're all set!</h1>
          <p className="text-slate-300 mb-8">
            I'll review your submission and get back to you within 24 hours with a quote or proposal. Excited to start building your vision.
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
          <h1 className="text-2xl font-bold mb-1 text-white">Let's build your vision</h1>
          <p className="text-slate-300 text-sm">
            A few quick questions so I can understand your goals and deliver the perfect build
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
          <form onSubmit={currentStep === MAX_STEPS - 1 ? handleSubmit(onSubmit) : (e) => { e.preventDefault(); }} id="onboarding-form">
            {/* Step 1: Client Information */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-slide-up">
                <div>
                  <h2 className="text-xl font-bold mb-1 text-white">Basic Info</h2>
                  <p className="text-slate-400 text-sm">
                    Let's start with how I can reach you
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="client_name" className="block text-xs font-medium mb-1 text-slate-300">
                        Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        {...register('client_name')}
                        id="client_name"
                        type="text"
                        className={cn(
                          'w-full px-3 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors text-sm',
                          errors.client_name ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-emerald-500 focus:ring-emerald-500'
                        )}
                        placeholder="John Doe"
                      />
                      {errors.client_name && (
                        <p className="text-xs text-red-400 mt-1">{errors.client_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-medium mb-1 text-slate-300">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        {...register('email')}
                        id="email"
                        type="email"
                        className={cn(
                          'w-full px-3 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors text-sm',
                          errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-emerald-500 focus:ring-emerald-500'
                        )}
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="company" className="block text-xs font-medium mb-1 text-slate-300">
                        Company (if applicable) <span className="text-red-400">*</span>
                      </label>
                      <input
                        {...register('company')}
                        id="company"
                        type="text"
                        className={cn(
                          'w-full px-3 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors text-sm',
                          errors.company ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-emerald-500 focus:ring-emerald-500'
                        )}
                        placeholder="Acme Corporation"
                      />
                      {errors.company && (
                        <p className="text-xs text-red-400 mt-1">{errors.company.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-xs font-medium mb-1 text-slate-300">
                        Phone Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        {...register('phone')}
                        id="phone"
                        type="tel"
                        className={cn(
                          'w-full px-3 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors text-sm',
                          errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-emerald-500 focus:ring-emerald-500'
                        )}
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Project Information */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-slide-up">
                <div>
                  <h2 className="text-xl font-bold mb-1 text-white">What are we building?</h2>
                  <p className="text-slate-400 text-sm">
                    Tell me about your project and what you want to achieve
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="project_type" className="block text-xs font-medium mb-1 text-slate-300">
                      Project Type <span className="text-red-400">*</span>
                    </label>
                    <select
                      {...register('project_type')}
                      id="project_type"
                      className={cn(
                        'w-full px-3 py-2 bg-slate-900 border rounded-lg text-white text-sm focus:outline-none focus:ring-2 transition-colors',
                        errors.project_type ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-emerald-500 focus:ring-emerald-500'
                      )}
                    >
                      <option value="">What type of project? *</option>
                      <option value="website">New Website</option>
                      <option value="website-redesign">Website Redesign</option>
                      <option value="landing-page">Landing Page</option>
                      <option value="ecommerce">E-Commerce Store</option>
                      <option value="web-app">Web App / Dashboard</option>
                      <option value="other">Something else</option>
                    </select>
                    {errors.project_type && (
                      <p className="text-xs text-red-400 mt-1">{errors.project_type.message}</p>
                    )}
                  </div>

                  {/* Existing Website Field */}
                  <div>
                    <label htmlFor="existing_website" className="block text-xs font-medium mb-1 text-slate-300">
                      Current Website (if any)
                      <span className="text-slate-500 ml-1 font-normal">(optional)</span>
                    </label>
                    <input
                      {...register('existing_website')}
                      id="existing_website"
                      type="url"
                      className={cn(
                        'w-full px-3 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors text-sm',
                        errors.existing_website ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-emerald-500 focus:ring-emerald-500'
                      )}
                      placeholder="https://yourwebsite.com"
                    />
                    {errors.existing_website && (
                      <p className="text-xs text-red-400 mt-1">{errors.existing_website.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="budget_range" className="block text-xs font-medium mb-1 text-slate-300">
                        Budget Range <span className="text-red-400">*</span>
                      </label>
                      <select
                        {...register('budget_range')}
                        id="budget_range"
                        className={cn(
                          'w-full px-3 py-2 bg-slate-900 border rounded-lg text-white text-sm focus:outline-none focus:ring-2 transition-colors',
                          errors.budget_range ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-emerald-500 focus:ring-emerald-500'
                        )}
                      >
                      <option value="">Select budget range</option>
                      <option value="under-5k">Under $5,000</option>
                      <option value="5k-15k">$5,000 - $15,000</option>
                      <option value="15k-30k">$15,000 - $30,000</option>
                      <option value="30k-plus">$30,000+</option>
                      <option value="discuss">Let's discuss</option>
                      </select>
                      {errors.budget_range && (
                        <p className="text-xs text-red-400 mt-1">{errors.budget_range.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="timeline" className="block text-xs font-medium mb-1 text-slate-300">
                        Timeline <span className="text-red-400">*</span>
                      </label>
                      <select
                        {...register('timeline')}
                        id="timeline"
                        className={cn(
                          'w-full px-3 py-2 bg-slate-900 border rounded-lg text-white text-sm focus:outline-none focus:ring-2 transition-colors',
                          errors.timeline ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-emerald-500 focus:ring-emerald-500'
                        )}
                      >
                      <option value="">When do you need this?</option>
                      <option value="asap">ASAP / Urgent</option>
                      <option value="1-month">Within a month</option>
                      <option value="2-3-months">2-3 months</option>
                      <option value="flexible">I'm flexible</option>
                      <option value="planning">Still in planning</option>
                      </select>
                      {errors.timeline && (
                        <p className="text-xs text-red-400 mt-1">{errors.timeline.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-2 text-slate-300">
                      Preferred Contact Method <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['email', 'phone', 'either'].map((method) => (
                        <label
                          key={method}
                          className={cn(
                            "flex items-center justify-center p-2 border rounded-lg cursor-pointer transition-colors text-sm",
                            watch('preferred_contact') === method
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'bg-slate-900 border-slate-600 text-slate-300 hover:border-slate-500'
                          )}
                        >
                          <input
                            {...register('preferred_contact')}
                            type="radio"
                            value={method}
                            className="sr-only"
                          />
                          <span className="capitalize">{method}</span>
                        </label>
                      ))}
                    </div>
                    {errors.preferred_contact && (
                      <p className="text-xs text-red-400 mt-1">{errors.preferred_contact.message}</p>
                    )}
                  </div>

                  {/* Features Needed */}
                  <div>
                    <label className="block text-xs font-medium mb-2 text-slate-300">
                      Features Needed
                      <span className="text-slate-500 ml-1 font-normal">(select all that apply)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {FEATURES_OPTIONS.map((feature) => (
                        <label
                          key={feature}
                          className={cn(
                            'flex items-center p-2 border rounded-lg cursor-pointer transition-colors text-xs',
                            selectedFeatures.includes(feature)
                              ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                              : 'bg-slate-900 border-slate-600 text-slate-300 hover:border-slate-500'
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={selectedFeatures.includes(feature)}
                            onChange={() => toggleFeature(feature)}
                            className="mr-2 w-3 h-3 bg-slate-800 border-slate-600 rounded"
                          />
                          {feature}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Project Details */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-slide-up">
                <div>
                  <h2 className="text-xl font-bold mb-1 text-white">Project Vision</h2>
                  <p className="text-slate-400 text-sm">
                    Help me understand what you're trying to achieve
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="project_description" className="block text-xs font-medium mb-1 text-slate-300">
                      Describe your project <span className="text-red-400">*</span>
                      <span className="text-slate-500 ml-1 font-normal">(in 1-2 sentences)</span>
                    </label>
                    <textarea
                      {...register('project_description')}
                      id="project_description"
                      rows={3}
                      className={cn(
                        'w-full px-3 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors resize-none text-sm',
                        errors.project_description ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-emerald-500 focus:ring-emerald-500'
                      )}
                      placeholder="Example: A modern e-commerce site for handmade clothing..."
                    />
                    {errors.project_description && (
                      <p className="text-xs text-red-400 mt-1">{errors.project_description.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="project_goals" className="block text-xs font-medium mb-1 text-slate-300">
                      What's the main goal? <span className="text-red-400">*</span>
                    </label>
                    <select
                      {...register('project_goals')}
                      id="project_goals"
                      className={cn(
                        'w-full px-3 py-2 bg-slate-900 border rounded-lg text-white text-sm focus:outline-none focus:ring-2 transition-colors',
                        errors.project_goals ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-emerald-500 focus:ring-emerald-500'
                      )}
                    >
                      <option value="">Select a primary goal</option>
                      <option value="get-more-sales">Get more sales</option>
                      <option value="show-portfolio">Show my portfolio/work</option>
                      <option value="build-brand">Build brand presence</option>
                      <option value="generate-leads">Generate leads</option>
                      <option value="other">Something else</option>
                    </select>
                    {errors.project_goals && (
                      <p className="text-xs text-red-400 mt-1">{errors.project_goals.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="target_audience" className="block text-xs font-medium mb-1 text-slate-300">
                      Who is this for? <span className="text-red-400">*</span>
                      <span className="text-slate-500 ml-1 font-normal">(your ideal visitor)</span>
                    </label>
                    <textarea
                      {...register('target_audience')}
                      id="target_audience"
                      rows={2}
                      className={cn(
                        'w-full px-3 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors resize-none text-sm',
                        errors.target_audience ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-emerald-500 focus:ring-emerald-500'
                      )}
                      placeholder="Example: Local business owners aged 30-50 looking for marketing solutions"
                    />
                    {errors.target_audience && (
                      <p className="text-xs text-red-400 mt-1">{errors.target_audience.message}</p>
                    )}
                  </div>

                  {/* Design Style */}
                  <div>
                    <label htmlFor="design_style" className="block text-xs font-medium mb-1 text-slate-300">
                      Design Style Preference
                      <span className="text-slate-500 ml-1 font-normal">(optional)</span>
                    </label>
                    <select
                      {...register('design_style')}
                      id="design_style"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                    >
                      <option value="">Select design style (optional)</option>
                      <option value="minimal">Minimal & Clean</option>
                      <option value="bold">Bold & Modern</option>
                      <option value="corporate">Corporate & Professional</option>
                      <option value="creative">Creative & Unique</option>
                      <option value="classic">Classic & Traditional</option>
                      <option value="no-preference">No particular preference</option>
                    </select>
                  </div>

                  {/* Inspiration Links */}
                  <div>
                    <label htmlFor="inspiration_links" className="block text-xs font-medium mb-1 text-slate-300">
                      Design Inspiration
                      <span className="text-slate-500 ml-1 font-normal">(websites you love, optional)</span>
                    </label>
                    <textarea
                      {...register('inspiration_links')}
                      id="inspiration_links"
                      rows={2}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500 transition-colors resize-none text-sm"
                      placeholder="Paste 2-3 website links you love the look of..."
                    />
                  </div>

                  {/* Design Elements to Avoid */}
                  <div>
                    <label htmlFor="design_avoid" className="block text-xs font-medium mb-1 text-slate-300">
                      Design Elements to Avoid
                      <span className="text-slate-500 ml-1 font-normal">(optional)</span>
                    </label>
                    <textarea
                      {...register('design_avoid')}
                      id="design_avoid"
                      rows={2}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500 transition-colors resize-none text-sm"
                      placeholder="Any colors, styles, or elements you want to avoid..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Additional Information */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-slide-up">
                <div>
                  <h2 className="text-xl font-bold mb-1 text-white">Almost done</h2>
                  <p className="text-slate-400 text-sm">
                    Just a couple more quick details to help me serve you better
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="how_hear" className="block text-xs font-medium mb-1 text-slate-300">
                      How did you hear about us?
                    </label>
                    <select
                      {...register('how_hear')}
                      id="how_hear"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                    >
                      <option value="">Select an option</option>
                      <option value="google">Google Search</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="referral">Referral</option>
                      <option value="portfolio">Portfolio/GitHub</option>
                      <option value="social-media">Social Media</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="additional_info" className="block text-xs font-medium mb-1 text-slate-300">
                      Additional Information
                    </label>
                    <textarea
                      {...register('additional_info')}
                      id="additional_info"
                      rows={4}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500 transition-colors resize-none text-sm"
                      placeholder="Any other information you'd like to share..."
                    />
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
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNext(e);
                  }}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  form="onboarding-form"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Onboarding'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

