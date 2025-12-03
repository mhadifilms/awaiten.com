import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../constants/animations';

const AnimatedHeading = ({ 
  children, 
  level = 2, 
  className = '', 
  animation = fadeInUp,
  viewport = { once: true, margin: "-100px" },
  ...props 
}) => {
  const HeadingTag = `h${level}`;
  
  return (
    <motion.div
      initial={animation.initial}
      whileInView={animation.animate || animation}
      transition={animation.transition}
      viewport={viewport}
      {...props}
    >
      <HeadingTag className={`h2 text-center mb-12 md:mb-16 ${className}`}>
        {children}
      </HeadingTag>
    </motion.div>
  );
};

export default AnimatedHeading;

