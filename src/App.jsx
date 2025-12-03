import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProjectDetailPage from './pages/ProjectDetail';
import Manifesto from './pages/Manifesto';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <ReactLenis root>
      <Router basename="/awaiten.com">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/manifesto" element={<Layout><Manifesto /></Layout>} />
          <Route path="/documentary" element={<Layout><CategoryPage category="Documentary" /></Layout>} />
          <Route path="/documentary/:slug" element={<Layout><ProjectDetailPage category="documentary" /></Layout>} />
          <Route path="/photography" element={<Layout><CategoryPage category="Photography" /></Layout>} />
          <Route path="/photography/:slug" element={<Layout><ProjectDetailPage category="photography" /></Layout>} />
          <Route path="/production" element={<Layout><CategoryPage category="Production" /></Layout>} />
          <Route path="/production/:slug" element={<Layout><ProjectDetailPage category="production" /></Layout>} />
          <Route path="/commercial" element={<Layout><CategoryPage category="Commercial" /></Layout>} />
          <Route path="/commercial/:slug" element={<Layout><ProjectDetailPage category="commercial" /></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </Router>
    </ReactLenis>
  );
}

export default App;
