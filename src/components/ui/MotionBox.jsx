import React from 'react';
import { motion } from 'framer-motion';
import * as animations from '../../constants/animations';

const MotionBox = ({
  children,
  variant = 'fadeInUp', // Default animation variant name
  delay = 0,
  duration,
  className = '',
  viewport = { once: true, margin: "-100px" },
  as = 'div',
  ...props
}) => {
  // Get the animation object from constants
  let baseAnimation = animations[variant];
  
  // Handle functional variants (like floating, staggerContainer)
  if (typeof baseAnimation === 'function') {
    baseAnimation = baseAnimation(delay);
  }

  // Fallback to fadeInUp if not found or if function returned null
  baseAnimation = baseAnimation || animations.fadeInUp;
  
  // Construct the animation props
  const animationProps = {
    initial: baseAnimation.initial,
    whileInView: baseAnimation.animate,
    viewport: viewport,
    transition: {
      ...baseAnimation.transition,
      ...(duration ? { duration } : {}),
      ...(delay ? { delay } : {}),
    },
    ...props
  };

  // Handle hover variants if requested
  if (variant.startsWith('hover')) {
    const MotionComponent = motion[as] || motion.div;
    return (
      <MotionComponent
        className={className}
        {...animations[variant]}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }

  // Determine the component to render
  // If 'as' is a string (HTML tag), use motion[as]
  // If 'as' is a component, use motion(as) - though motion() HOC is usually used outside render.
  // For simplicity, we'll stick to HTML tags supported by motion.*
  // If a custom component is needed, users might need to wrap it themselves or we use motion(Component) memoized.
  // Since 'as' is likely 'div', 'section', 'form', etc., motion[as] works.
  
  const MotionComponent = motion[as] || motion.div;

  return (
    <MotionComponent
      className={className}
      {...animationProps}
    >
      {children}
    </MotionComponent>
  );
};

export default MotionBox;
