import React from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import { services } from '../constants/data';
import MotionBox from '../components/ui/MotionBox';

const Services = () => {
  return (
    <Section id="work" padding="small">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {services.map((service, index) => (
          <MotionBox
            key={service.name}
            variant="fadeInUp"
            delay={index * 0.1}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white h3 font-medium">
                  {service.label}
                </h3>
              </div>
            </Link>
          </MotionBox>
        ))}
      </div>
    </Section>
  );
};

export default Services;
