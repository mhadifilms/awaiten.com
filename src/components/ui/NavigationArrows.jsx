import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const NavigationArrows = ({ 
  onPrevious, 
  onNext,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  className = ''
}) => {
  return (
    <>
      <button
        onClick={onPrevious}
        className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 md:-translate-x-16 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm items-center justify-center transition-colors ${className}`}
        aria-label={previousLabel}
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={onNext}
        className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 md:translate-x-16 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm items-center justify-center transition-colors ${className}`}
        aria-label={nextLabel}
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </>
  );
};

export default NavigationArrows;

