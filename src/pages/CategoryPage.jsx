import React from 'react';
import AnimatedHeading from '../components/ui/AnimatedHeading';
import Section from '../components/ui/Section';
import ProjectGrid from '../components/projects/ProjectGrid';
import { getProjectsByCategory } from '../utils/projects';

const CategoryPage = ({ category }) => {
  const projects = getProjectsByCategory(category);
  // Ensure proper capitalization for the heading
  const heading = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <main className="min-h-screen bg-background text-primary overflow-x-hidden font-sans">
      <Section>
        <AnimatedHeading>{heading}</AnimatedHeading>
        {projects.length > 0 ? (
          <ProjectGrid projects={projects} columns={2} />
        ) : (
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-gray-300 text-lg mb-8">
              Our {category.toLowerCase()} portfolio showcases moments captured with artistic vision and technical excellence.
            </p>
          </div>
        )}
      </Section>
    </main>
  );
};

export default CategoryPage;

