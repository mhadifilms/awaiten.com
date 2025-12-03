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
import { FaDownload, FaShare, FaPlay, FaArrowUp, FaArrowLeft } from 'react-icons/fa';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import AnimatedHeading from '../components/ui/AnimatedHeading';
import MotionBox from '../components/ui/MotionBox';

const GalleryPage = () => {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  const galleryRef = useRef(null);
  const lightboxRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for sticky header/button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
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
      <div className="min-h-screen flex items-center justify-center bg-background text-primary">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Gallery Not Found</h1>
          <Link to="/" className="text-accent hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  // Use project gallery or fallbacks if empty for prototyping
  const galleryImages = project.gallery && Array.isArray(project.gallery) && project.gallery.length > 0 
    ? project.gallery 
    : Array(12).fill(project.thumbnail || '/images/cms/placeholder-tanzania.jpg').map((src, i) => `${src}?v=${i}`);

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownload = () => {
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
    const firstImage = document.querySelector('.gallery-item');
    if (firstImage) firstImage.click();
  };

  return (
    <div className="min-h-screen bg-background text-primary font-sans selection:bg-accent selection:text-white">
      
      {/* Navigation / Back Button */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md py-4 border-b border-white/10' : 'py-6'}`}>
        <Container className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-gray-400 hover:text-white transition-colors">
            <FaArrowLeft className="text-xs" />
            <span>Home</span>
          </Link>
          
          <div className={`transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-sm font-bold tracking-wider">{project.title}</span>
          </div>

          <div className="flex gap-4">
             {/* Placeholder for future nav items if needed */}
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[90vh] w-full overflow-hidden flex items-end pb-20">
        <div className="absolute inset-0">
          <img 
            src={getAssetPath(project.thumbnail)} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <Container className="relative z-10 w-full">
          <div className="max-w-4xl">
             <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
             >
                {project.duration && (
                  <p className="text-accent text-sm md:text-base font-medium tracking-[0.2em] uppercase mb-6">
                    {project.duration}
                  </p>
                )}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none mb-8">
                  {project.title}
                </h1>
                
                <div className="flex flex-wrap gap-4 items-center">
                  <Button onClick={scrollToGallery} variant="primary">
                    View Gallery
                  </Button>
                  
                  <div className="flex gap-2">
                    <button onClick={handleDownload} className="p-3 rounded-full border border-white/20 hover:bg-white/10 hover:border-white text-white transition-all" aria-label="Download">
                      <FaDownload />
                    </button>
                    <button onClick={handleShare} className="p-3 rounded-full border border-white/20 hover:bg-white/10 hover:border-white text-white transition-all" aria-label="Share">
                      <FaShare />
                    </button>
                    <button onClick={startSlideshow} className="p-3 rounded-full border border-white/20 hover:bg-white/10 hover:border-white text-white transition-all" aria-label="Slideshow">
                      <FaPlay />
                    </button>
                  </div>
                </div>
             </MotionBox>
          </div>
        </Container>
      </div>

      {/* Gallery Grid */}
      <div ref={galleryRef} className="py-20 md:py-32 min-h-screen bg-background relative z-20">
        <Container>
          <LightGallery
            speed={500}
            plugins={[lgThumbnail, lgZoom, lgAutoplay, lgShare]}
            elementClassNames="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
            onInit={(ref) => {
              lightboxRef.current = ref.instance;
            }}
          >
            {galleryImages.map((image, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index % 3 * 0.1 }}
                className="break-inside-avoid"
              >
                <a 
                  href={getAssetPath(image)}
                  className="gallery-item block overflow-hidden rounded-lg group cursor-zoom-in relative"
                  data-sub-html={`<h4>${project.title}</h4><p>Image ${index + 1}</p>`}
                >
                  <img 
                    alt={`Gallery image ${index + 1}`} 
                    src={getAssetPath(image)}
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />
                </a>
              </MotionBox>
            ))}
          </LightGallery>
        </Container>
      </div>

      {/* Footer */}
      <footer className="bg-black/50 py-12 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-2xl font-bold text-white mb-4">{project.title}</h3>
          <p className="text-gray-400 text-sm mb-8">{project.duration}</p>
          
          <div className="flex justify-center space-x-6 mb-12">
             <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center text-gray-500 hover:text-white transition-colors">
               <FaArrowUp className="mb-2" />
               <span className="text-[10px] uppercase tracking-widest">Back to Top</span>
             </button>
          </div>
          
          <div className="text-gray-600 text-[10px] uppercase tracking-widest">
            <Link to="/" className="hover:text-gray-400 transition-colors">
              &copy; {new Date().getFullYear()} Awaiten Films
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GalleryPage;