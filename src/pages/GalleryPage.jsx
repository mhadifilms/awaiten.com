import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectBySlug } from '../utils/projects';
import { getAssetPath } from '../utils/assets';
import lightGallery from 'lightgallery';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import lgAutoplay from 'lightgallery/plugins/autoplay';
import lgShare from 'lightgallery/plugins/share';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-autoplay.css';
import 'lightgallery/css/lg-share.css';
import { FaDownload, FaShare, FaPlay, FaArrowUp, FaArrowLeft } from 'react-icons/fa';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import AnimatedHeading from '../components/ui/AnimatedHeading';
import MotionBox from '../components/ui/MotionBox';
import BlurReveal from '../components/ui/BlurReveal';
import { useToast } from '../context/ToastContext';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Masonry from 'react-masonry-css';

// Gallery Image Item Component
const GalleryImageItem = ({ image, index, projectTitle, selectedCategory }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const imagePath = getAssetPath(image);
  // Ensure absolute URL for lightGallery
  const absoluteImagePath = imagePath.startsWith('http') 
    ? imagePath 
    : `${window.location.origin}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  
  const handleImageLoad = (e) => {
    setImageLoaded(true);
    setImageDimensions({
      width: e.target.naturalWidth,
      height: e.target.naturalHeight
    });
  };

  return (
    <div className="mb-8">
      <div 
        data-src={absoluteImagePath}
        data-thumb={absoluteImagePath}
        className="gallery-item block overflow-hidden rounded-lg group cursor-zoom-in relative bg-gray-900"
        data-sub-html={`<h4>${projectTitle}</h4><p>Image ${index + 1}</p>`}
        data-download-url={absoluteImagePath}
      >
        {/* Loading placeholder - maintains aspect ratio */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-10">
            <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
          </div>
        )}
        
        {/* Image */}
        <img 
          alt={`Gallery image ${index + 1}`} 
          src={absoluteImagePath}
          className={`w-full h-auto transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={index < 9 ? "eager" : "lazy"}
          decoding="async"
          onLoad={handleImageLoad}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          style={{ 
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
            transition: 'opacity 0.5s ease-in-out, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'scale(1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 pointer-events-none" />
      </div>
    </div>
  );
};

const GalleryPage = () => {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  const galleryLgRef = useRef(null);
  const masonryContainerRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { addToast, updateToast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [downloadPin, setDownloadPin] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);
  
  // Get gallery images and categories (safe even if project is null) - memoized
  const allGalleryImages = useMemo(() => {
    return project?.gallery && Array.isArray(project.gallery) && project.gallery.length > 0 
      ? project.gallery 
      : project?.thumbnail ? Array(12).fill(project.thumbnail).map((src, i) => `${src}?v=${i}`) : [];
  }, [project?.gallery, project?.thumbnail]);
  
  const galleryCategories = useMemo(() => project?.galleryCategories || {}, [project?.galleryCategories]);
  const categoryNames = useMemo(() => Object.keys(galleryCategories).sort(), [galleryCategories]);
  
  // Filter images based on selected category - memoized
  const galleryImages = useMemo(() => {
    return selectedCategory === 'ALL' 
      ? allGalleryImages 
      : (galleryCategories[selectedCategory] || []);
  }, [selectedCategory, allGalleryImages, galleryCategories]);

  // Handle scroll for sticky header/button visibility - throttled for performance
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > window.innerHeight * 0.5);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize LightGallery when gallery images change
  useEffect(() => {
    if (!project) return;

    // Function to initialize LightGallery when DOM is ready
    const initLightGallery = () => {
      const masonryContainer = document.querySelector('.masonry-grid');
      if (!masonryContainer) return false;

      // Check if gallery items exist
      const galleryItems = masonryContainer.querySelectorAll('.gallery-item');
      if (galleryItems.length === 0) return false;

      // Destroy existing instance if it exists
      if (galleryLgRef.current) {
        try {
          galleryLgRef.current.destroy();
        } catch (e) {
          // Ignore destroy errors
        }
        galleryLgRef.current = null;
      }

      // Initialize new instance with performance optimizations
      try {
        // Ensure all gallery items have proper data attributes
        galleryItems.forEach((item) => {
          const img = item.querySelector('img');
          if (img) {
            const imgSrc = img.src || img.getAttribute('src') || '';
            // Ensure data-src is set (required for lightGallery)
            if (!item.getAttribute('data-src')) {
              item.setAttribute('data-src', imgSrc);
            }
            // Ensure data-thumb is set (required for thumbnails)
            if (!item.getAttribute('data-thumb')) {
              item.setAttribute('data-thumb', imgSrc);
            }
          }
        });

        galleryLgRef.current = lightGallery(masonryContainer, {
          plugins: [lgThumbnail, lgZoom, lgAutoplay, lgShare],
          speed: 500,
          selector: '.gallery-item',
          download: true,
          exThumbImage: 'data-thumb',
        });

        // Store instance globally so components can access it
        window.__lightGalleryInstance = galleryLgRef.current;
        return true;
      } catch (e) {
        console.error('Error initializing lightgallery:', e);
        return true; // Stop trying on error
      }
    };

    // Try to initialize immediately
    if (initLightGallery()) return;

    // If not ready, poll for elements (up to 2 seconds)
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (initLightGallery() || attempts > 40) {
        clearInterval(interval);
      }
    }, 50);

    return () => {
      clearInterval(interval);
      if (galleryLgRef.current) {
        try {
          galleryLgRef.current.destroy();
        } catch (e) {
          // Ignore destroy errors
        }
        galleryLgRef.current = null;
      }
    };
  }, [galleryImages, selectedCategory, project?.slug]);

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

  // Get gallery settings
  const gallerySettings = project.gallerySettings || {};
  const downloadDisabled = gallerySettings.downloadDisabled === true;
  const requiresDownloadPin = gallerySettings.downloadPin && gallerySettings.downloadPin.length > 0;
  const coverPhoto = gallerySettings.coverPhoto || project.thumbnail;

  // No need for separate thumbnails - use native lazy loading and responsive images

  const scrollToGallery = () => {
    const masonryContainer = document.querySelector('.masonry-grid');
    masonryContainer?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownload = async () => {
    if (isDownloading || downloadDisabled) return;
    
    // Check for download pin if required
    if (requiresDownloadPin) {
      if (!showPinInput) {
        setShowPinInput(true);
        return;
      }
      
      if (downloadPin !== gallerySettings.downloadPin) {
        addToast('Incorrect pin. Please try again.', 'error', 3000);
        setDownloadPin('');
        return;
      }
    }
    
    setIsDownloading(true);
    setShowPinInput(false);
    // 0 duration so it stays until we update it
    const toastId = addToast('Preparing download...', 'loading', 0);

    try {
      const zip = new JSZip();
      const folder = zip.folder(project.title.replace(/\s+/g, '_'));
      
      // Always download ALL images, not just filtered ones
      const imagesToDownload = allGalleryImages;
      
      // Limit parallel downloads to prevent browser hanging
      const CHUNK_SIZE = 5;
      const totalImages = imagesToDownload.length;
      let downloadedCount = 0;

      for (let i = 0; i < totalImages; i += CHUNK_SIZE) {
        const chunk = imagesToDownload.slice(i, i + CHUNK_SIZE);
        
        await Promise.all(chunk.map(async (imageUrl) => {
          try {
            const response = await fetch(getAssetPath(imageUrl));
            const blob = await response.blob();
            const filename = imageUrl.split('/').pop();
            folder.file(filename, blob);
            downloadedCount++;
            
            // Update toast with progress every 5 images or when done
            if (downloadedCount % 5 === 0 || downloadedCount === totalImages) {
               updateToast(toastId, `Downloading images (${downloadedCount}/${totalImages})...`, 'loading', 0);
            }
          } catch (err) {
            console.error(`Failed to download image: ${imageUrl}`, err);
          }
        }));
      }

      updateToast(toastId, 'Zipping files...', 'loading', 0);
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${project.title.replace(/\s+/g, '_')}.zip`);
      
      updateToast(toastId, 'Download started!', 'success', 4000);
    } catch (error) {
      console.error('Download failed:', error);
      updateToast(toastId, 'Failed to generate zip file. Please try again.', 'error', 5000);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: `Check out the gallery: ${project.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Share URL copied to clipboard!', 'success');
    }
  };

  const startSlideshow = () => {
    if (galleryLgRef.current) {
      galleryLgRef.current.openGallery(0);
    } else {
      const firstImage = document.querySelector('.gallery-item');
      if (firstImage) firstImage.click();
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary font-sans selection:bg-accent selection:text-white">
      
      {/* Navigation / Sticky Header */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md border-b border-white/5' : ''}`}>
        <Container className={`transition-all duration-300 ${isScrolled ? 'py-3' : 'py-6'}`}>
          {/* Top Row: Navigation */}
          <div className="flex justify-between items-center mb-2">
            <Link to="/photography" className="flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-gray-400 hover:text-white transition-colors group">
              <div className="p-2 rounded-full transition-colors">
                <FaArrowLeft className="text-xs text-gray-300" />
              </div>
              <span className="text-white/80 group-hover:text-white">Home</span>
            </Link>
            
            {/* Center Title - Fades in on scroll */}
            <div className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
              <span className="text-sm font-bold tracking-wider hidden md:block">{project.title}</span>
            </div>

            {/* Right Actions - Fade in on scroll */}
            <div className={`flex gap-2 transition-all duration-300 ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
               {!downloadDisabled && (
                 <button 
                    onClick={handleDownload} 
                    disabled={isDownloading}
                    className="p-2 text-white/70 hover:text-white transition-colors" 
                    aria-label="Download"
                    title="Download All"
                 >
                   {isDownloading ? (
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : (
                     <FaDownload className="text-sm" />
                   )}
                 </button>
               )}
               <button onClick={handleShare} className="p-2 text-white/70 hover:text-white transition-colors" aria-label="Share" title="Share">
                 <FaShare className="text-sm" />
               </button>
               <button onClick={startSlideshow} className="p-2 text-white/70 hover:text-white transition-colors" aria-label="Slideshow" title="Slideshow">
                 <FaPlay className="text-xs" />
               </button>
            </div>
          </div>
          
          {/* Category Tabs - Show when scrolled */}
          {isScrolled && categoryNames.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 pt-2 border-t border-white/5">
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  document.querySelector('.masonry-grid')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`text-xs tracking-widest uppercase px-3 py-1 transition-colors ${
                  selectedCategory === 'ALL' 
                    ? 'text-white border-b border-white' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                ALL
              </button>
              {categoryNames.map(category => {
                const count = galleryCategories[category]?.length || 0;
                if (count === 0) return null;
                
                // Format category name for display (replace underscores, capitalize)
                const displayName = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                
                return (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      document.querySelector('.masonry-grid')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`text-xs tracking-widest uppercase px-3 py-1 transition-colors ${
                      selectedCategory === category 
                        ? 'text-white border-b border-white' 
                        : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {displayName}
                  </button>
                );
              })}
            </div>
          )}
        </Container>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[90vh] w-full overflow-hidden flex items-end pb-20">
        <div className="absolute inset-0">
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img 
              src={getAssetPath(coverPhoto)} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          </MotionBox>
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
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80">
                    {project.title}
                  </span>
                </h1>
                
                <div className="flex flex-wrap gap-4 items-center">
                  <Button onClick={scrollToGallery} variant="primary">
                    View Gallery
                  </Button>
                  
                  <div className="flex gap-2">
                    {!downloadDisabled && (
                      <button 
                        onClick={handleDownload} 
                        disabled={isDownloading}
                        className={`p-3 rounded-full border border-white/20 hover:bg-white/10 hover:border-white text-white transition-all ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                        aria-label="Download"
                      >
                        {isDownloading ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <FaDownload />
                        )}
                      </button>
                    )}
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

      {/* Download Pin Input Modal */}
      {showPinInput && requiresDownloadPin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-background border border-white/10 rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Enter Download Pin</h3>
            <input
              type="password"
              value={downloadPin}
              onChange={(e) => setDownloadPin(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleDownload();
                }
              }}
              placeholder="Enter pin"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors"
              >
                Download
              </button>
              <button
                onClick={() => {
                  setShowPinInput(false);
                  setDownloadPin('');
                }}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="py-20 md:py-32 min-h-screen bg-background relative z-20">
        <Container>
          {/* Category Filter Bar - Only show when not scrolled (tabs are in nav bar when scrolled) */}
          {!isScrolled && categoryNames.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-16">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`text-sm tracking-widest uppercase px-3 py-2 transition-colors ${
                  selectedCategory === 'ALL' 
                    ? 'text-white border-b border-white' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                ALL
              </button>
              {categoryNames.map(category => {
                const count = galleryCategories[category]?.length || 0;
                if (count === 0) return null;
                
                // Format category name for display (replace underscores, capitalize)
                const displayName = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`text-sm tracking-widest uppercase px-3 py-2 transition-colors ${
                      selectedCategory === category 
                        ? 'text-white border-b border-white' 
                        : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {displayName}
                  </button>
                );
              })}
            </div>
          )}
          
          <Masonry
            breakpointCols={{
              default: 3,
              1024: 3,
              768: 2,
              640: 1
            }}
            className="masonry-grid"
            columnClassName="masonry-grid_column"
            ref={masonryContainerRef}
          >
            {galleryImages.map((image, index) => (
              <GalleryImageItem
                key={`${selectedCategory}-${image}-${index}`}
                image={image}
                index={index}
                projectTitle={project.title}
                selectedCategory={selectedCategory}
              />
            ))}
          </Masonry>
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
