'use client';

import { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AdminSetup() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Admin Configuration
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password123

# Email Configuration (Optional)
RESEND_API_KEY=your_resend_api_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# reCAPTCHA Configuration (Optional)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key`;

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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Setup Required</h1>
          <p className="text-slate-300 text-lg">Configure your environment variables to access the admin dashboard</p>
        </div>

        {/* Setup Steps */}
        <div className="space-y-8">
          {/* Step 1: Supabase Setup */}
          <div className="bg-slate-900 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-600/20 p-2 rounded-lg">
                <AlertCircle className="h-6 w-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Step 1: Set up Supabase</h2>
            </div>
            <p className="text-slate-300 mb-4">
              Create a Supabase project and get your API credentials:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
              <li>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 inline-flex items-center">
                Supabase Dashboard <ExternalLink className="h-4 w-4 ml-1" />
              </a></li>
              <li>Create a new project</li>
              <li>Go to Settings → API</li>
              <li>Copy your Project URL and anon public key</li>
            </ol>
            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-slate-400 text-sm mb-2">Required Supabase tables will be created automatically when you first access the admin dashboard.</p>
            </div>
          </div>

          {/* Step 2: Environment Variables */}
          <div className="bg-slate-900 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-emerald-600/20 p-2 rounded-lg">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Step 2: Create Environment File</h2>
            </div>
            <p className="text-slate-300 mb-4">
              Create a <code className="bg-slate-800 px-2 py-1 rounded text-emerald-400">.env.local</code> file in your project root:
            </p>
            
            <div className="bg-slate-800 rounded-xl p-4 relative">
              <button
                onClick={() => copyToClipboard(envContent, 'env')}
                className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                {copied === 'env' ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
              <pre className="text-sm text-slate-300 overflow-x-auto">
                <code>{envContent}</code>
              </pre>
            </div>
          </div>

          {/* Step 3: Restart Server */}
          <div className="bg-slate-900 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-orange-600/20 p-2 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Step 3: Restart Development Server</h2>
            </div>
            <p className="text-slate-300 mb-4">
              After creating the <code className="bg-slate-800 px-2 py-1 rounded text-emerald-400">.env.local</code> file:
            </p>
            <div className="bg-slate-800 rounded-xl p-4">
              <code className="text-emerald-400">npm run dev</code>
            </div>
          </div>

          {/* Step 4: Access Admin */}
          <div className="bg-slate-900 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-purple-600/20 p-2 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Step 4: Access Admin Dashboard</h2>
            </div>
            <p className="text-slate-300 mb-4">
              Once configured, you can access the admin dashboard:
            </p>
            <div className="space-y-2">
              <div className="bg-slate-800 rounded-xl p-4">
                <code className="text-emerald-400">http://localhost:3000/admin</code>
              </div>
              <p className="text-slate-400 text-sm">
                Demo credentials: <code className="bg-slate-700 px-2 py-1 rounded">admin@example.com</code> / <code className="bg-slate-700 px-2 py-1 rounded">password123</code>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Start Button */}
        <div className="mt-8 text-center">
          <div className="bg-slate-800 rounded-xl p-4 mb-4">
            <p className="text-slate-300 text-sm">
              <strong>Note:</strong> The admin dashboard requires Supabase configuration to function properly. 
              The setup page will guide you through the process.
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Try Admin Dashboard (Demo Mode)
            <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
          </Link>
        </div>
      </main>
    </div>
  );
}