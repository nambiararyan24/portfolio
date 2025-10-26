import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar, Clock, Star } from 'lucide-react';
import { getProjectBySlug, getProjects, getReviewsByProjectId } from '@/lib/database';
import { formatDate } from '@/lib/utils';
import ContactForm from '@/components/ContactForm';
import BackButton from '@/components/BackButton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Dynamic route - no static generation needed

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} - Portfolio`,
    description: project.short_description,
    openGraph: {
      title: project.title,
      description: project.short_description,
      images: project.thumbnail_url ? [project.thumbnail_url] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  console.log('=== PROJECT PAGE LOADED ===');
  console.log('Looking for project with slug:', slug);
  console.log('Slug type:', typeof slug);
  console.log('Slug length:', slug?.length);
  
  const project = await getProjectBySlug(slug);
  console.log('Found project:', project);
  console.log('Project exists:', !!project);

  if (!project) {
    console.log('Project not found, showing 404');
    notFound();
  }

  // Fetch reviews for this specific project
  const projectReviews = await getReviewsByProjectId(project.id);
  console.log('Found project reviews:', projectReviews);

  return (
    <div className="min-h-screen flex lg:flex-row flex-col">
      {/* Main content area - full width on mobile, 50% on desktop */}
      <div className="w-full lg:w-1/2 lg:overflow-y-auto lg:h-screen">
        <main>
          {/* Back Button */}
          <div className="pt-8 pb-4 bg-slate-950">
            <div className="w-full px-4">
              <BackButton />
            </div>
          </div>

          {/* Project Hero Section */}
          <section className="py-8 bg-slate-950">
            <div className="w-full px-4">
              <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                  {project.title}
                </h1>
                
                <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
                  {project.short_description}
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                  {project.type && (
                    <div className="flex items-center text-sm text-slate-400">
                      <span className="px-2 py-1 bg-slate-800 rounded-lg text-xs">
                        {project.type}
                      </span>
                    </div>
                  )}
                  {project.status && (
                    <div className="flex items-center text-sm text-slate-400">
                      <span className={`px-2 py-1 rounded-lg text-xs ${
                        project.status === 'Completed' ? 'bg-emerald-900 text-emerald-300' :
                        project.status === 'In Progress' ? 'bg-blue-900 text-blue-300' :
                        project.status === 'On Hold' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  )}
                </div>

                {project.external_link && (
                  <a
                    href={project.external_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                  >
                    View Live Site
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </section>

          {/* Project Image */}
          <section className="py-8 bg-slate-950">
            <div className="w-full px-4">
              <div className="max-w-2xl mx-auto">
                {project.thumbnail_url ? (
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="w-full h-80 object-cover rounded-2xl shadow-xl"
                  />
                ) : (
                  <div className="w-full h-80 bg-slate-800 rounded-2xl flex items-center justify-center">
                    <span className="text-slate-400">No image available</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Project Details */}
          <section className="py-8 bg-slate-950">
            <div className="w-full px-4">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6">Project Overview</h2>
                
                <div className="max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => <h1 className="text-3xl font-bold text-white mb-4 mt-6">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-2xl font-bold text-white mb-3 mt-5">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-xl font-bold text-white mb-2 mt-4">{children}</h3>,
                      h4: ({ children }) => <h4 className="text-lg font-bold text-white mb-2 mt-3">{children}</h4>,
                      p: ({ children }) => <p className="text-slate-300 mb-4 leading-relaxed">{children}</p>,
                      strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                      em: ({ children }) => <em className="italic text-slate-300">{children}</em>,
                      ul: ({ children }) => <ul className="list-disc list-inside text-slate-300 mb-4 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside text-slate-300 mb-4 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-slate-300">{children}</li>,
                      code: ({ children }) => <code className="bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded font-mono text-sm">{children}</code>,
                      pre: ({ children }) => <pre className="bg-slate-800 text-slate-300 p-4 rounded-lg mb-4 overflow-x-auto">{children}</pre>,
                      a: ({ href, children }) => <a href={href} className="text-emerald-400 hover:text-emerald-300 underline">{children}</a>,
                      hr: () => <hr className="border-slate-700 my-6" />,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-slate-400 mb-4">{children}</blockquote>,
                      img: ({ src, alt }) => (
                        <div className="my-4">
                          <img 
                            src={src} 
                            alt={alt} 
                            className="max-w-full h-auto rounded-xl shadow-lg border border-slate-700"
                          />
                        </div>
                      ),
                    }}
                  >
                    {project.case_study_content || '*No case study content available.*'}
                  </ReactMarkdown>
                </div>

                {/* Tools Used */}
                {project.tools_used && project.tools_used.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Tools Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tools_used.map((tool, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-lg"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </section>

          {/* Project Reviews Section */}
          {projectReviews.length > 0 && (
            <section className="py-8 bg-slate-950">
              <div className="w-full px-4">
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-2xl font-bold text-white mb-6">Client Reviews</h2>
                  
                  <div className="space-y-6">
                    {projectReviews.map((review) => (
                      <div key={review.id} className="bg-slate-900 rounded-2xl shadow-xl p-6 w-full hover:bg-slate-800 transition-all duration-300">
                        {/* Client Info */}
                        <div className="text-left mb-4">
                          <div className="font-semibold text-white text-lg">
                            {review.name}
                          </div>
                          <div className="text-slate-400 text-sm">
                            {review.company}
                          </div>
                        </div>

                        {/* Rating Stars */}
                        <div className="flex items-center justify-start mb-4">
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Review Content */}
                        <blockquote className="text-base text-slate-300 text-left leading-relaxed">
                          "{review.content}"
                        </blockquote>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Mobile Contact Form */}
          <section className="lg:hidden py-16 bg-slate-900">
            <div className="w-full px-4">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                    Let's Work Together
                  </h2>
                  <p className="text-slate-300 text-lg">
                    Have a project in mind? I'd love to hear about it. Send me a message and I'll respond within 24 hours.
                  </p>
                </div>
                <ContactForm />
              </div>
            </div>
          </section>
        </main>
      </div>
      
      {/* Fixed contact form - hidden on mobile, visible on desktop */}
      <div className="hidden lg:block lg:w-1/2 lg:fixed lg:right-0 lg:top-0 lg:h-full bg-slate-900 lg:overflow-y-auto">
        <div className="h-full flex flex-col">
          <div className="flex-1 flex flex-col justify-start p-8">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">
                Let's Work Together
              </h2>
              <p className="text-slate-300 text-lg">
                Have a project in mind? I'd love to hear about it. Send me a message and I'll respond within 24 hours.
              </p>
            </div>
            
            <ContactForm isFixed={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
