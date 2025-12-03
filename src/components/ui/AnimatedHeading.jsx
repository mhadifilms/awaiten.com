import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../constants/animations';

const AnimatedHeading = ({ 
  children, 
  level = 2, 
  className = '', 
  animation = fadeInUp,
  ...props 
}) => {
  const HeadingTag = `h${level}`;
  
  return (
    <motion.div
      initial={animation.initial}
      whileInView={animation.animate || animation}
      transition={animation.transition}
      viewport={{ once: true }}
      {...props}
    >
      <HeadingTag className={`text-4xl md:text-6xl font-bold text-center mb-12 md:mb-16 ${className}`}>
        {children}
      </HeadingTag>
    </motion.div>
  );
};

export default AnimatedHeading;

