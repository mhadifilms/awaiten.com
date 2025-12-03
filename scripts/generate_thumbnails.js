import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const GALLERY_DIR = path.join(PUBLIC_DIR, 'images/gallery');
const THUMBNAIL_SIZE = 600; // Max width/height
const QUALITY = 70; // JPEG quality

async function generateThumbnails(dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Recursive call for subdirectories
      await generateThumbnails(fullPath);
    } else if (entry.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
      // Skip if it's already a thumbnail
      if (entry.name.includes('_thumb')) continue;

      const ext = path.extname(entry.name);
      const name = path.basename(entry.name, ext);
      const thumbName = `${name}_thumb${ext}`;
      const thumbPath = path.join(dir, thumbName);

      // Check if thumbnail already exists
      if (fs.existsSync(thumbPath)) {
        // console.log(`Skipping existing thumbnail: ${thumbPath}`);
        continue;
      }

      try {
        console.log(`Generating thumbnail for: ${fullPath}`);
        await sharp(fullPath)
          .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: QUALITY, mozjpeg: true }) // convert to jpeg or keep format? keeping format is safer but jpeg is smaller
          .toFile(thumbPath);
      } catch (error) {
        console.error(`Error processing ${fullPath}:`, error);
      }
    }
  }
}

console.log('Starting thumbnail generation...');
generateThumbnails(GALLERY_DIR)
  .then(() => console.log('Thumbnail generation complete!'))
  .catch(err => console.error('Fatal error:', err));

