import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://mhadifilms.github.io/awaiten.com';
const BASE_PATH = '/awaiten.com';

// Load projects data
const projectsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/projects.json'), 'utf8')
);

// Read the base index.html
const indexHtmlPath = path.join(__dirname, '../dist/index.html');
const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Helper to get absolute image URL
function getAbsoluteImageUrl(imagePath) {
  if (!imagePath) return `${BASE_URL}/images/branding/embed.png`;
  if (imagePath.startsWith('http')) return imagePath;
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${BASE_URL}${cleanPath}`;
}

// Helper to strip HTML tags for description
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

// Generate HTML for a project route
function generateProjectHtml(project, routePath) {
  const thumbnail = project.thumbnail || project.gallery?.[0];
  const imageUrl = getAbsoluteImageUrl(thumbnail);
  const title = `${project.title} • Awaiten`;
  const description = project.about 
    ? stripHtml(project.about).substring(0, 200)
    : `View ${project.title} by Awaiten`;
  const url = `${BASE_URL}${routePath}`;

  // Replace meta tags in the HTML
  let html = baseHtml;

  // Update title
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${title}</title>`
  );

  // Update or add og:image
  if (html.includes('property="og:image"')) {
    html = html.replace(
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${imageUrl}" />`
    );
  } else {
    html = html.replace(
      /<\/head>/,
      `    <meta property="og:image" content="${imageUrl}" />\n</head>`
    );
  }

  // Update or add og:title
  if (html.includes('property="og:title"')) {
    html = html.replace(
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${title}" />`
    );
  } else {
    html = html.replace(
      /<\/head>/,
      `    <meta property="og:title" content="${title}" />\n</head>`
    );
  }

  // Update or add og:description
  if (html.includes('property="og:description"')) {
    html = html.replace(
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${description}" />`
    );
  } else {
    html = html.replace(
      /<\/head>/,
      `    <meta property="og:description" content="${description}" />\n</head>`
    );
  }

  // Update or add og:url
  if (html.includes('property="og:url"')) {
    html = html.replace(
      /<meta property="og:url" content="[^"]*" \/>/,
      `<meta property="og:url" content="${url}" />`
    );
  } else {
    html = html.replace(
      /<\/head>/,
      `    <meta property="og:url" content="${url}" />\n</head>`
    );
  }

  // Update or add twitter:image
  if (html.includes('property="twitter:image"')) {
    html = html.replace(
      /<meta property="twitter:image" content="[^"]*" \/>/,
      `<meta property="twitter:image" content="${imageUrl}" />`
    );
  } else {
    html = html.replace(
      /<\/head>/,
      `    <meta property="twitter:image" content="${imageUrl}" />\n</head>`
    );
  }

  // Update or add twitter:title
  if (html.includes('property="twitter:title"')) {
    html = html.replace(
      /<meta property="twitter:title" content="[^"]*" \/>/,
      `<meta property="twitter:title" content="${title}" />`
    );
  } else {
    html = html.replace(
      /<\/head>/,
      `    <meta property="twitter:title" content="${title}" />\n</head>`
    );
  }

  // Update or add twitter:description
  if (html.includes('property="twitter:description"')) {
    html = html.replace(
      /<meta property="twitter:description" content="[^"]*" \/>/,
      `<meta property="twitter:description" content="${description}" />`
    );
  } else {
    html = html.replace(
      /<\/head>/,
      `    <meta property="twitter:description" content="${description}" />\n</head>`
    );
  }

  // Update twitter:url
  if (html.includes('property="twitter:url"')) {
    html = html.replace(
      /<meta property="twitter:url" content="[^"]*" \/>/,
      `<meta property="twitter:url" content="${url}" />`
    );
  }

  return html;
}

// Generate static HTML files for all project routes
function generateStaticPages() {
  const distDir = path.join(__dirname, '../dist');
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    console.error('Error: dist directory does not exist. Run "npm run build" first.');
    process.exit(1);
  }

  let generatedCount = 0;

  projectsData.projects.forEach(project => {
    const category = project.category.toLowerCase();
    const slug = project.slug;
    
    // Generate HTML for project detail pages
    const routePath = `/${category}/${slug}`;
    const filePath = path.join(distDir, category, slug, 'index.html');
    const dirPath = path.dirname(filePath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    const html = generateProjectHtml(project, routePath);
    fs.writeFileSync(filePath, html, 'utf8');
    generatedCount++;
    
    console.log(`Generated: ${routePath}`);
  });

  console.log(`\n✅ Generated ${generatedCount} static HTML files with meta tags.`);
}

generateStaticPages();

