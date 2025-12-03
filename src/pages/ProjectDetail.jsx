import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Section from '../components/ui/Section';
import ProjectDetailComponent from '../components/projects/ProjectDetail';
import { getProjectBySlug } from '../utils/projects';

const ProjectDetailPage = () => {
  const { category, slug } = useParams();
  const project = getProjectBySlug(slug);
  
  if (!project) {
    return <Navigate to={`/${category}`} replace />;
  }
  
  // Verify category matches
  if (project.category.toLowerCase() !== category.toLowerCase()) {
    return <Navigate to={`/${project.category.toLowerCase()}/${slug}`} replace />;
  }
  
  return (
    <main className="min-h-screen bg-background text-primary overflow-x-hidden font-sans">
      <Section>
        <ProjectDetailComponent project={project} />
      </Section>
    </main>
  );
};

export default ProjectDetailPage;

