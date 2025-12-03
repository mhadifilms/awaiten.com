import React from 'react';

const FormInput = ({ 
  type = 'text',
  id,
  placeholder,
  className = '',
  ...props 
}) => {
  const baseStyles = 'w-full px-4 py-3 rounded-2xl bg-gray-800/50 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors';
  
  if (type === 'textarea') {
    return (
      <textarea
        id={id}
        placeholder={placeholder}
        className={`${baseStyles} resize-none ${className}`}
        {...props}
      />
    );
  }

  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      className={`${baseStyles} ${className}`}
      {...props}
    />
  );
};

export default FormInput;

