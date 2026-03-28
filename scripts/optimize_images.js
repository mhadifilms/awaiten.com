import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Industry standard image optimization settings
const MAX_WIDTH = 2400; // Max width for full-res images (industry standard: 2400px for retina displays)
const QUALITY = 85; // JPEG quality (industry standard: 80-90 for web)
const GALLERY_DIR = path.join(__dirname, '../public/images/gallery');
const OPTIMIZED_DIR = path.join(__dirname, '../public/images/gallery-optimized');

/**
 * Industry Standard Image Optimization:
 * - Max width: 2400px (sufficient for retina displays)
 * - Quality: 85% (good balance of quality/size)
 * - Target size: 1-2MB per image
 */
async function optimizeImage(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const fileSizeMB = stats.size / (1024 * 1024);
    
    // Get relative path from gallery directory
    const relativePath = path.relative(GALLERY_DIR, filePath);
    const optimizedPath = path.join(OPTIMIZED_DIR, relativePath);
    const optimizedDir = path.dirname(optimizedPath);
    
    // Skip if optimized version already exists
    if (fs.existsSync(optimizedPath)) {
      const optimizedStats = fs.statSync(optimizedPath);
      const optimizedSizeMB = optimizedStats.size / (1024 * 1024);
      console.log(`✓ Already optimized: ${path.basename(filePath)} (${optimizedSizeMB.toFixed(2)}MB)`);
      return;
    }

    console.log(`Optimizing: ${path.basename(filePath)} (${fileSizeMB.toFixed(2)}MB)`);
    
    // Create optimized directory if it doesn't exist
    if (!fs.existsSync(optimizedDir)) {
      fs.mkdirSync(optimizedDir, { recursive: true });
    }
    
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Calculate new dimensions
    let width = metadata.width;
    let height = metadata.height;
    
    if (width > MAX_WIDTH) {
      height = Math.round((height * MAX_WIDTH) / width);
      width = MAX_WIDTH;
    }
    
    // Create optimized version (DO NOT replace original)
    await image
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ 
        quality: QUALITY, 
        mozjpeg: true, // Better compression
        progressive: true // Progressive JPEG for faster perceived loading
      })
      .toFile(optimizedPath);
    
    const newStats = fs.statSync(optimizedPath);
    const newSizeMB = newStats.size / (1024 * 1024);
    const reduction = ((1 - newStats.size / stats.size) * 100).toFixed(1);
    
    console.log(`  → ${newSizeMB.toFixed(2)}MB (${reduction}% reduction) - saved to gallery-optimized`);
  } catch (error) {
    console.error(`Error optimizing ${filePath}:`, error.message);
  }
}

async function optimizeDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await optimizeDirectory(fullPath);
    } else if (entry.isFile() && /\.(jpg|jpeg)$/i.test(entry.name)) {
      // Skip backups and thumbnails
      if (entry.name.includes('.backup') || entry.name.includes('_thumb')) {
        continue;
      }
      await optimizeImage(fullPath);
    }
  }
}

console.log('Starting industry-standard image optimization...');
console.log(`Target: Max ${MAX_WIDTH}px width, ${QUALITY}% quality, 1-2MB per image`);
console.log(`Originals preserved in: ${GALLERY_DIR}`);
console.log(`Optimized versions saved to: ${OPTIMIZED_DIR}`);
console.log('Note: Optimized images will be committed to git for GitHub Actions build\n');

optimizeDirectory(GALLERY_DIR)
  .then(() => {
    console.log('\n✅ Image optimization complete!');
    console.log('✓ Original images preserved (unchanged)');
    console.log('✓ Optimized versions created in gallery-optimized folder');
    console.log('✓ Ready to commit optimized images to git');
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });

