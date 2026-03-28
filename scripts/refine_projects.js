import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECTS_JSON_PATH = path.resolve(__dirname, '../src/data/projects.json');

// Mapping of slugs to new subcategories (Travel, Landscape, Wedding, Portraits)
const SUBCATEGORY_MAP = {
  'sync-uncanny-valley-fest': 'Travel',
  'death-and-life-bts': 'Portraits',
  'tanzania-2025': 'Travel',
  'sync-boilermake-winners': 'Portraits',
  'rise-academy-camp-2025': 'Travel',
  'streets-of-new-york': 'Travel',
  'streets-of-chicago': 'Travel',
  'sync-chicago-new-york': 'Travel',
  'sync-boilermake-xii': 'Portraits',
  'stills-from-sync-hq': 'Portraits',
  'sync-switzerland': 'Travel',
  'sync-france': 'Travel',
  'valley-oak-farm-bridal-shower': 'Wedding',
  'rise-academy-lower-school': 'Portraits',
  'wali-aylia-wedding': 'Wedding',
  'frames-from-tanzania': 'Travel'
};

const SENIOR_PORTRAITS_PROJECT = {
  "id": "senior-portraits",
  "slug": "senior-portraits",
  "category": "Photography",
  "subcategory": "Portraits",
  "title": "RISE Academy Senior Portraits",
  "thumbnail": "/images/cms/r3qqkcIz8eyQMS5OvsMNE5uS3t8.jpg",
  "thumbnailAlt": "RISE Senior Portraits",
  "thumbnailPosition": "object-top",
  "duration": "June 2024",
  "client": "RISE Academy",
  "deliverables": "Portrait Photography",
  "about": "<h4>Senior portrait photography sessions for RISE Academy students.</h4>",
  "videoEmbed": "",
  "galleryEmbed": "",
  "content": "<h2>About the project</h2><p>In May 2024, the Awaiten team was contacted with a request to provide senior portrait photography for RISE Academy. Working closely with the school, Awaiten provided an opportunity for students to receive high quality portraits with multiple background and clothing options. The team also provided an option for the portraits to be printed, with multiple size options available.</p><h1><br></h1><h2>Client reviews</h2><blockquote><p>Excellent service. Photographers worked efficiently and were very patient. The whole process was a breeze as they prepared well for the shoot. Highly recommend.</p></blockquote><p><em>Isa T, Student</em></p><blockquote><p>The team was easy and fun to work with! Everyone had a keen eye for what looked best for the client. Jokes and funny moments were brought here and there, which made the photoshoot memorable. Thank you!</p></blockquote><p><em>Ruqayya Z, Student</em></p><h1><br></h1><img alt=\"\" src=\"/images/cms/cPgRtYUHRl4vvCyjTzGIBR5QeQ.jpg\"><img alt=\"\" src=\"/images/cms/kQt9jFgt8UDeDcIXS1w9KqPScSo.jpg\"><img alt=\"\" src=\"/images/cms/ofF7F322BeIYVNiReRECRi4t9Qg.jpg\"><img alt=\"\" src=\"/images/cms/r3qqkcIz8eyQMS5OvsMNE5uS3t8.jpg\"><img alt=\"\" src=\"/images/cms/Ok3wKc6sXTOTJ0ZoZLKaubhgE.jpg\"><img alt=\"\" src=\"/images/cms/BCaGcO0BCoU78HsGLsFmbKKmGM.jpg\"><h1><br></h1><h2>Learn more</h2><p>Learn more about RISE Academy by <a href=\"https://riseacademy.education/\" target=\"_blank\">clicking here</a>.</p>",
  "gallery": [
    "/images/cms/cPgRtYUHRl4vvCyjTzGIBR5QeQ.jpg",
    "/images/cms/kQt9jFgt8UDeDcIXS1w9KqPScSo.jpg",
    "/images/cms/ofF7F322BeIYVNiReRECRi4t9Qg.jpg",
    "/images/cms/r3qqkcIz8eyQMS5OvsMNE5uS3t8.jpg",
    "/images/cms/Ok3wKc6sXTOTJ0ZoZLKaubhgE.jpg",
    "/images/cms/BCaGcO0BCoU78HsGLsFmbKKmGM.jpg"
  ]
};

function refineProjects() {
  if (!fs.existsSync(PROJECTS_JSON_PATH)) {
    console.error('Error: projects.json not found.');
    process.exit(1);
  }

  const projectsData = JSON.parse(fs.readFileSync(PROJECTS_JSON_PATH, 'utf8'));
  let projects = projectsData.projects;

  // 1. Update existing projects
  projects = projects.map(p => {
    if (p.category.toLowerCase() === 'photography' && SUBCATEGORY_MAP[p.slug]) {
      return { ...p, subcategory: SUBCATEGORY_MAP[p.slug] };
    }
    return p;
  });

  // 2. Check if senior-portraits exists
  const existingSenior = projects.find(p => p.slug === 'senior-portraits');
  if (!existingSenior) {
    // Insert at correct position (chronological)
    // "senior-portraits" date is June 2024. 
    // Let's find where to insert it.
    // "RISE Academy Lower School" is May 25th 2024. "Decor in Box" is June 20th 2024.
    // So "Senior Portraits" (June 2024) should be around there.
    // The current list is reverse chronological (newest first).
    // 2025... 2024 Nov... June 20th 2024... May 25th 2024...
    // So it should be around "Decor in Box".
    
    // Let's just push it and then sort again to be safe? 
    // Or just push it. Since "Decor" is June 20th, and "Senior" is just "June 2024", 
    // let's put it after "Decor" (which is newer/specific) or before? 
    // Actually, I'll just add it to the list and let the sort logic handle it if I had one, 
    // but here I'll manually splice it in or just append and let user see.
    // Wait, `clean_projects.js` sorted them based on `KEEP_PROJECTS` list order.
    // I should insert it into the array.
    
    // Find index of "valley-oak-farm-bridal-shower" (June 20th 2024)
    const decorIndex = projects.findIndex(p => p.slug === 'valley-oak-farm-bridal-shower');
    if (decorIndex !== -1) {
        // Insert after Decor
        projects.splice(decorIndex + 1, 0, SENIOR_PORTRAITS_PROJECT);
    } else {
        projects.push(SENIOR_PORTRAITS_PROJECT);
    }
    console.log('Restored RISE Academy Senior Portraits.');
  } else {
      // Update it if it exists
      existingSenior.title = "RISE Academy Senior Portraits";
      existingSenior.subcategory = "Portraits";
      existingSenior.gallery = SENIOR_PORTRAITS_PROJECT.gallery;
      console.log('Updated RISE Academy Senior Portraits.');
  }

  fs.writeFileSync(PROJECTS_JSON_PATH, JSON.stringify({ projects }, null, 2));
  console.log('Refined projects.json successfully.');
}

refineProjects();

