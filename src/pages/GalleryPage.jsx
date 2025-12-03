import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectBySlug } from '../utils/projects';
import { getAssetPath } from '../utils/assets';
import LightGallery from 'lightgallery/react';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import lgAutoplay from 'lightgallery/plugins/autoplay';
import lgShare from 'lightgallery/plugins/share';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-autoplay.css';
import 'lightgallery/css/lg-share.css';
import { motion } from 'framer-motion';
import { FaDownload, FaShare, FaPlay, FaArrowUp } from 'react-icons/fa';

const GalleryPage = () => {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  const galleryRef = useRef(null);
  const lightboxRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for sticky header/button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight - 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Gallery Not Found</h1>
          <Link to="/" className="text-blue-600 hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  // Use project gallery or fallbacks if empty for prototyping
  const galleryImages = project.gallery && Array.isArray(project.gallery) && project.gallery.length > 0 
    ? project.gallery 
    : Array(12).fill(project.thumbnail || '/images/cms/placeholder-tanzania.jpg').map((src, i) => `${src}?v=${i}`); // Mock images for prototype

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownload = () => {
    // In a real scenario, this would trigger a zip download or open a modal
    alert("Download functionality would go here (e.g., zip file of all images).");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: `Check out the gallery: ${project.title}`,
        url: window.location.href,
      });
    } else {
      alert("Share URL copied to clipboard!");
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const startSlideshow = () => {
    // Programmatically open LightGallery in slideshow mode
    // Note: This is tricky with the React component wrapper, usually we just let the user click an image
    // But we can simulate a click on the first image
    const firstImage = document.querySelector('.gallery-item');
    if (firstImage) firstImage.click();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={getAssetPath(project.thumbnail)} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-wider mb-4 uppercase">
              {project.title}
            </h1>
            <p className="text-lg md:text-xl font-light tracking-widest mb-12 opacity-90">
              {project.duration}
            </p>
            
            <button 
              onClick={scrollToGallery}
              className="px-8 py-3 border-2 border-white text-white text-sm font-semibold tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 uppercase"
            >
              View Gallery
            </button>
          </motion.div>
        </div>
        
        <div className="absolute top-6 w-full text-center">
           <Link to="/" className="text-white/80 text-xs tracking-[0.2em] uppercase hover:text-white transition-colors">
             Gallery by Awaiten
           </Link>
        </div>
      </div>

      {/* Action Bar (Sticky-ish) */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 py-4 px-6 shadow-sm flex justify-center md:justify-between items-center">
        <div className="hidden md:block text-sm font-medium tracking-widest uppercase text-gray-500">
          {project.title}
        </div>
        <div className="flex space-x-8 text-gray-600">
          <button onClick={handleDownload} className="flex items-center space-x-2 hover:text-black transition-colors text-xs uppercase tracking-wider font-medium group">
            <FaDownload className="text-sm group-hover:-translate-y-0.5 transition-transform" />
            <span>Download</span>
          </button>
          <button onClick={handleShare} className="flex items-center space-x-2 hover:text-black transition-colors text-xs uppercase tracking-wider font-medium group">
            <FaShare className="text-sm group-hover:-translate-y-0.5 transition-transform" />
            <span>Share</span>
          </button>
          <button onClick={startSlideshow} className="flex items-center space-x-2 hover:text-black transition-colors text-xs uppercase tracking-wider font-medium group">
            <FaPlay className="text-sm group-hover:-translate-y-0.5 transition-transform" />
            <span>Slideshow</span>
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div ref={galleryRef} className="max-w-[1600px] mx-auto px-4 py-16 md:py-24 bg-white">
        <LightGallery
          speed={500}
          plugins={[lgThumbnail, lgZoom, lgAutoplay, lgShare]}
          elementClassNames="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4"
          onInit={(ref) => {
            lightboxRef.current = ref.instance;
          }}
        >
          {galleryImages.map((image, index) => (
            <a 
              key={index}
              href={getAssetPath(image)}
              className="gallery-item block overflow-hidden group cursor-zoom-in mb-4 break-inside-avoid"
              data-sub-html={`<h4>${project.title}</h4><p>Image ${index + 1}</p>`}
            >
              <img 
                alt={`Gallery image ${index + 1}`} 
                src={getAssetPath(image)}
                className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
            </a>
          ))}
        </LightGallery>
        
        {/* Load More / Pagination (Optional) */}
        {/* <div className="mt-16 text-center">
          <button className="px-8 py-3 border border-gray-300 text-gray-600 text-xs tracking-widest uppercase hover:border-gray-900 hover:text-gray-900 transition-colors">
            Load More
          </button>
        </div> */}
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-2xl font-light text-gray-800 mb-4">{project.title}</h3>
          <p className="text-gray-500 text-sm mb-8">{project.duration}</p>
          
          <div className="flex justify-center space-x-6 mb-12">
             <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center text-gray-400 hover:text-gray-800 transition-colors">
               <FaArrowUp className="mb-2" />
               <span className="text-[10px] uppercase tracking-widest">Back to Top</span>
             </button>
          </div>
          
          <div className="text-gray-400 text-[10px] uppercase tracking-widest">
            <Link to="/" className="hover:text-gray-600 transition-colors">
              &copy; {new Date().getFullYear()} Gallery by Awaiten
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GalleryPage;

