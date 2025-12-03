import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProjectDetailPage from './pages/ProjectDetail';
import GalleryPage from './pages/GalleryPage';
import Manifesto from './pages/Manifesto';
import Podcast from './pages/Podcast';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';
import SubdomainRedirect from './components/SubdomainRedirect';
import { ToastProvider } from './context/ToastContext';

// Check for subdomain redirect before React Router initializes
function checkSubdomainRedirect() {
  const hostname = window.location.hostname.toLowerCase();
  
  if (hostname === 'gallery.awaiten.com' || hostname === 'www.gallery.awaiten.com') {
    // Get the current pathname
    let currentPath = window.location.pathname;
    
    // Remove basename if present
    if (currentPath.startsWith('/awaiten.com')) {
      currentPath = currentPath.replace('/awaiten.com', '');
    }
    
    // Remove leading/trailing slashes
    currentPath = currentPath.replace(/^\/+/, '').replace(/\/+$/, '');
    
    // If we're at the root, redirect to photography page
    if (!currentPath || currentPath === '') {
      window.location.replace('https://awaiten.com/photography');
      return true; // Indicate redirect happened
    }
    
    // Redirect to the main domain with photography path
    const redirectUrl = `https://awaiten.com/photography/${currentPath}`;
    window.location.replace(redirectUrl);
    return true; // Indicate redirect happened
  }
  
  return false; // No redirect needed
}

function App() {
  // Check for redirect before rendering Router
  if (checkSubdomainRedirect()) {
    // Return null while redirecting
    return null;
  }

  return (
    <ReactLenis root>
      <ToastProvider>
        <Router basename="/awaiten.com">
          <SubdomainRedirect />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/manifesto" element={<Layout><Manifesto /></Layout>} />
            <Route path="/podcast" element={<Layout><Podcast /></Layout>} />
            <Route path="/documentary" element={<Layout><CategoryPage category="Documentary" /></Layout>} />
            <Route path="/documentary/:slug" element={<Layout><ProjectDetailPage category="documentary" /></Layout>} />
            <Route path="/photography" element={<Layout><CategoryPage category="Photography" /></Layout>} />
            <Route path="/photography/:slug" element={<GalleryPage />} />
            <Route path="/production" element={<Layout><CategoryPage category="Production" /></Layout>} />
            <Route path="/production/:slug" element={<Layout><ProjectDetailPage category="production" /></Layout>} />
            <Route path="/commercial" element={<Layout><CategoryPage category="Commercial" /></Layout>} />
            <Route path="/commercial/:slug" element={<Layout><ProjectDetailPage category="commercial" /></Layout>} />
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </Router>
      </ToastProvider>
    </ReactLenis>
  );
}

export default App;
