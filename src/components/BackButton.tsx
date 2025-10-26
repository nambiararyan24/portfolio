'use client';

import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const handleBackClick = () => {
    window.location.href = '/#projects';
  };

  return (
    <button
      onClick={handleBackClick}
      className="inline-flex items-center text-slate-300 hover:text-white transition-colors"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Projects
    </button>
  );
}


