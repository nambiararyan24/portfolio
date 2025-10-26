'use client';

import { Tool } from '@/types';
import { cn } from '@/lib/utils';

interface ToolsProps {
  tools: Tool[];
}

export default function Tools({ tools }: ToolsProps) {
  if (!tools || tools.length === 0) {
    return (
    <section id="tools" className="py-20">
      <div className="w-full px-4">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Tools & Technologies
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              No tools available yet. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="tools" className="py-16 bg-black">
      <div className="w-full px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Tools & Technologies
          </h2>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Technologies and tools I use to build modern web applications
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {tools.map((tool, index) => (
            <div
              key={tool.id}
              className="group flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-md"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <div className="w-10 h-10 flex items-center justify-center">
                {tool.logo_url ? (
                  <img
                    src={tool.logo_url}
                    alt={tool.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-900 rounded flex items-center justify-center">
                    <span className="text-sm text-blue-400 font-medium">
                      {tool.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <span className="text-xs font-medium text-gray-300 text-center group-hover:text-blue-400 transition-colors duration-300">
                {tool.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
