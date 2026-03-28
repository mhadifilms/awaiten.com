import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PROJECTS_JSON_PATH = path.resolve(__dirname, '../src/data/projects.json');

// List of project slugs to KEEP (the new list provided by user)
const KEEP_PROJECTS = [
  'sync-uncanny-valley-fest',
  'death-and-life-bts',
  'tanzania-2025',
  'sync-boilermake-winners',
  'rise-academy-camp-2025',
  'streets-of-new-york',
  'streets-of-chicago',
  'sync-chicago-new-york',
  'sync-boilermake-xii',
  'stills-from-sync-hq',
  'sync-switzerland',
  'sync-france',
  'valley-oak-farm-bridal-shower',
  'rise-academy-lower-school',
  'wali-aylia-wedding',
  'frames-from-tanzania'
];

function cleanProjects() {
  if (!fs.existsSync(PROJECTS_JSON_PATH)) {
    console.error('Error: projects.json not found.');
    process.exit(1);
  }

  const projectsData = JSON.parse(fs.readFileSync(PROJECTS_JSON_PATH, 'utf8'));
  
  // Filter projects: Keep all non-photography projects + only the specified photography projects
  const cleanedProjects = projectsData.projects.filter(project => {
    if (project.category.toLowerCase() !== 'photography') {
      return true;
    }
    return KEEP_PROJECTS.includes(project.slug);
  });

  // Sort photography projects by the order in KEEP_PROJECTS (which is chronological)
  // We need to separate photography and non-photography first to sort only photography
  const nonPhotoProjects = cleanedProjects.filter(p => p.category.toLowerCase() !== 'photography');
  const photoProjects = cleanedProjects.filter(p => p.category.toLowerCase() === 'photography');

  photoProjects.sort((a, b) => {
    return KEEP_PROJECTS.indexOf(a.slug) - KEEP_PROJECTS.indexOf(b.slug);
  });

  // Combine them back
  const finalProjects = [...nonPhotoProjects, ...photoProjects];

  const finalJson = { projects: finalProjects };
  fs.writeFileSync(PROJECTS_JSON_PATH, JSON.stringify(finalJson, null, 2));
  console.log(`Cleaned projects.json. Total projects: ${finalProjects.length}`);
}

cleanProjects();
