import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-primary overflow-x-hidden font-sans selection:bg-accent/30">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;

