import React from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import { motion } from 'framer-motion';
import { services } from '../constants/data';
import { staggerItem } from '../constants/animations';

const Services = () => {
  return (
    <Section id="work" padding="small">
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {services.map((service, index) => (
          <motion.div
            key={service.name}
            initial={staggerItem(index * 0.1).initial}
            whileInView={staggerItem(index * 0.1).animate}
            transition={staggerItem(index * 0.1).transition}
            viewport={{ once: true }}
          >
          <Link
            to={service.route}
            className="group relative overflow-hidden rounded-2xl block"
          >
            <div className="aspect-[4/3] relative overflow-hidden">
              <ImageWithFallback
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white text-xl md:text-2xl font-bold">
                {service.label}
              </h3>
            </div>
          </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default Services;
