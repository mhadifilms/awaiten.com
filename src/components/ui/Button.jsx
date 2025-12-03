import React from 'react';
import { motion } from 'framer-motion';
import { hoverScale } from '../../constants/animations';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-full font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background";
  
  const styleVariants = {
    primary: "bg-white text-background hover:bg-gray-100 focus:ring-white",
    outline: "border-2 border-white text-white hover:bg-white/10 focus:ring-white",
    ghost: "text-white hover:bg-white/10",
  };

  return (
    <motion.button 
      className={`${baseStyles} ${styleVariants[variant]} ${className}`}
      {...hoverScale}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
