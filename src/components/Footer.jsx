import React from 'react';
import Container from './ui/Container';
import { Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-[#F5F5F5] py-12 md:py-16 overflow-hidden">
      {/* Large Background Text */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none select-none z-0">
        <h2 className="text-[20vw] md:text-[15vw] font-black text-gray-200/30 whitespace-nowrap tracking-tighter leading-none">
          AWAITEN
        </h2>
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright - Left */}
          <p className="text-gray-700 text-sm md:text-base">
            © Copyright {new Date().getFullYear()}
          </p>
          
          {/* Social Media Icons - Center */}
          <div className="flex items-center gap-6">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="YouTube"
            >
              <Youtube size={24} />
            </a>
          </div>
          
          {/* Made By - Right */}
          <p className="text-gray-700 text-sm md:text-base">
            Made by Aalyan and M Hadi
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

