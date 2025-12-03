import React from 'react';
import Section from '../components/ui/Section';
import MotionBox from '../components/ui/MotionBox';

const Contact = () => {
  return (
    <Section id="contact" className="relative overflow-hidden py-32 px-4 md:px-0">
      <div className="max-w-3xl mx-auto">
        <MotionBox
          variant="fadeInUp"
          className="text-center space-y-8 mb-8"
        >
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none">
            Let's work <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
              together.
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-xl mx-auto leading-relaxed">
            Drop a message and let's create something memorable.
          </p>
        </MotionBox>

        <div className="flex justify-center">
          <MotionBox
            as="a"
            href="mailto:info@awaiten.com"
            variant="fadeInUp"
            delay={0.2}
            className="group relative inline-flex items-center gap-3 px-8 py-4 text-xl font-medium text-white bg-white/5 border border-white/10 rounded-full backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>info@awaiten.com</span>
            <svg 
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </MotionBox>
        </div>
      </div>
    </Section>
  );
};

export default Contact;
