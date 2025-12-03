import React from 'react';
import { Link } from 'react-router-dom';
import ImageWithFallback from '../ui/ImageWithFallback';
import MotionBox from '../ui/MotionBox';

const ProjectCard = ({ project, index = 0, delay = 0.1 }) => {
  // If it's a photography project, use the photography route
  const linkTo = project.category.toLowerCase() === 'photography' 
    ? `/photography/${project.slug}`
    : `/${project.category.toLowerCase()}/${project.slug}`;
  
  return (
    <MotionBox
      variant="fadeInUp"
      delay={index * delay}
    >
      <Link
        to={linkTo}
        className="group relative overflow-hidden rounded-2xl block"
      >
        <div className="aspect-[4/3] relative overflow-hidden">
          <ImageWithFallback
            src={project.thumbnail}
            alt={project.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${project.thumbnailPosition || 'object-center'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          {project.duration && project.category.toLowerCase() === 'photography' && (
            <p className="text-gray-300 text-xs tracking-widest uppercase mb-2 font-medium">
              {project.duration}
            </p>
          )}
          <h3 className="text-white h3 font-medium">
            {project.title}
          </h3>
        </div>
      </Link>
    </MotionBox>
  );
};

export default ProjectCard;
