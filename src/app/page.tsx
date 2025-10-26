import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import Projects from '@/components/sections/Projects';
import Reviews from '@/components/sections/Reviews';
import ContactForm from '@/components/ContactForm';
import { getServices, getProjects, getReviews } from '@/lib/database';

export default async function Home() {
  // Fetch data in parallel
  const [services, projects, reviews] = await Promise.all([
    getServices().catch(() => []),
    getProjects().catch(() => []),
    getReviews().catch(() => []),
  ]);


  return (
    <div className="min-h-screen flex lg:flex-row flex-col">
      {/* Main content area - full width on mobile, 50% on desktop */}
      <div className="w-full lg:w-1/2 lg:overflow-y-auto lg:h-screen">
        <main>
          <Hero />
          <About projectCount={projects.length} />
          <Services services={services} />
          <Projects projects={projects} />
          <Reviews reviews={reviews} />
          
          {/* Mobile contact form */}
          <div className="lg:hidden py-16 bg-slate-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
          </div>
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
