'use client';

interface AboutProps {
  projectCount: number;
}

export default function About({ projectCount }: AboutProps) {
  return (
    <section id="about" className="about-section py-16 bg-slate-950">
      <div className="w-full px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              About Me
            </h2>
          </div>
          
          <div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl px-6 sm:px-12 lg:pl-12 lg:pr-20 py-8 shadow-2xl text-left">
              <div className="flex flex-col sm:flex-row items-center mb-8">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:mr-6 mb-4 sm:mb-0 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src="/images/aryan.png"
                    alt="Aryan Nambiar"
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=320&h=320';
                      e.currentTarget.onerror = null;
                    }}
                  />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Aryan Nambiar</h2>
                  <p className="text-emerald-400 text-base sm:text-lg font-medium mb-2">Freelance Web Developer</p>
                  <div className="inline-flex items-center px-3 py-1 bg-green-400/10 border border-green-400/20 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-green-400 text-sm font-medium">Available</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{projectCount}+</div>
                  <div className="text-slate-400 text-sm">Projects Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">1+</div>
                  <div className="text-slate-400 text-sm">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-slate-400 text-sm">On-Time Delivery</div>
                </div>
              </div>

              <div className="text-center">
                <a
                  href="https://wa.me/918010195878"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
                >
                  Contact Me
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}