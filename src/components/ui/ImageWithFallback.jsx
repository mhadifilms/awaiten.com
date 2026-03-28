import React from 'react';
import { getAssetPath } from '../../utils/assets';

const ImageWithFallback = ({ 
  src, 
  alt, 
  className = '', 
  fallbackGradient = 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
  onError,
  ...props 
}) => {
  const handleError = (e) => {
    e.target.style.display = 'none';
    if (e.target.parentElement) {
      e.target.parentElement.style.background = fallbackGradient;
    }
    if (onError) {
      onError(e);
    }
  };

  const imgSrc = getAssetPath(src);

  return (
    <img 
      src={imgSrc} 
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback;

