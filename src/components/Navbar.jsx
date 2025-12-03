import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLenis } from 'lenis/react';
import Container from './ui/Container';
import Button from './ui/Button';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      // Update active section
      const sections = ['home', 'work', 'about', 'testimonials'];
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      if (location.pathname === '/') {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(href);
        } else {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      } else {
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
    <>
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        {/* Content */}
        <div 
          className="relative flex items-center justify-between pl-6 pr-6 md:pr-2 py-2 rounded-full pointer-events-auto w-full max-w-3xl transition-all duration-300 ease-in-out"
          style={{
            background: isScrolled ? 'linear-gradient(to bottom, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.6))' : 'transparent',
            backdropFilter: isScrolled ? 'blur(12px) saturate(180%)' : 'none',
            WebkitBackdropFilter: isScrolled ? 'blur(12px) saturate(180%)' : 'none',
            border: isScrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
            boxShadow: isScrolled ? '0 20px 40px -12px rgba(0, 0, 0, 0.3)' : 'none',
          }}
        >
          <Link 
            to="/" 
            className="flex items-center gap-3 z-10"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                if (lenis) {
                  lenis.scrollTo(0);
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }
            }}
          >
            {/* Text Logo */}
            <img 
              src="/awaiten.com/images/branding/TextLogo.png" 
              alt="Awaiten Productions" 
              className="h-8 md:h-9 object-contain" 
            />
          </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === (link.hash ? link.hash.replace('#', '') : 'home');
            return (
              <Link 
                key={link.name} 
                to={link.hash ? link.hash : link.href}
                onClick={(e) => handleNavClick(e, link.hash || link.href)}
                className={`text-sm font-medium transition-colors relative z-10 ${
                  isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <Link 
            to="/#contact" 
            className="relative z-10"
            onClick={(e) => handleNavClick(e, '#contact')}
          >
            <Button variant="primary" className="px-6 py-2.5 text-sm font-medium rounded-full bg-white text-black hover:bg-gray-100 transition-colors">
              Let's Talk
            </Button>
          </Link>
        </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-white relative z-10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Full Screen Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-[#020617] z-40 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        } md:hidden flex flex-col items-center justify-center`}
      >
        <div className="flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.hash ? link.hash : link.href}
              onClick={(e) => handleNavClick(e, link.hash || link.href)}
              className="text-xl font-medium text-white hover:text-gray-300 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link 
            to="/#contact" 
            onClick={(e) => handleNavClick(e, '#contact')}
          >
            <span className="text-xl font-medium text-white hover:text-gray-300 transition-colors">Let's Talk</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
