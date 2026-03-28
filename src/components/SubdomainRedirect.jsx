import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component to handle redirects from gallery.awaiten.com to awaiten.com/photography/{name}
 * This component should be placed inside the Router to access location
 */
const SubdomainRedirect = () => {
  const location = useLocation();

  useEffect(() => {
    const hostname = window.location.hostname.toLowerCase();
    
    // Redirect gallery subdomain to main domain photography section
    if (hostname === 'gallery.awaiten.com' || hostname === 'www.gallery.awaiten.com') {
      let currentPath = location.pathname;
      currentPath = currentPath.replace(/^\/+/, '').replace(/\/+$/, '');
      
      if (!currentPath || currentPath === '') {
        window.location.replace('https://awaiten.com/photography');
        return;
      }
      
      window.location.replace(`https://awaiten.com/photography/${currentPath}`);
    }
  }, [location.pathname]);

  return null; // This component doesn't render anything
};

export default SubdomainRedirect;

