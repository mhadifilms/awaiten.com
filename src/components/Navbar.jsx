import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Container from './ui/Container';
import Button from './ui/Button';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      // Handle hash links for same-page navigation
      if (location.pathname === '/') {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // If not on home page, navigate to home first
        e.preventDefault();
        window.location.href = `/${href}`;
      }
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', href: '/', hash: '#home' },
    { name: 'Our Work', href: '/', hash: '#work' },
    { name: 'About', href: '/', hash: '#about' },
    { name: 'Testimonials', href: '/', hash: '#testimonials' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Frosted Glass Background - Subtle translucent overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'rgba(2, 6, 23, 0.3)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      />
      
      {/* Content */}
      <div className="relative">
        <Container className="flex items-center justify-between py-4 md:py-5">
          <Link to="/" className="flex items-center gap-2 z-10">
            {/* Logo A Icon */}
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight leading-none">awaiten</span>
              <span className="text-xs text-gray-300 font-normal leading-none">productions</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.hash ? link.hash : link.href}
                onClick={(e) => handleNavClick(e, link.hash || link.href)}
                className="text-sm font-medium text-white hover:text-gray-300 transition-colors relative z-10"
              >
                {link.name}
              </Link>
            ))}
            <Link to="/#contact" className="relative z-10">
              <Button variant="primary" className="px-6 py-2.5 text-sm rounded-full">Let's Talk</Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-white relative z-10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </Container>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden absolute top-full left-0 right-0 p-4 flex flex-col gap-4"
            style={{
              background: 'rgba(2, 6, 23, 0.85)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.hash ? link.hash : link.href}
                onClick={(e) => handleNavClick(e, link.hash || link.href)}
                className="text-base font-medium text-white hover:text-gray-300 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link to="/#contact">
              <Button variant="primary" className="w-full">Let's Talk</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
