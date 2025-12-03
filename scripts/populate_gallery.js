import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PROJECTS_JSON_PATH = path.resolve(__dirname, '../src/data/projects.json');
const PUBLIC_IMAGES_PATH = path.resolve(__dirname, '../public/images/gallery');

// Allowed image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// Map of directory names to project slugs
const DIR_TO_SLUG_MAP = {
  'sync-uncanny': 'sync-uncanny-valley-fest',
  'deathandlife-bts': 'death-and-life-bts',
  'tanzania25': 'tanzania-2025',
  'sync-boilermake-winners': 'sync-boilermake-winners',
  'risecamp2025': 'rise-academy-camp-2025',
  'streetsofny': 'streets-of-new-york',
  'thestreetsofchicago': 'streets-of-chicago',
  'sync-chicago-ny': 'sync-chicago-new-york',
  'syncboilermakexii': 'sync-boilermake-xii',
  'sync-hq': 'stills-from-sync-hq',
  'sync-switzerland': 'sync-switzerland',
  'sync-france': 'sync-france',
  'decorintheboxandvalleyoakfarms': 'valley-oak-farm-bridal-shower',
  'riseacademylowerschool': 'rise-academy-lower-school',
  'wali-aylia-wedding': 'wali-aylia-wedding',
  'framesfromtanzania': 'frames-from-tanzania'
};

// Function to recursively get all images in a directory
function getImagesRecursively(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(getImagesRecursively(filePath));
    } else {
      if (IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase())) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

function updateGallery() {
  if (!fs.existsSync(PROJECTS_JSON_PATH)) {
    console.error('Error: projects.json not found.');
    process.exit(1);
  }

  const projectsData = JSON.parse(fs.readFileSync(PROJECTS_JSON_PATH, 'utf8'));
  let updatedCount = 0;

  // 1. Update existing projects or create new ones based on folders
  Object.entries(DIR_TO_SLUG_MAP).forEach(([dirName, slug]) => {
    const projectDir = path.join(PUBLIC_IMAGES_PATH, dirName);
    
    if (!fs.existsSync(projectDir)) {
      console.warn(`Warning: Directory not found for ${dirName}`);
      return;
    }

    // Find project in JSON
    let project = projectsData.projects.find(p => p.slug === slug);
    
    // If project doesn't exist, skip
    if (!project) {
        console.log(`Project with slug ${slug} not found in JSON. Skipping gallery update for now.`);
        return;
    }

    // Get all images recursively
    const allImagePaths = getImagesRecursively(projectDir);
    
    // Sort images: prioritize "Highlights" folder if exists, then others
    allImagePaths.sort((a, b) => {
        const aIsHighlight = a.includes('Highlights');
        const bIsHighlight = b.includes('Highlights');
        if (aIsHighlight && !bIsHighlight) return -1;
        if (!aIsHighlight && bIsHighlight) return 1;
        return a.localeCompare(b);
    });

    // Convert absolute paths to relative URL paths
    const galleryImages = allImagePaths.map(imgAbsPath => {
        const relativePath = path.relative(path.resolve(__dirname, '../public'), imgAbsPath);
        return '/' + relativePath; // Ensure leading slash
    });

    if (galleryImages.length > 0) {
      console.log(`Found ${galleryImages.length} images for project: ${project.title} (${slug})`);
      project.gallery = galleryImages;
      
      // Update thumbnail if it's a placeholder or empty
      if (!project.thumbnail || project.thumbnail.includes('placeholder')) {
          project.thumbnail = galleryImages[0];
          console.log(`Updated thumbnail for ${slug}`);
      }
      
      updatedCount++;
    }
  });

  // Write back to file
  if (updatedCount > 0) {
    fs.writeFileSync(PROJECTS_JSON_PATH, JSON.stringify(projectsData, null, 2));
    console.log(`\nSuccessfully updated galleries for ${updatedCount} projects.`);
  } else {
    console.log('\nNo gallery images updated.');
  }
}

updateGallery();
