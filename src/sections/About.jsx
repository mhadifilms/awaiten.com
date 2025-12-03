import React from 'react';
import Section from '../components/ui/Section';
import AnimatedHeading from '../components/ui/AnimatedHeading';
import { motion } from 'framer-motion';
import { fadeInUpDelayed } from '../constants/animations';

const About = () => {
  return (
    <Section id="about" className="relative overflow-hidden">
      {/* Background Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Left Pink/Purple Shape */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        
        {/* Right Light Blue Shape */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10">
        <AnimatedHeading>About Us</AnimatedHeading>

        <motion.div
          initial={fadeInUpDelayed(0.2).initial}
          whileInView={fadeInUpDelayed(0.2).animate}
          transition={fadeInUpDelayed(0.2).transition}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-2xl relative z-10"
        >
          <p className="text-gray-800 text-lg md:text-xl leading-relaxed text-center">
            We're a Bay Area-based production company focused on sharing real stories and experiences with the world. 
            With 7+ years of experience and 1M+ views,{' '}
            <a 
              href="#aalyan" 
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Aalyan Aamir
            </a>
            {' '}and{' '}
            <a 
              href="#hadi" 
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Muhammad Hadi Yusufali
            </a>
            {' '}are here to share your story with the world.
          </p>
        </motion.div>
      </div>
    </Section>
  );
};

export default About;

