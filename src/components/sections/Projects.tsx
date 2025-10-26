'use client';

import { Project } from '@/types';
import Link from 'next/link';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  console.log('Projects component received projects:', projects);
  console.log('Projects length:', projects?.length);
  
  if (!projects || projects.length === 0) {
    return (
    <section id="projects" className="py-16 bg-slate-950">
      <div className="w-full px-4">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              No projects available yet. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-16 bg-slate-950">
      <div className="w-full px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            A selection of projects I've worked on recently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            console.log(`Project ${index}:`, {
              id: project.id,
              title: project.title,
              slug: project.slug,
              hasSlug: !!project.slug,
              linkUrl: `/project/${project.slug}`
            });
            return (
              <div
                key={project.id}
                className="group bg-slate-800 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:bg-slate-700"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
              {/* Project Image */}
              <div className="relative overflow-hidden">
                {project.thumbnail_url ? (
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      console.error('Image failed to load:', project.thumbnail_url);
                      e.currentTarget.style.display = 'none';
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div className="w-full h-48 bg-slate-600 flex items-center justify-center" style={{ display: project.thumbnail_url ? 'none' : 'flex' }}>
                  <span className="text-slate-400 text-sm">No image</span>
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex space-x-2">
                    <a
                      href={`/project/${project.slug}`}
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-2xl text-sm hover:bg-emerald-700 transition-colors"
                      onClick={(e) => {
                        console.log('View Details clicked for project:', project.slug);
                        console.log('Navigating to:', `/project/${project.slug}`);
                        console.log('Link href:', e.currentTarget.href);
                        console.log('Project data:', project);
                      }}
                    >
                      View Details
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                    {project.external_link && (
                      <a
                        href={project.external_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-white text-black rounded-2xl text-sm hover:bg-gray-200 transition-colors"
                      >
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Live Site
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-emerald-400 transition-colors duration-300">
                  {project.title}
                </h3>
                
                <p className="text-slate-300 leading-relaxed mb-4">
                  {project.short_description}
                </p>
                
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
