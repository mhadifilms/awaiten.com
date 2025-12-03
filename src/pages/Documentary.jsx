import React from 'react';
import AnimatedHeading from '../components/ui/AnimatedHeading';
import Section from '../components/ui/Section';
import ProjectGrid from '../components/projects/ProjectGrid';
import { getProjectsByCategory } from '../utils/projects';

const Documentary = () => {
  const projects = getProjectsByCategory('Documentary');
  
  return (
    <main className="min-h-screen bg-background text-primary overflow-x-hidden font-sans">
      <Section>
        <AnimatedHeading>Documentary</AnimatedHeading>
        <ProjectGrid projects={projects} columns={2} />
      </Section>
    </main>
  );
};

export default Documentary;

