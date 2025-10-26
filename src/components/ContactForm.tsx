'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle, Linkedin, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createLead } from '@/lib/database';
import { ContactFormData } from '@/types';
import toast from 'react-hot-toast';
import EnhancedContactForm from './EnhancedContactForm';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please include an @ in the email address'),
  project_type: z.string().min(1, 'Please select a project type'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const projectTypes = [
  'Website Development',
  'Web Application',
  'E-commerce Store',
  'Portfolio Website',
  'Landing Page',
  'Other',
];

interface ContactFormProps {
  isFixed?: boolean;
}

export default function ContactForm({ isFixed = false }: ContactFormProps) {
  return (
    <div>
      <EnhancedContactForm isFixed={isFixed} />
      
      {/* Contact Info Section */}
      {isFixed && (
        <div className="mt-3 pt-2">
          <div className="flex justify-between items-center">
            {/* Connect with me - Left side */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">Connect with me</h3>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <Linkedin className="h-4 w-4 text-slate-400" />
                  <a href="https://www.linkedin.com/in/aryannambiar15/" target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-400 hover:text-emerald-300">LinkedIn</a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-300">aryanfuturenambiar@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Send Message Button - Right side */}
            <div>
              <button
                type="submit"
                form="contact-form-fixed"
                className="inline-flex items-center bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all duration-300 hover:scale-105 hover:shadow-lg px-6 py-3 text-base"
              >
                Send
                <Send className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
