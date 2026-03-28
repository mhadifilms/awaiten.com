import React from 'react';
import ProjectCard from './ProjectCard';

const ProjectGrid = ({ projects, columns = 2 }) => {
  const gridClass = columns === 3 
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    : 'grid-cols-1 md:grid-cols-2';
  
  return (
    <div className={`grid ${gridClass} gap-6 md:gap-8`}>
      {projects.map((project, index) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          index={index}
        />
      ))}
    </div>
  );
};

export default ProjectGrid;

