import React from 'react';
import AnimatedHeading from '../components/ui/AnimatedHeading';
import Section from '../components/ui/Section';
import ProjectGrid from '../components/projects/ProjectGrid';
import { getProjectsByCategory } from '../utils/projects';

const Production = () => {
  const projects = getProjectsByCategory('Production');
  
  return (
    <main className="min-h-screen bg-background text-primary overflow-x-hidden font-sans">
      <Section>
        <AnimatedHeading>Production</AnimatedHeading>
        <ProjectGrid projects={projects} columns={2} />
      </Section>
    </main>
  );
};

export default Production;

