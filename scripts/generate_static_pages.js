import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://awaiten.com';
const CDN_BASE = 'https://cdn.awaiten.com';

// Load projects data
const projectsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/projects.json'), 'utf8')
);

// Read the base index.html
const indexHtmlPath = path.join(__dirname, '../dist/index.html');
const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Helper to get absolute image URL (served from CDN)
function getAbsoluteImageUrl(imagePath) {
  if (!imagePath) return `${CDN_BASE}/images/branding/embed.png`;
  if (imagePath.startsWith('http')) return imagePath;
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  if (cleanPath.startsWith('/images/')) {
    const cdnPath = cleanPath.startsWith('/images/gallery-optimized/')
      ? cleanPath.replace('/images/gallery-optimized/', '/images/gallery/')
      : cleanPath;
    return `${CDN_BASE}${cdnPath}`;
  }
  return `${BASE_URL}${cleanPath}`;
}

// Helper to strip HTML tags for description
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

// Escape HTML entities for safe injection
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Update a meta tag in the HTML string
function setMeta(html, selector, attr, value) {
  const regex = new RegExp(`(<meta[^>]*${selector}[^>]*${attr}=")[^"]*(")`);
  if (regex.test(html)) {
    return html.replace(regex, `$1${escapeHtml(value)}$2`);
  }
  // Insert before </head> if not found
  const propType = selector.includes('property=') ? 'property' : 'name';
  const propVal = selector.match(/"([^"]+)"/)?.[1] || '';
  return html.replace(
    /<\/head>/,
    `    <meta ${propType}="${propVal}" ${attr}="${escapeHtml(value)}" />\n  </head>`
  );
}

// Generate SEO-enriched HTML for a page
function generatePageHtml({ title, description, imageUrl, url, content, jsonLd }) {
  let html = baseHtml;

  // Title
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);

  // Meta description (the actual SEO-critical one)
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escapeHtml(description)}" />`
  );

  // Canonical
  html = html.replace(
    /<\/head>/,
    `    <link rel="canonical" href="${escapeHtml(url)}" />\n  </head>`
  );

  // Open Graph
  html = setMeta(html, 'property="og:type"', 'content', 'article');
  html = setMeta(html, 'property="og:url"', 'content', url);
  html = setMeta(html, 'property="og:title"', 'content', title);
  html = setMeta(html, 'property="og:description"', 'content', description);
  html = setMeta(html, 'property="og:image"', 'content', imageUrl);

  // Twitter
  html = setMeta(html, 'property="twitter:url"', 'content', url);
  html = setMeta(html, 'property="twitter:title"', 'content', title);
  html = setMeta(html, 'property="twitter:description"', 'content', description);
  html = setMeta(html, 'property="twitter:image"', 'content', imageUrl);

  // Inject JSON-LD structured data before </head>
  if (jsonLd) {
    html = html.replace(
      /<\/head>/,
      `    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`
    );
  }

  // Inject server-rendered content into the body for crawlers
  // This goes inside <div id="root"> so React will hydrate over it
  if (content) {
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root"><div id="ssr-content" style="opacity:0;position:absolute;pointer-events:none">${content}</div></div>`
    );
  }

  return html;
}

// Build crawler-visible content for a project
function buildProjectContent(project) {
  const parts = [];
  parts.push(`<h1>${escapeHtml(project.title)}</h1>`);
  if (project.duration) parts.push(`<p>${escapeHtml(project.duration)}</p>`);
  if (project.client) parts.push(`<p>Client: ${escapeHtml(project.client)}</p>`);
  if (project.deliverables) parts.push(`<p>Deliverables: ${escapeHtml(project.deliverables)}</p>`);
  if (project.about) {
    const aboutText = stripHtml(project.about);
    if (aboutText) parts.push(`<p>${escapeHtml(aboutText)}</p>`);
  }
  if (project.content) {
    const contentText = stripHtml(project.content);
    if (contentText) parts.push(`<p>${escapeHtml(contentText.substring(0, 500))}</p>`);
  }
  if (project.otherInfo1) {
    const text = stripHtml(project.otherInfo1);
    if (text) parts.push(`<p>${escapeHtml(text.substring(0, 300))}</p>`);
  }
  if (project.otherInfo2) {
    const text = stripHtml(project.otherInfo2);
    if (text) parts.push(`<p>${escapeHtml(text.substring(0, 300))}</p>`);
  }
  return parts.join('\n');
}

