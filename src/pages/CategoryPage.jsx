import React, { useState, useEffect } from 'react';
import AnimatedHeading from '../components/ui/AnimatedHeading';
import Section from '../components/ui/Section';
import ProjectGrid from '../components/projects/ProjectGrid';
import { getProjectsByCategory } from '../utils/projects';
import { updateSEOTags, resetSEOTags } from '../utils/seo';

const CategoryPage = ({ category }) => {
  const [filter, setFilter] = useState('ALL');
  const projects = getProjectsByCategory(category);
  const heading = category.charAt(0).toUpperCase() + category.slice(1);

  // Set SEO meta tags
  useEffect(() => {
    const categoryDescriptions = {
      'Documentary': 'Documentaries with the goal of sharing raw & authentic stories of success, failure, and everything in between.',
      'Photography': 'Capturing moments and stories through the lens. Professional photography services including travel, landscape, wedding, and portrait photography.',
      'Production': 'Creative production services bringing stories to life through video, film, and multimedia content.',
      'Commercial': 'Commercial production services for brands and businesses looking to tell their story.'
    };

    updateSEOTags({
      title: heading,
      description: categoryDescriptions[category] || `Explore our ${heading.toLowerCase()} projects and creative work.`,
      image: '/images/branding/embed.png',
      url: `${window.location.origin}/${category.toLowerCase()}`,
      type: 'website'
    });

    return () => {
      resetSEOTags();
    };
  }, [category, heading]);

  // Subcategories for filtering (only for Photography for now)
  const filters = ['ALL', 'TRAVEL', 'LANDSCAPE', 'WEDDING', 'PORTRAITS'];
  
  // Filter projects based on subcategory
  const filteredProjects = filter === 'ALL' 
    ? projects 
    : projects.filter(p => p.subcategory && p.subcategory.toUpperCase() === filter);

  return (
    <main className="min-h-screen bg-background text-primary overflow-x-hidden font-sans">
      <Section>
        <AnimatedHeading>{heading}</AnimatedHeading>
        
        {/* Filter Bar - Only show for Photography */}
        {category.toLowerCase() === 'photography' && (
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {filters.map(f => {
               // Only show filter if there are projects with this subcategory (or ALL)
               const count = f === 'ALL' ? projects.length : projects.filter(p => p.subcategory && p.subcategory.toUpperCase() === f).length;
               if (count === 0) return null;

               return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-sm tracking-widest uppercase px-4 py-2 transition-colors ${
                    filter === f 
                      ? 'text-white border-b border-white' 
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {f}
                </button>
               );
            })}
          </div>
        )}

        {filteredProjects.length > 0 ? (
          <ProjectGrid projects={filteredProjects} columns={2} />
        ) : (
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-gray-300 text-lg mb-8">
              No projects found in this category.
            </p>
          </div>
        )}
      </Section>
    </main>
  );
};

export default CategoryPage;