import React from 'react';
import Section from '../components/ui/Section';
import AnimatedHeading from '../components/ui/AnimatedHeading';
import FormInput from '../components/ui/FormInput';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import { fadeInLeft, fadeInRight } from '../constants/animations';

const Contact = () => {
  return (
    <Section id="contact" className="bg-contact">
      <AnimatedHeading>Get in Touch</AnimatedHeading>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        {/* Left Side - Descriptive Text */}
        <motion.div
          initial={fadeInLeft.initial}
          whileInView={fadeInLeft.animate}
          transition={fadeInLeft.transition}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <p className="text-gray-300 text-lg leading-relaxed">
            Let's talk! Get in touch with our team with any inquiries or project ideas.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            We're always open to chatting, and will do our best to get back to you within three days.
          </p>
        </motion.div>

        {/* Right Side - Contact Form */}
        <motion.form
          initial={fadeInRight.initial}
          whileInView={fadeInRight.animate}
          transition={fadeInRight.transition}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {/* Name and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              type="text"
              id="name"
              placeholder="Your Full Name"
            />
            <FormInput
              type="email"
              id="email"
              placeholder="youremail@address.com"
            />
          </div>
          
          {/* Message Textarea */}
          <FormInput
            type="textarea"
            id="message"
            placeholder="How can we help?"
            rows={6}
          />

          {/* Submit Button */}
          <Button 
            variant="primary" 
            className="w-full bg-gray-100 text-gray-900 hover:bg-white transition-colors py-4 text-lg font-semibold"
          >
            Submit
          </Button>
        </motion.form>
      </div>
    </Section>
  );
};

export default Contact;

