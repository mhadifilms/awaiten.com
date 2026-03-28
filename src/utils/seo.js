import { getAssetPath } from './assets';

/**
 * Updates or creates SEO meta tags for a page
 * @param {Object} options - SEO configuration options
 * @param {string} options.title - Page title (will be appended with " • Awaiten")
 * @param {string} options.description - Meta description
 * @param {string} options.image - Image path (relative or absolute URL)
 * @param {string} options.url - Canonical URL (defaults to current URL)
 * @param {string} options.type - Open Graph type (defaults to "website")
 */
export const updateSEOTags = ({
  title,
  description,
  image,
  url,
  type = 'website'
}) => {
  // Set document title
  const fullTitle = title ? `${title} • Awaiten` : 'Awaiten • Creative Production Studio';
  document.title = fullTitle;

  // Get absolute image URL
  const imagePath = image || '/images/branding/embed.png';
  const embedImagePath = getAssetPath(imagePath);
  const embedImageUrl = embedImagePath.startsWith('http') 
    ? embedImagePath 
    : new URL(embedImagePath, window.location.origin).href;

  // Get canonical URL
  const canonicalUrl = url || window.location.href;

  // Helper function to update or create meta tag
  const updateMetaTag = (selector, attribute, value, createFn) => {
    // Handle multiple selectors (comma-separated)
    const selectors = selector.includes(',') ? selector.split(',').map(s => s.trim()) : [selector];
    
    let meta = null;
    for (const sel of selectors) {
      meta = document.querySelector(sel);
      if (meta) break;
    }
    
    if (!meta) {
      meta = createFn();
      document.head.appendChild(meta);
    }
    meta.setAttribute(attribute, value);
    return meta;
  };

  // Update or create og:type
  updateMetaTag(
    'meta[property="og:type"]',
    'content',
    type,
    () => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:type');
      return meta;
    }
  );

  // Update or create og:title
  updateMetaTag(
    'meta[property="og:title"]',
    'content',
    fullTitle,
    () => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:title');
      return meta;
    }
  );

  // Update or create og:description
  if (description) {
    updateMetaTag(
      'meta[property="og:description"]',
      'content',
      description,
      () => {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:description');
        return meta;
      }
    );
  }

  // Update or create og:image
  updateMetaTag(
    'meta[property="og:image"]',
    'content',
    embedImageUrl,
    () => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:image');
      return meta;
    }
  );

  // Update or create og:image:width (recommended for better social sharing)
  updateMetaTag(
    'meta[property="og:image:width"]',
    'content',
    '1200',
    () => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:image:width');
      return meta;
    }
  );

  // Update or create og:image:height
  updateMetaTag(
    'meta[property="og:image:height"]',
    'content',
    '630',
    () => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:image:height');
      return meta;
    }
  );

  // Update or create og:image:alt
  if (title) {
    updateMetaTag(
      'meta[property="og:image:alt"]',
      'content',
      title,
      () => {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:image:alt');
        return meta;
      }
    );
  }

  // Update or create og:url
  updateMetaTag(
    'meta[property="og:url"]',
    'content',
    canonicalUrl,
    () => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:url');
      return meta;
    }
  );

  // Update or create twitter:card
  updateMetaTag(
    'meta[name="twitter:card"], meta[property="twitter:card"]',
    'content',
    'summary_large_image',
    () => {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'twitter:card');
      return meta;
    }
  );

  // Update or create twitter:title
  updateMetaTag(
    'meta[name="twitter:title"], meta[property="twitter:title"]',
    'content',
    fullTitle,
    () => {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'twitter:title');
      return meta;
    }
  );

  // Update or create twitter:description
  if (description) {
    updateMetaTag(
      'meta[name="twitter:description"], meta[property="twitter:description"]',
      'content',
      description,
      () => {
        const meta = document.createElement('meta');
        meta.setAttribute('name', 'twitter:description');
        return meta;
      }
    );
  }

  // Update or create twitter:image
  updateMetaTag(
    'meta[name="twitter:image"], meta[property="twitter:image"]',
    'content',
    embedImageUrl,
    () => {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'twitter:image');
      return meta;
    }
  );

  // Update or create twitter:url
  updateMetaTag(
    'meta[name="twitter:url"], meta[property="twitter:url"]',
    'content',
    canonicalUrl,
    () => {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'twitter:url');
      return meta;
    }
  );

  // Update or create meta description
  if (description) {
    updateMetaTag(
      'meta[name="description"]',
      'content',
      description,
      () => {
        const meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        return meta;
      }
    );
  }

  // Update or create canonical link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // Add structured data (JSON-LD) for better Google search
  let structuredData = document.querySelector('script[type="application/ld+json"]#seo-structured-data');
  if (!structuredData) {
    structuredData = document.createElement('script');
    structuredData.setAttribute('type', 'application/ld+json');
    structuredData.setAttribute('id', 'seo-structured-data');
    document.head.appendChild(structuredData);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : 'WebSite',
    name: fullTitle,
    description: description || '',
    url: canonicalUrl,
    ...(image && {
      image: embedImageUrl
    }),
    ...(type === 'article' && {
      headline: title,
      datePublished: new Date().toISOString()
    })
  };

  structuredData.textContent = JSON.stringify(jsonLd);
};

/**
 * Resets SEO tags to default homepage values
 */
export const resetSEOTags = () => {
  updateSEOTags({
    title: 'Awaiten • Creative Production Studio',
    description: 'A Bay Area-based production company with 7+ yrs experience & 1M+ views, capturing and sharing real stories with the world.',
    image: '/images/branding/embed.png',
    url: 'https://awaiten.com/',
    type: 'website'
  });
};
