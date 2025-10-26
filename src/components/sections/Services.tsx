'use client';

import { useState } from 'react';
import { Service } from '@/types';
import { cn } from '@/lib/utils';

interface ServicesProps {
  services: Service[];
}

export default function Services({ services }: ServicesProps) {
  const [filter, setFilter] = useState<'Product' | 'Skill'>('Product');

  if (!services || services.length === 0) {
    return (
    <section id="services" className="py-16 bg-slate-950">
      <div className="w-full px-4">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Services
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              No services available yet. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  const filteredServices = services.filter(service => service.type === filter);

  return (
    <section id="services" className="py-16 bg-slate-950">
      <div className="w-full px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Services
          </h2>
          <p className="text-slate-300 text-lg max-w-xl mx-auto mb-8">
            I offer a range of web development services to help bring your ideas to life
          </p>
          
          {/* Filter Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setFilter('Product')}
              className={cn(
                "px-4 py-2 text-sm rounded-xl font-medium transition-all duration-300",
                filter === 'Product'
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              )}
            >
              By Product
            </button>
            <button
              onClick={() => setFilter('Skill')}
              className={cn(
                "px-4 py-2 text-sm rounded-xl font-medium transition-all duration-300",
                filter === 'Skill'
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              )}
            >
              By Skill
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredServices.map((service, index) => (
            <div
              key={service.id}
              className="group bg-slate-900 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:bg-slate-800"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {service.icon_url && (
                <div className="w-full h-48 bg-slate-800 overflow-hidden">
                  <img
                    src={service.icon_url}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-emerald-400 transition-colors duration-300">
                  {service.title}
                </h3>

                <p className="text-slate-300 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
