import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectsPath = path.join(__dirname, '../src/data/projects.json');
const publicDir = path.join(__dirname, '../public');

const data = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

// Get EXIF DateTimeOriginal via Python (PIL is already installed)
function getExifDate(filepath) {
  try {
    const result = execSync(
      `python3 -c "
from PIL import Image
try:
    img = Image.open('${filepath}')
    exif = img._getexif()
    if exif:
        d = exif.get(36867) or exif.get(36868) or exif.get(306) or ''
        print(d)
    else:
        print('')
except:
    print('')
"`,
      { encoding: 'utf8', timeout: 5000 }
    ).trim();
    return result || null;
  } catch {
    return null;
  }
}

let sortedCount = 0;

for (const project of data.projects) {
  const gallery = project.gallery;
  if (!gallery || gallery.length < 2) continue;

  // Get EXIF dates for all images
  const withDates = gallery.map((img) => {
    const filepath = path.join(publicDir, img);
    const date = fs.existsSync(filepath) ? getExifDate(filepath) : null;
    return { img, date };
  });

  const hasAnyDate = withDates.some((d) => d.date);
  if (!hasAnyDate) {
    console.log(`  SKIP: ${project.slug} (no EXIF dates found)`);
    continue;
  }

  // Sort: images with dates first (chronological), then images without dates at the end (original order)
  const withDateEntries = withDates.filter((d) => d.date);
  const noDateEntries = withDates.filter((d) => !d.date);
  withDateEntries.sort((a, b) => a.date.localeCompare(b.date));
  const sorted = [...withDateEntries.map((d) => d.img), ...noDateEntries.map((d) => d.img)];

  // Check if order changed
  const changed = sorted.some((img, i) => img !== gallery[i]);
  if (!changed) {
    console.log(`  OK: ${project.slug} (already sorted)`);
    continue;
  }

  project.gallery = sorted;
  sortedCount++;
  console.log(`  SORTED: ${project.slug} (${gallery.length} images)`);

  // Also re-sort galleryCategories if they exist
  if (project.galleryCategories) {
    for (const [cat, imgs] of Object.entries(project.galleryCategories)) {
      const catWithDates = imgs.map((img) => {
        const filepath = path.join(publicDir, img);
        const date = fs.existsSync(filepath) ? getExifDate(filepath) : null;
        return { img, date };
      });
      const catWithDate = catWithDates.filter((d) => d.date);
      const catNoDate = catWithDates.filter((d) => !d.date);
      catWithDate.sort((a, b) => a.date.localeCompare(b.date));
      project.galleryCategories[cat] = [
        ...catWithDate.map((d) => d.img),
        ...catNoDate.map((d) => d.img),
      ];
    }
  }
}

fs.writeFileSync(projectsPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`\nDone. Sorted ${sortedCount} galleries by EXIF date.`);
