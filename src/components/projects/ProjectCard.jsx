import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImageWithFallback from '../ui/ImageWithFallback';

const ProjectCard = ({ project, index = 0, delay = 0.1 }) => {
  const categoryRoute = `/${project.category.toLowerCase()}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * delay }}
      viewport={{ once: true }}
    >
      <Link
        to={`${categoryRoute}/${project.slug}`}
        className="group relative overflow-hidden rounded-2xl block"
      >
        <div className="aspect-[4/3] relative overflow-hidden">
          <ImageWithFallback
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl md:text-2xl font-bold">
            {project.title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;