// Build JSON-LD for a project
function buildProjectJsonLd(project, url, imageUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.about ? stripHtml(project.about).substring(0, 200) : `${project.title} by Awaiten`,
    url,
    image: imageUrl,
    creator: { '@type': 'Organization', name: 'Awaiten', url: BASE_URL },
    ...(project.duration && { dateCreated: project.duration }),
    ...(project.client && { accountablePerson: { '@type': 'Organization', name: project.client } }),
  };
}

// Category page descriptions
const categoryDescriptions = {
  documentary: 'Documentaries sharing raw & authentic stories of success, failure, and everything in between.',
  photography: 'Professional photography capturing moments and stories through the lens — travel, landscape, wedding, and portrait photography.',
  production: 'Creative production services bringing stories to life through video, film, and multimedia content.',
  commercial: 'Commercial production services for brands and businesses looking to tell their story.',
};

function generateStaticPages() {
  try {
    const distDir = path.join(__dirname, '../dist');

    if (!fs.existsSync(distDir)) {
      console.error('Error: dist directory does not exist. Run "npm run build" first.');
      process.exit(1);
    }
    if (!fs.existsSync(indexHtmlPath)) {
      console.error(`Error: ${indexHtmlPath} does not exist.`);
      process.exit(1);
    }

    let generatedCount = 0;
    const errors = [];
    const sitemapUrls = [
      { loc: BASE_URL, priority: '1.0' },
      { loc: `${BASE_URL}/manifesto`, priority: '0.8' },
      { loc: `${BASE_URL}/podcast`, priority: '0.8' },
    ];

    // Generate standalone pages
    const standalonePages = [
      {
        route: '/podcast',
        title: 'Journey Tellers Podcast • Awaiten',
        description: 'Reading and writing the stories of the Muslim West. Celebrating entrepreneurs, chefs, doctors, animators, converts, and educators.',
        content: '<h1>Journey Tellers Podcast</h1><p>Reading and writing the stories of the Muslim West. A podcast by Awaiten celebrating entrepreneurs, chefs, doctors, animators, converts, and educators.</p>',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'PodcastSeries',
          name: 'Journey Tellers',
          description: 'Reading and writing the stories of the Muslim West.',
          url: `${BASE_URL}/podcast`,
          creator: { '@type': 'Organization', name: 'Awaiten', url: BASE_URL },
        },
      },
      {
        route: '/manifesto',
        title: 'The Next Hollywood is Unscripted: Our Manifesto • Awaiten',
        description: 'In a world where every skill can be mastered by anyone, those who stand out will be the best storytellers. Not stories that have been scripted, rather authentic stories.',
        content: '<h1>The next Hollywood is unscripted.</h1><p>In a world where every skill can be mastered by anyone, and the value of all skills goes to zero, those who stand out will be the best storytellers. Not stories that have been scripted, rather authentic stories—ones that are lived, captured, and shared with the world.</p><p>Our goal with Awaiten is to provide the resources needed, from beginning to end, for anyone — no matter their skill, age, or experience — to share their stories with the world.</p>',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          name: 'The Next Hollywood is Unscripted',
          description: 'Our manifesto on authentic storytelling.',
          url: `${BASE_URL}/manifesto`,
          author: { '@type': 'Person', name: 'M Hadi', jobTitle: 'CEO & Co-Founder' },
          publisher: { '@type': 'Organization', name: 'Awaiten', url: BASE_URL },
        },
      },
    ];

    for (const page of standalonePages) {
      const url = `${BASE_URL}${page.route}`;
      const html = generatePageHtml({
        title: page.title,
        description: page.description,
        imageUrl: `${CDN_BASE}/images/branding/embed.png`,
        url,
        content: page.content,
        jsonLd: page.jsonLd,
      });

      const filePath = path.join(distDir, page.route, 'index.html');
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, html, 'utf8');
      generatedCount++;
      console.log(`Generated: ${page.route}`);
    }

    // Generate category pages
    for (const [category, desc] of Object.entries(categoryDescriptions)) {
      const routePath = `/${category}`;
      const url = `${BASE_URL}${routePath}`;
      const title = `${category.charAt(0).toUpperCase() + category.slice(1)} • Awaiten`;
      const projects = projectsData.projects.filter(p => p.category.toLowerCase() === category);
      const projectList = projects.map(p => `<li><a href="/${category}/${p.slug}">${escapeHtml(p.title)}</a></li>`).join('\n');
      const content = `<h1>${escapeHtml(title)}</h1>\n<p>${escapeHtml(desc)}</p>\n<ul>${projectList}</ul>`;

      const html = generatePageHtml({
        title,
        description: desc,
        imageUrl: `${CDN_BASE}/images/branding/embed.png`,
        url,
        content,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: title,
          description: desc,
          url,
          mainEntity: { '@type': 'ItemList', itemListElement: projects.map((p, i) => ({
            '@type': 'ListItem', position: i + 1, url: `${BASE_URL}/${category}/${p.slug}`, name: p.title,
          }))},
        },
      });

      const filePath = path.join(distDir, category, 'index.html');
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, html, 'utf8');
      generatedCount++;
      console.log(`Generated: ${routePath}`);
      sitemapUrls.push({ loc: url, priority: '0.8' });
    }

    // Generate project pages
    projectsData.projects.forEach((project, index) => {
      try {
        const category = project.category.toLowerCase();
        const slug = project.slug;
        if (!category || !slug) {
          errors.push(`Project at index ${index} missing category or slug`);
          return;
        }

        const routePath = `/${category}/${slug}`;
        const url = `${BASE_URL}${routePath}`;
        const thumbnail = project.thumbnail || project.gallery?.[0];
        const imageUrl = getAbsoluteImageUrl(thumbnail);
        const title = `${project.title} • Awaiten`;
        const description = project.about
          ? stripHtml(project.about).substring(0, 160)
          : `View ${project.title} by Awaiten`;

        const html = generatePageHtml({
          title,
          description,
          imageUrl,
          url,
          content: buildProjectContent(project),
          jsonLd: buildProjectJsonLd(project, url, imageUrl),
        });

        const filePath = path.join(distDir, category, slug, 'index.html');
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, html, 'utf8');
        generatedCount++;
        console.log(`Generated: ${routePath}`);
        sitemapUrls.push({ loc: url, priority: '0.6' });
      } catch (error) {
        errors.push(`Error generating page for project "${project?.title || index}": ${error.message}`);
      }
    });

    // Generate 301 redirect pages for old URLs
    // Maps old Framer/gallery URLs to current routes
    const redirects = [
      // Old /projects/* URLs from Framer
      ...projectsData.projects.map(p => ({
        from: `/projects/${p.slug}`,
        to: `/${p.category.toLowerCase()}/${p.slug}`,
      })),
      // Old /gallery route
      { from: '/gallery', to: '/photography' },
    ];

    let redirectCount = 0;
    for (const { from, to } of redirects) {
      const targetUrl = `${BASE_URL}${to}`;
      const redirectHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0;url=${targetUrl}">
<link rel="canonical" href="${targetUrl}">
<title>Redirecting...</title>
</head>
<body>
<p>This page has moved to <a href="${targetUrl}">${targetUrl}</a></p>
</body>
</html>`;

      const filePath = path.join(distDir, from, 'index.html');
      // Don't overwrite existing pages
      if (fs.existsSync(filePath)) continue;
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, redirectHtml, 'utf8');
      redirectCount++;
    }
    console.log(`Generated: ${redirectCount} redirect pages for old URLs`);

    // Generate sitemap.xml
    const today = new Date().toISOString().split('T')[0];
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
    console.log(`Generated: /sitemap.xml (${sitemapUrls.length} URLs)`);

    // Generate robots.txt
    const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${BASE_URL}/sitemap.xml
`;
    fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');
    console.log('Generated: /robots.txt');

    if (errors.length > 0) {
      console.error('\n\u26a0\ufe0f  Errors encountered:');
      errors.forEach(err => console.error(`  - ${err}`));
    }

    console.log(`\n\u2705 Generated ${generatedCount} static HTML files + sitemap.xml + robots.txt`);

    if (errors.length > 0) process.exit(1);
  } catch (error) {
    console.error(`\n\u274c Fatal error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

try {
  generateStaticPages();
} catch (error) {
  console.error(`\n\u274c Fatal error: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
}
