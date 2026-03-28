import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    // Only scroll to top if there's no hash (anchor link)
    // If there is a hash, the browser or our custom handling will take care of it
    if (!hash) {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    } else {
      // Handle hash navigation on page load/change
      setTimeout(() => {
        if (lenis) {
          lenis.scrollTo(hash);
        } else {
          const element = document.getElementById(hash.replace('#', ''));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
    }
  }, [pathname, hash, lenis]);

  return null;
};

export default ScrollToTop;
