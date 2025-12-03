const fs = require('fs');
const path = require('path');

// Configuration
const PROJECTS_JSON_PATH = path.resolve(__dirname, '../src/data/projects.json');
const PUBLIC_IMAGES_PATH = path.resolve(__dirname, '../public/images/projects');

// Allowed image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

function updateGallery() {
  // 1. Read existing projects data
  if (!fs.existsSync(PROJECTS_JSON_PATH)) {
    console.error('Error: projects.json not found.');
    process.exit(1);
  }

  const projectsData = JSON.parse(fs.readFileSync(PROJECTS_JSON_PATH, 'utf8'));
  let updatedCount = 0;

  // 2. Iterate through projects
  projectsData.projects.forEach(project => {
    const projectSlug = project.slug;
    const projectGalleryPath = path.join(PUBLIC_IMAGES_PATH, projectSlug);

    // 3. Check if gallery folder exists
    if (fs.existsSync(projectGalleryPath) && fs.lstatSync(projectGalleryPath).isDirectory()) {
      // 4. Read all images
      const files = fs.readdirSync(projectGalleryPath);
      const galleryImages = files
        .filter(file => IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()))
        .sort() // Sort alphabetically
        .map(file => `/images/projects/${projectSlug}/${file}`);

      if (galleryImages.length > 0) {
        console.log(`Found ${galleryImages.length} images for project: ${project.title} (${projectSlug})`);
        
        // Update gallery field
        project.gallery = galleryImages;
        updatedCount++;
      }
    }
  });

  // 5. Write back to file
  if (updatedCount > 0) {
    fs.writeFileSync(PROJECTS_JSON_PATH, JSON.stringify(projectsData, null, 2));
    console.log(`\nSuccessfully updated galleries for ${updatedCount} projects.`);
  } else {
    console.log('\nNo gallery images found to update.');
  }
}

updateGallery();

