// Utility functions for managing projects
import projectsData from '../data/projects.json';

/**
 * Get all projects
 */
export const getAllProjects = () => {
  return projectsData.projects;
};

/**
 * Get projects by category
 */
export const getProjectsByCategory = (category) => {
  return projectsData.projects.filter(project => 
    project.category.toLowerCase() === category.toLowerCase()
  );
};

/**
 * Get project by slug
 */
export const getProjectBySlug = (slug) => {
  return projectsData.projects.find(project => project.slug === slug);
};

/**
 * Get project by ID
 */
export const getProjectById = (id) => {
  return projectsData.projects.find(project => project.id === id);
};

/**
 * Get all categories
 */
export const getCategories = () => {
  const categories = [...new Set(projectsData.projects.map(p => p.category))];
  return categories.sort();
};

/**
 * Get related projects (same category, excluding current project)
 */
export const getRelatedProjects = (currentProject, limit = 3) => {
  return projectsData.projects
    .filter(project => 
      project.category === currentProject.category && 
      project.id !== currentProject.id
    )
    .slice(0, limit);
};

