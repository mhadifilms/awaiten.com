import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component to handle redirects from gallery.awaiten.com/{name} to awaiten.com/photography/{name}
 * This component should be placed inside the Router to access location
 */
const SubdomainRedirect = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if we're on the gallery subdomain
    const hostname = window.location.hostname.toLowerCase();
    
    if (hostname === 'gallery.awaiten.com' || hostname === 'www.gallery.awaiten.com') {
      // Get the current pathname
      let currentPath = location.pathname;
      
      // Remove basename if present
      if (currentPath.startsWith('/awaiten.com')) {
        currentPath = currentPath.replace('/awaiten.com', '');
      }
      
      // Remove leading/trailing slashes
      currentPath = currentPath.replace(/^\/+/, '').replace(/\/+$/, '');
      
      // If we're at the root, redirect to photography page
      if (!currentPath || currentPath === '') {
        window.location.replace('https://awaiten.com/photography');
        return;
      }
      
      // Redirect to the main domain with photography path
      const redirectUrl = `https://awaiten.com/photography/${currentPath}`;
      
      // Use replace to avoid adding to history
      window.location.replace(redirectUrl);
    }
  }, [location.pathname]);

  return null; // This component doesn't render anything
};

export default SubdomainRedirect;

