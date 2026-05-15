// CDN base URL for image assets hosted on Cloudflare R2
const CDN_BASE = 'https://cdn.awaiten.com';

/**
 * Get an optimized image URL via Cloudflare Image Transforms.
 * Serves resized WebP/AVIF for display. Use getOriginalAssetPath() for downloads.
 *
 * @param {string} path - Image path like "/images/gallery/foo.jpg"
 * @param {object} opts - Transform options
 * @param {number} opts.width - Resize width (default: 1200)
 * @param {number} opts.quality - Quality 1-100 (default: 75)
 */
export const getAssetPath = (path, { width = 1200, quality = 75 } = {}) => {
  if (!path) return path;
  // Don't modify external URLs
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  // Ensure path has leading slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // Route image assets through Cloudflare Image Transforms.
  if (normalizedPath.startsWith('/images/')) {
    // Legacy gallery-optimized paths are no longer generated locally; Cloudflare
    // handles resizing/format conversion from the original gallery assets.
    const cdnPath = normalizedPath.startsWith('/images/gallery-optimized/')
      ? normalizedPath.replace('/images/gallery-optimized/', '/images/gallery/')
      : normalizedPath;
    return `${CDN_BASE}/cdn-cgi/image/width=${width},quality=${quality},format=auto${cdnPath}`;
  }

  return normalizedPath;
};

/**
 * Get the original full-resolution image URL (no transforms).
 * Use this for downloads and ZIP generation.
 */
export const getOriginalAssetPath = (path) => {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (normalizedPath.startsWith('/images/')) {
    // Preserve old data paths while downloading the canonical original.
    const cdnPath = normalizedPath.startsWith('/images/gallery-optimized/')
      ? normalizedPath.replace('/images/gallery-optimized/', '/images/gallery/')
      : normalizedPath;
    return `${CDN_BASE}${cdnPath}`;
  }

  return normalizedPath;
};
