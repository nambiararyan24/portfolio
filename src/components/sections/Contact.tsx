'use client';

import EnhancedContactForm from '@/components/EnhancedContactForm';

export default function Contact() {
  return (
    <section id="contact" className="py-8 min-h-screen flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Let's Work Together
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Have a project in mind? I'd love to hear about it. Send me a message and I'll respond within 24 hours.
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-800">
            <EnhancedContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
