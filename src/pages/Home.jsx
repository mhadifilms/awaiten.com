import React from 'react';
import Hero from '../sections/Hero';
import Services from '../sections/Services';
import About from '../sections/About';
import Testimonials from '../sections/Testimonials';
import Contact from '../sections/Contact';
import PodcastPreview from '../sections/PodcastPreview';

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Testimonials />
      <PodcastPreview />
      <Contact />
    </>
  );
};

export default Home;

