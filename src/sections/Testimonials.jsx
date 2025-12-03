import React, { useState } from 'react';
import Section from '../components/ui/Section';
import AnimatedHeading from '../components/ui/AnimatedHeading';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import NavigationArrows from '../components/ui/NavigationArrows';
import PaginationDots from '../components/ui/PaginationDots';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonials } from '../constants/data';
import { slideIn } from '../constants/animations';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  return (
    <Section id="testimonials">
      <AnimatedHeading>Kind Words from Clients</AnimatedHeading>

      <div className="max-w-4xl mx-auto relative">
        <NavigationArrows
          onPrevious={prevTestimonial}
          onNext={nextTestimonial}
          previousLabel="Previous testimonial"
          nextLabel="Next testimonial"
        />

        {/* Testimonial Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={slideIn.initial}
            animate={slideIn.animate}
            exit={slideIn.exit}
            transition={slideIn.transition}
            className="text-center"
          >
            <div className="mb-8">
              <div className="w-24 h-24 rounded-full mx-auto mb-6 bg-gradient-to-br from-gray-600 to-gray-800 overflow-hidden border-4 border-white/20">
                <ImageWithFallback
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].author}
                  className="w-full h-full object-cover"
                  fallbackGradient="linear-gradient(135deg, #4b5563 0%, #1f2937 100%)"
                />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                {testimonials[currentIndex].author}
              </h3>
              <p className="text-gray-400 text-lg">
                {testimonials[currentIndex].role}
              </p>
            </div>

            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              "{testimonials[currentIndex].text}"
            </p>
          </motion.div>
        </AnimatePresence>

        <PaginationDots
          count={testimonials.length}
          currentIndex={currentIndex}
          onDotClick={goToTestimonial}
          className="mt-12"
        />
      </div>
    </Section>
  );
};

export default Testimonials;

