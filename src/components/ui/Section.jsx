import React from 'react';
import Container from './Container';

const Section = ({ children, id, className = '', containerClass = '', padding = 'default' }) => {
  const paddingClass = padding === 'small' ? 'py-16 md:py-24' : 'py-20 md:py-32';
  
  return (
    <section id={id} className={`${paddingClass} ${className}`}>
      <Container className={containerClass}>
        {children}
      </Container>
    </section>
  );
};

export default Section;

