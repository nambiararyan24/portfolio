'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Review } from '@/types';

interface ReviewsProps {
  reviews: Review[];
}

export default function Reviews({ reviews }: ReviewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (reviews.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  const goToPrevious = () => {
    if (isTransitioning || reviews.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToNext = () => {
    if (isTransitioning || reviews.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        )}
      />
    ));
  };

  return (
    <section id="reviews" className="py-16 bg-slate-950">
      <div className="w-full px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            What Clients Say
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Don't just take my word for it. Here's what my clients have to say about working with me.
          </p>
        </div>

        <div className="relative max-w-md mx-auto">
          {/* Carousel Container */}
          <div className="relative h-64 flex items-center justify-center">
            {/* Review Cards */}
            <div className="relative w-full h-full flex items-center justify-center">
              {reviews.map((review, index) => {
                const isActive = index === currentIndex;
                const isNext = index === (currentIndex + 1) % reviews.length;
                const isPrev = index === (currentIndex - 1 + reviews.length) % reviews.length;
                const isHidden = !isActive && !isNext && !isPrev;

                return (
                  <div
                    key={review.id}
                    className={cn(
                      "absolute inset-0 transition-all duration-500 ease-in-out transform flex items-center justify-center",
                      isActive && "z-30 scale-100 opacity-100 translate-x-0",
                      isNext && "z-20 scale-95 opacity-80 translate-x-8",
                      isPrev && "z-20 scale-95 opacity-80 -translate-x-8",
                      isHidden && "z-10 scale-90 opacity-0 translate-x-0",
                      isTransitioning && "transition-all duration-300"
                    )}
                  >
                     {/* Card */}
                     <div className="bg-slate-900 rounded-2xl shadow-xl p-6 w-96 h-full flex flex-col justify-center relative hover:bg-slate-800 transition-all duration-300">
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
                          {renderStars(review.rating)}
                        </div>
                      </div>

                      {/* Review Content */}
                      <blockquote className="text-base text-slate-300 text-left leading-relaxed">
                        "{review.content}"
                      </blockquote>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          {reviews.length > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={goToPrevious}
                disabled={isTransitioning}
                className={cn(
                  "inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                  "border border-slate-700 hover:border-slate-600 hover:bg-slate-700"
                )}
                aria-label="Previous review"
              >
                <ChevronLeft className="h-4 w-4 text-slate-300" />
              </button>

              {/* Dots Indicator */}
              <div className="flex space-x-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (isTransitioning) return;
                      setIsTransitioning(true);
                      setCurrentIndex(index);
                      setTimeout(() => setIsTransitioning(false), 300);
                    }}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all duration-300",
                      index === currentIndex
                        ? "bg-emerald-400 scale-125"
                        : "bg-slate-600 hover:bg-slate-500"
                    )}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={goToNext}
                disabled={isTransitioning}
                className={cn(
                  "inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                  "border border-slate-700 hover:border-slate-600 hover:bg-slate-700"
                )}
                aria-label="Next review"
              >
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
