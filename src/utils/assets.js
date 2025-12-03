// Utility function to handle public asset paths with base URL
export const getAssetPath = (path) => {
  if (!path) return path;
  // Don't modify external URLs
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  
  // Get base URL from Vite env
  const baseUrl = import.meta.env.BASE_URL || '/';
  
  // Remove trailing slash from baseUrl if present
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // Ensure path has leading slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Combine: if baseUrl is '/', just return the path; otherwise prepend baseUrl
  return normalizedBase === '/' ? normalizedPath : `${normalizedBase}${normalizedPath}`;
};

