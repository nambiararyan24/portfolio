'use client';

import { useState, useEffect } from 'react';
import { Circle, CircleDot, ChevronDown } from 'lucide-react';

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  
  const rotatingWords = ['website', 'web application', 'e-commerce store', 'portfolio website', 'landing page', 'mobile app', 'API'];

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Rotate words every 2.5 seconds
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);

    // Update time
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }));
    };
    
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    // Check online status
    const checkOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };
    
    checkOnlineStatus();
    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
      window.removeEventListener('online', checkOnlineStatus);
      window.removeEventListener('offline', checkOnlineStatus);
    };
  }, [rotatingWords.length]);

  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-black">
      {/* Status Bar */}
      <div className="absolute top-4 left-4 z-20">
        <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs text-white/80">
          <div className="flex items-center space-x-1">
            {isOnline ? (
              <CircleDot className="h-3 w-3 text-green-400" />
            ) : (
              <Circle className="h-3 w-3 text-red-400" />
            )}
            <span className={isOnline ? 'text-green-400' : 'text-red-400'}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className="w-px h-3 bg-white/20" />
          <span className="text-white/60 text-xs">
            {currentTime}
          </span>
        </div>
      </div>

      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-8">
          <div className="mb-6">Build Your</div>
          <div className="text-emerald-400 transition-all duration-500 ease-in-out mb-6">{rotatingWords[currentWordIndex]}</div>
          <div>With Me</div>
        </h1>
        
        {/* Down Arrow Button */}
        <button
          onClick={scrollToAbout}
          className="mt-8 p-3 rounded-full bg-emerald-600 hover:bg-emerald-700 backdrop-blur-sm border border-emerald-500/50 transition-all duration-300 hover:scale-110 group"
          aria-label="Scroll to About section"
        >
          <ChevronDown className="h-6 w-6 text-white transition-colors duration-300" />
        </button>
      </div>
    </section>
  );
}