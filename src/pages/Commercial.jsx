import React from 'react';
import AnimatedHeading from '../components/ui/AnimatedHeading';
import Section from '../components/ui/Section';
import ProjectGrid from '../components/projects/ProjectGrid';
import { getProjectsByCategory } from '../utils/projects';

const Commercial = () => {
  const projects = getProjectsByCategory('Commercial');
  
  return (
    <main className="min-h-screen bg-background text-primary overflow-x-hidden font-sans">
      <Section>
        <AnimatedHeading>Commercial</AnimatedHeading>
        <ProjectGrid projects={projects} columns={2} />
      </Section>
    </main>
  );
};

export default Commercial;

