import React from 'react';
import MotionBox from './MotionBox';

const Card = ({ children, className = '', delay = 0, ...props }) => {
  return (
    <MotionBox
      variant="fadeInUp"
      delay={delay}
      className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors duration-300 ${className}`}
      {...props}
    >
      {children}
    </MotionBox>
  );
};

export default Card;
