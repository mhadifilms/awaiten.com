import React from 'react';

const PaginationDots = ({ 
  count, 
  currentIndex, 
  onDotClick,
  activeColor = 'bg-gray-400',
  inactiveColor = 'bg-gray-400/30 hover:bg-gray-400/60',
  className = ''
}) => {
  return (
    <div className={`flex justify-center gap-2 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`w-2 h-2 rounded-full transition-all ${
            index === currentIndex
              ? `${activeColor} w-8`
              : inactiveColor
          }`}
          aria-label={`Go to item ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default PaginationDots;

