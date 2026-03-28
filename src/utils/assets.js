// CDN base URL for image assets hosted on Cloudflare R2
const CDN_BASE = 'https://pub-fce304ab2fbe43ecb4b1a4c90fdb3bdc.r2.dev';

// Utility function to handle public asset paths with CDN
export const getAssetPath = (path) => {
  if (!path) return path;
  // Don't modify external URLs
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  // Ensure path has leading slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // Route image assets through CDN, skip gallery-optimized (use originals)
  if (normalizedPath.startsWith('/images/')) {
    const cdnPath = normalizedPath.startsWith('/images/gallery-optimized/')
      ? normalizedPath.replace('/images/gallery-optimized/', '/images/gallery/')
      : normalizedPath;
    return `${CDN_BASE}${cdnPath}`;
  }

  return normalizedPath;
};
