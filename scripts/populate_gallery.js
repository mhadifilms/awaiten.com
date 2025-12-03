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

// Function to get images grouped by subfolder (category)
function getImagesByCategory(projectDir) {
  const categories = {};
  const allImages = [];
  
  if (!fs.existsSync(projectDir)) return { categories, allImages };
  
  const list = fs.readdirSync(projectDir);
  
  list.forEach(item => {
    const itemPath = path.join(projectDir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat && stat.isDirectory()) {
      // Skip Highlights folders - files should be in root now
      if (item === 'Highlights') {
        // Get images from Highlights and add to root (no category)
        function getImagesInDir(dir) {
          const files = fs.readdirSync(dir);
          files.forEach(file => {
            const filePath = path.join(dir, file);
            const fileStat = fs.statSync(filePath);
            
            if (fileStat && fileStat.isDirectory()) {
              getImagesInDir(filePath);
            } else {
              if (IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase())) {
                const fileName = path.basename(filePath, path.extname(file));
                if (!fileName.includes('_thumb')) {
                  allImages.push(filePath);
                }
              }
            }
          });
        }
        getImagesInDir(itemPath);
        return; // Skip creating Highlights category
      }
      
      // This is a category folder (not Highlights)
      const categoryName = item;
      const categoryImages = [];
      
      // Get all images in this category folder (recursively)
      function getImagesInDir(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const fileStat = fs.statSync(filePath);
          
          if (fileStat && fileStat.isDirectory()) {
            getImagesInDir(filePath);
          } else {
            if (IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase())) {
              const fileName = path.basename(filePath, path.extname(file));
              if (!fileName.includes('_thumb')) {
                categoryImages.push(filePath);
                allImages.push(filePath);
              }
            }
          }
        });
      }
      
      getImagesInDir(itemPath);
      
      // Sort images by filename within category
      categoryImages.sort((a, b) => {
        const nameA = path.basename(a);
        const nameB = path.basename(b);
        return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' });
      });
      
      if (categoryImages.length > 0) {
        categories[categoryName] = categoryImages.map(imgAbsPath => {
          const relativePath = path.relative(path.resolve(__dirname, '../public'), imgAbsPath);
          return '/' + relativePath;
        });
      }
    } else {
      // Direct images in root (no category folders)
      if (IMAGE_EXTENSIONS.includes(path.extname(item).toLowerCase())) {
        const fileName = path.basename(itemPath, path.extname(item));
        if (!fileName.includes('_thumb')) {
          allImages.push(itemPath);
        }
      }
    }
  });
  
  // Sort all images by filename
  allImages.sort((a, b) => {
    const nameA = path.basename(a);
    const nameB = path.basename(b);
    return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' });
  });
  
  return { categories, allImages };
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
    
    if (!project) {
        console.log(`Project with slug ${slug} not found in JSON. Skipping gallery update for now.`);
        return;
    }

    // Get images grouped by category
    const { categories, allImages } = getImagesByCategory(projectDir);

    // Convert absolute paths to relative URL paths for all images
    const galleryImages = allImages.map(imgAbsPath => {
        const relativePath = path.relative(path.resolve(__dirname, '../public'), imgAbsPath);
        return '/' + relativePath; // Ensure leading slash
    });

    // Convert category images to relative paths
    const galleryCategories = {};
    Object.keys(categories).forEach(categoryName => {
      galleryCategories[categoryName] = categories[categoryName];
    });

    if (galleryImages.length > 0) {
      console.log(`Found ${galleryImages.length} images for project: ${project.title} (${slug})`);
      if (Object.keys(galleryCategories).length > 0) {
        console.log(`  Categories: ${Object.keys(galleryCategories).join(', ')}`);
      }
      
      // Store both flat array (for backward compatibility) and categories
      project.gallery = galleryImages;
      // Always set galleryCategories (clear old ones if no categories exist)
      if (Object.keys(galleryCategories).length > 0) {
        project.galleryCategories = galleryCategories;
      } else {
        // Remove galleryCategories if no categories exist (files are in root)
        delete project.galleryCategories;
      }
      
      // Update thumbnail - fix old Highlights paths or use first image
      if (!project.thumbnail || project.thumbnail.includes('placeholder') || project.thumbnail.includes('/Highlights/')) {
          // Use first image as thumbnail
          project.thumbnail = galleryImages[0];
          console.log(`Updated thumbnail for ${slug}`);
      } else {
          // Fix existing thumbnail path if it references Highlights folder
          if (project.thumbnail.includes('/Highlights/')) {
              const fixedThumbnail = project.thumbnail.replace('/Highlights/', '/');
              // Check if the fixed path exists in gallery images
              if (galleryImages.includes(fixedThumbnail)) {
                  project.thumbnail = fixedThumbnail;
                  console.log(`Fixed thumbnail path for ${slug}`);
              } else {
                  // Use first image if fixed path doesn't exist
                  project.thumbnail = galleryImages[0];
                  console.log(`Updated thumbnail for ${slug} (fixed path not found)`);
              }
          }
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
