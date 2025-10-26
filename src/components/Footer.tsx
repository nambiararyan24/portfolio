'use client';

import Link from 'next/link';
import { Linkedin, Mail } from 'lucide-react';

const socialLinks = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/aryannambiar15/', icon: Linkedin },
];

export default function Footer() {
  return (
    <footer className="bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brand */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground">Portfolio</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Freelance web developer creating modern, responsive websites and web applications.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-1">
              <li>
                <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors text-xs">
                  About
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-muted-foreground hover:text-foreground transition-colors text-xs">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#projects" className="text-muted-foreground hover:text-foreground transition-colors text-xs">
                  Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Resume */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex space-x-2">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                    aria-label={link.name}
                  >
                    <Icon size={16} />
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">aryanfuturenambiar@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Portfolio. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Built with Next.js & Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
