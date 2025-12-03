import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Documentary from './pages/Documentary';
import Photography from './pages/Photography';
import Production from './pages/Production';
import Commercial from './pages/Commercial';
import ProjectDetailPage from './pages/ProjectDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/documentary" element={<Layout><Documentary /></Layout>} />
        <Route path="/documentary/:slug" element={<Layout><ProjectDetailPage /></Layout>} />
        <Route path="/photography" element={<Layout><Photography /></Layout>} />
        <Route path="/photography/:slug" element={<Layout><ProjectDetailPage /></Layout>} />
        <Route path="/production" element={<Layout><Production /></Layout>} />
        <Route path="/production/:slug" element={<Layout><ProjectDetailPage /></Layout>} />
        <Route path="/commercial" element={<Layout><Commercial /></Layout>} />
        <Route path="/commercial/:slug" element={<Layout><ProjectDetailPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
