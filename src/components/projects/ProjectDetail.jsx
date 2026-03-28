import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ImageWithFallback from '../ui/ImageWithFallback';
import MotionBox from '../ui/MotionBox';
import Container from '../ui/Container';
import { getAssetPath } from '../../utils/assets';

// Helper function to get optimized image path for display (fast loading)
const getOptimizedImagePath = (imagePath) => {
  // Use optimized version if it exists, otherwise fallback to original
  if (imagePath.startsWith('/images/gallery/')) {
    const optimizedPath = imagePath.replace('/images/gallery/', '/images/gallery-optimized/');
    return getAssetPath(optimizedPath);
  }
  return getAssetPath(imagePath);
};

// Helper function to get original full-res image path for downloads
const getOriginalImagePath = (imagePath) => {
  // Always use original for downloads
  return getAssetPath(imagePath);
};
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import lightGallery from 'lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';

// Helper function to process HTML content and fix image paths
const processHtmlContent = (html) => {
  if (!html) return html;
  let processed = html;
  
  // Remove empty heading tags with only <br> or whitespace (e.g., <h1><br></h1>, <h1> </h1>)
  // But be careful - only remove if they're truly empty and not adjacent to iframes
  processed = processed.replace(/<h1>\s*<br\s*\/?>\s*<\/h1>/gi, '');
  
  // Remove empty paragraph tags with only <br> or whitespace
  // But preserve paragraphs that contain iframes or other content
  processed = processed.replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, '');
  
  // Replace all /images/ paths with getAssetPath processed paths
  processed = processed.replace(/src="(\/images\/[^"]+)"/g, (match, path) => {
    return `src="${getAssetPath(path)}"`;
  });
  
  return processed;
};

const ProjectDetail = ({ project }) => {
  const galleryRef = useRef(null);
  const contentLgRef = useRef(null);
  const projectGalleryLgRef = useRef(null);

  // Custom ESC handler for instant close
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        const lgContainer = document.querySelector('.lg-container.lg-show');
        if (lgContainer) {
          e.preventDefault();
          e.stopPropagation();
          if (contentLgRef.current) {
            try {
              contentLgRef.current.closeGallery();
            } catch {
              // Ignore errors
            }
          }
          if (projectGalleryLgRef.current) {
            try {
              projectGalleryLgRef.current.closeGallery();
            } catch {
              // Ignore errors
            }
          }
        }
      }
    };
    document.addEventListener('keydown', handleEscKey, true);
    return () => {
      document.removeEventListener('keydown', handleEscKey, true);
    };
  }, []);
  const contentRef = useRef(null);

  // Set page title and meta tags
  useEffect(() => {
    document.title = `${project.title} • Awaiten`;

    // Get cover photo for embed image
    const gallerySettings = project.gallerySettings || {};
    const coverPhoto = gallerySettings.coverPhoto || project.thumbnail;
    const embedImagePath = coverPhoto ? getAssetPath(coverPhoto) : getAssetPath('/images/branding/embed.png');
    // Construct absolute URL for meta tags (needed for external services)
    const embedImageUrl = embedImagePath.startsWith('http') 
      ? embedImagePath 
      : new URL(embedImagePath, window.location.origin).href;

    // Update or create og:image meta tag
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute('content', embedImageUrl);

    // Update or create twitter:image meta tag
    let twitterImage = document.querySelector('meta[name="twitter:image"], meta[property="twitter:image"]');
    if (!twitterImage) {
      twitterImage = document.createElement('meta');
      twitterImage.setAttribute('name', 'twitter:image');
      document.head.appendChild(twitterImage);
    }
    twitterImage.setAttribute('content', embedImageUrl);

    // Update or create og:title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', `${project.title} • Awaiten`);

    // Update or create twitter:title
    let twitterTitle = document.querySelector('meta[name="twitter:title"], meta[property="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.setAttribute('content', `${project.title} • Awaiten`);

    // Update or create og:description
    const description = project.about 
      ? project.about.replace(/<[^>]*>/g, '').trim().substring(0, 200)
      : `View ${project.title} by Awaiten`;
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', description);

    // Update or create twitter:description
    let twitterDescription = document.querySelector('meta[name="twitter:description"], meta[property="twitter:description"]');
    if (!twitterDescription) {
      twitterDescription = document.createElement('meta');
      twitterDescription.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDescription);
    }
    twitterDescription.setAttribute('content', description);

    // Update og:url
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', window.location.href);

    return () => {
      document.title = "Awaiten • Creative Production Studio";
    };
  }, [project]);

  useEffect(() => {
    // Handle Content Images (Grouping & Lightbox)
    if (project.content && contentRef.current) {
      const contentDiv = contentRef.current;
      
      // Use setTimeout to ensure DOM is fully rendered before processing
      const timeoutId = setTimeout(() => {
        processContent();
      }, 100);
      
      function processContent() {
      
      const children = Array.from(contentDiv.children);
      let mediaGroup = [];

      const isMedia = (node) => {
        // Check if node is img
        if (node.tagName === 'IMG') return true;
        // Check if node is a wrapper (p, figure, div) containing only an image
        // But exclude if it contains iframes (those are handled separately)
        if (['P', 'FIGURE', 'DIV'].includes(node.tagName)) {
          // Skip if it contains iframes
          if (node.querySelector('iframe')) {
            return false;
          }
          const img = node.querySelector('img');
          // Must have an image and no significant text content
          if (img && node.textContent.trim().length === 0) {
            return true;
          }
        }
        return false;
      };

      const wrapGroup = (group) => {
        if (group.length < 2) return;
        
        // Filter out nodes that are descendants of other nodes in the group
        const topLevelNodes = group.filter(node => {
          return !group.some(otherNode => 
            otherNode !== node && otherNode.contains(node)
          );
        });
        
        if (topLevelNodes.length < 2) return;
        
        // Verify all nodes are still valid and in the DOM
        const validNodes = topLevelNodes.filter(node => 
          node && node.parentNode && document.contains(node)
        );
        
        if (validNodes.length < 2) return;
        
        // Collect parent and position info before modifying DOM
        const firstNode = validNodes[0];
        const parent = firstNode.parentNode;
        
        // Make sure parent exists and is valid
        if (!parent || 
            validNodes.includes(parent) || 
            !document.contains(parent) ||
            validNodes.some(node => node.contains(parent))) {
          return;
        }
        
        // Store insertion point BEFORE moving any nodes
        const insertionPoint = firstNode;
        
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'grid grid-cols-1 md:grid-cols-2 gap-6 my-8 [&>*:nth-child(odd):last-child]:md:col-span-2 [&_img]:rounded-2xl [&_img]:w-full [&_img]:h-full [&_img]:object-cover';
        
        // Insert wrapper FIRST, before moving nodes (this prevents circular refs)
        try {
          parent.insertBefore(wrapper, insertionPoint);
        } catch {
          // If insertion fails, skip grouping
          return;
        }
        
        // Now move all nodes into wrapper (wrapper is already in DOM)
        validNodes.forEach(node => {
          try {
            // Double-check node is still valid and not already in wrapper
            // Also ensure node doesn't contain wrapper or parent
            if (node && 
                node.parentNode && 
                node.parentNode !== wrapper &&
                document.contains(node) && 
                !wrapper.contains(node.parentNode) &&
                !node.contains(wrapper) &&
                !node.contains(parent)) {
              node.parentNode.removeChild(node);
              wrapper.appendChild(node);
            }
          } catch {
            // Ignore errors for individual nodes - they'll just stay where they are
          }
        });
      };

      children.forEach((child) => {
        if (isMedia(child)) {
          mediaGroup.push(child);
        } else {
          if (mediaGroup.length > 1) {
            try {
              wrapGroup(mediaGroup);
            } catch {
              // If grouping fails, skip it - images will still display
            }
          }
          mediaGroup = [];
        }
      });
      
      // Handle trailing group
      if (mediaGroup.length > 1) {
        try {
          wrapGroup(mediaGroup);
        } catch {
          // If grouping fails, skip it - images will still display
        }
      }

      // Process YouTube iframes - wrap them in responsive containers and group them
      // Query for iframes - search all iframes in content div
      const allIframes = Array.from(contentDiv.querySelectorAll('iframe')).filter(iframe => {
        const src = iframe.getAttribute('src');
        return src && 
               src.trim() !== '' && 
               (src.includes('youtube.com') || src.includes('youtu.be'));
      });
      
      if (allIframes.length === 0) {
        // No valid iframes to process
      } else if (allIframes.length === 1) {
        // Single iframe - wrap it
        const iframe = allIframes[0];
        if (!iframe.parentElement.classList.contains('youtube-embed-wrapper')) {
          const wrapper = document.createElement('div');
          wrapper.className = 'youtube-embed-wrapper aspect-video w-full my-12 rounded-2xl overflow-hidden border border-white/10 bg-black/20';
          
          const parent = iframe.parentElement;
          parent.insertBefore(wrapper, iframe);
          wrapper.appendChild(iframe);
          
          // Clean up empty parent elements
          if (parent.tagName === 'P' && parent.textContent.trim() === '' && !parent.querySelector('*:not(iframe)')) {
            parent.remove();
          }
          
          iframe.className = 'w-full h-full';
          iframe.style.border = 'none';
        }
      } else {
        // Multiple iframes - wrap each first, then group wrappers into grid
        const wrappers = [];
        const firstIframe = allIframes[0];
        const firstParent = firstIframe.parentElement;
        
        if (!firstParent) {
          return;
        }
        
        // First, wrap each iframe individually - collect insertion points first
        const iframeData = allIframes.map(iframe => ({
          iframe,
          parent: iframe.parentElement,
          nextSibling: iframe.nextSibling
        }));
        
        iframeData.forEach(({ iframe, parent, nextSibling }) => {
          try {
            // Skip if already wrapped
            if (iframe.parentElement && iframe.parentElement.classList.contains('youtube-embed-wrapper')) {
              wrappers.push(iframe.parentElement);
              return;
            }
            
            // Create wrapper for this iframe
            const wrapper = document.createElement('div');
            wrapper.className = 'youtube-embed-wrapper aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black/20';
            wrapper.style.minHeight = '0';
            
            if (parent && document.contains(iframe)) {
              // Remove iframe from its current parent
              parent.removeChild(iframe);
              
              // Add iframe to wrapper
              wrapper.appendChild(iframe);
              
              // Insert wrapper where iframe was (before nextSibling, or append if no nextSibling)
              if (nextSibling && nextSibling.parentElement === parent) {
                parent.insertBefore(wrapper, nextSibling);
              } else {
                parent.appendChild(wrapper);
              }
              
              // Style the iframe
              iframe.className = 'w-full h-full';
              iframe.style.border = 'none';
              iframe.style.display = 'block';
              
              wrappers.push(wrapper);
              
              // Clean up empty parent
              if (parent.tagName === 'P' && 
                  parent.textContent.trim() === '' && 
                  !parent.querySelector('*')) {
                parent.remove();
              }
            }
          } catch {
            // Ignore errors
          }
        });
        
        // Now create grid and move wrappers into it
        if (wrappers.length > 0) {
          const gridWrapper = document.createElement('div');
          gridWrapper.className = 'grid grid-cols-1 md:grid-cols-2 gap-8 my-12 w-full';
          gridWrapper.style.maxWidth = '100%';
          
          // Insert grid before first wrapper
          const firstWrapperParent = wrappers[0].parentElement;
          if (firstWrapperParent) {
            firstWrapperParent.insertBefore(gridWrapper, wrappers[0]);
            
            // Move all wrappers into grid
            wrappers.forEach((wrapper) => {
              if (wrapper.parentElement !== gridWrapper) {
                wrapper.parentElement.removeChild(wrapper);
                gridWrapper.appendChild(wrapper);
              }
            });
          }
        }
      }

      // Initialize LightGallery for content images
      // Set data attributes only if not already set
      const contentImages = contentDiv.querySelectorAll('img');
      contentImages.forEach(img => {
        if (!img.getAttribute('data-src')) {
          const src = img.getAttribute('src');
          if (src) {
            const processedSrc = getAssetPath(src);
            img.setAttribute('data-src', processedSrc);
            img.setAttribute('data-thumb', processedSrc);
          }
        }
      });

      contentLgRef.current = lightGallery(contentDiv, {
        plugins: [lgZoom],
        speed: 0, // Instant transitions
        selector: 'img',
        download: true,
        preload: 0,
        mode: 'lg-fade',
        thumbnail: false,
        startAnimationDuration: 0,
        backdropDuration: 200, // Backdrop fades in smoothly
        slideDelay: 0,
        hideBarsDelay: 0, // No delay hiding controls
        showBarsAfter: 0, // Show controls immediately
        escKey: true,
        closable: true,
      });
      } // End processContent
      
      return () => {
        clearTimeout(timeoutId);
      };
    }

    // Handle Main Project Gallery
    if (project.gallery && project.gallery.length > 0 && galleryRef.current) {
      projectGalleryLgRef.current = lightGallery(galleryRef.current, {
        plugins: [lgZoom],
        speed: 0, // Instant transitions
        selector: '.gallery-item',
        download: true,
        preload: 0,
        mode: 'lg-fade',
        thumbnail: false,
        startAnimationDuration: 0,
        backdropDuration: 200, // Backdrop fades in smoothly
        slideDelay: 0,
        hideBarsDelay: 0, // No delay hiding controls
        showBarsAfter: 0, // Show controls immediately
        escKey: true,
        closable: true,
      });
    }

    return () => {
      if (contentLgRef.current) {
        try {
          contentLgRef.current.destroy();
        } catch {
          // Ignore errors
        }
        contentLgRef.current = null;
      }
      if (projectGalleryLgRef.current) {
        try {
          projectGalleryLgRef.current.destroy();
        } catch {
          // Ignore errors
        }
        projectGalleryLgRef.current = null;
      }
    };
  }, [project]);

  return (
    <div className="pb-20 pt-32">
      <Container>
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 md:mb-24"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-12 tracking-tight">
              {project.title}
            </h1>

            {/* Project Meta Grid */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center border-t border-white/10 pt-8">
              {project.duration && (
                <div className="space-y-2 min-w-[140px]">
                  <h5 className="text-gray-400 text-xs md:text-sm uppercase tracking-widest font-semibold">Duration</h5>
                  <h4 className="text-lg md:text-xl font-bold">{project.duration}</h4>
                </div>
              )}
              
              {project.client && (
                <div className="space-y-2 min-w-[140px]">
                  <h5 className="text-gray-400 text-xs md:text-sm uppercase tracking-widest font-semibold">Client</h5>
                  <h4 className="text-lg md:text-xl font-bold">{project.client}</h4>
                </div>
              )}
              
              {project.deliverables && (
                <div className="space-y-2 min-w-[140px]">
                  <h5 className="text-gray-400 text-xs md:text-sm uppercase tracking-widest font-semibold">Deliverables</h5>
                  <h4 className="text-lg md:text-xl font-bold">{project.deliverables}</h4>
                </div>
              )}
            </div>
          </MotionBox>

          {/* Main Media Section (Video or Hero Image) */}
          {(project.videoEmbed || project.thumbnail) && (
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full mb-16 md:mb-24"
            >
              {project.videoEmbed && project.videoEmbed.trim() ? (
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black/20 relative pb-[56.25%] h-0">
                  <div 
                    className="absolute top-0 left-0 w-full h-full [&_iframe]:w-full [&_iframe]:h-full"
                    dangerouslySetInnerHTML={{ __html: project.videoEmbed }}
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-2xl overflow-hidden">
                  <ImageWithFallback
                    src={project.thumbnail}
                    alt={project.title}
                    className={`w-full h-full object-cover ${project.thumbnailPosition || 'object-center'}`}
                  />
                </div>
              )}
            </MotionBox>
          )}

          {/* Content Sections */}
          <div className="max-w-5xl mx-auto space-y-16">
            {/* About/Summary Section */}
            {project.about && project.about.replace(/<[^>]*>/g, '').trim() !== '' && (
              <MotionBox
                variant="fadeInUp"
                duration={0.6}
                className="space-y-4 text-center"
              >
                <h5 className="text-gray-400 text-xs md:text-sm uppercase tracking-widest font-semibold mb-4">Summary</h5>
                <div 
                  className="text-2xl md:text-3xl font-medium leading-tight [&>h4]:text-inherit [&>h4]:font-medium [&>a]:text-accent [&>a]:underline"
                  dangerouslySetInnerHTML={{ __html: project.about }}
                />
              </MotionBox>
            )}

            {/* Dynamic Content (Our Involvement, About Client, etc) */}
            {project.content && (
              <MotionBox
                variant="fadeInUp"
                duration={0.6}
                className="w-full"
              >
                <div 
                  ref={contentRef}
                  className="prose prose-invert prose-lg max-w-none space-y-12 [&>img]:rounded-xl [&>img]:w-full [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:mt-12 [&>h2]:mb-6 [&_p]:text-gray-300 [&_p]:leading-relaxed [&_p]:text-lg [&_.youtube-embed-wrapper]:w-full"
                  dangerouslySetInnerHTML={{ __html: processHtmlContent(project.content) }} 
                />
              </MotionBox>
            )}

            {/* Additional Info Fields */}
            {(project.otherInfo1 || project.otherInfo2) && (
              <MotionBox
                variant="fadeInUp"
                duration={0.6}
                className={`grid grid-cols-1 ${project.otherInfo1 && project.otherInfo2 ? 'md:grid-cols-2' : ''} gap-12`}
              >
                 {project.otherInfo1 && project.otherInfo1.replace(/<[^>]*>/g, '').trim() !== '' && (
                   <div 
                     className="prose prose-invert prose-lg max-w-none [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mb-4 [&>p]:text-gray-400 [&>p]:text-lg [&>p]:leading-relaxed"
                     dangerouslySetInnerHTML={{ __html: processHtmlContent(project.otherInfo1) }}
                   />
                 )}
                 {project.otherInfo2 && project.otherInfo2.replace(/<[^>]*>/g, '').trim() !== '' && (
                   <div 
                     className="prose prose-invert prose-lg max-w-none [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mb-4 [&>p]:text-gray-400 [&>p]:text-lg [&>p]:leading-relaxed"
                     dangerouslySetInnerHTML={{ __html: processHtmlContent(project.otherInfo2) }}
                   />
                 )}
              </MotionBox>
            )}
          </div>

          {/* Gallery Section with LightGallery */}
          {project.gallery && project.gallery.length > 0 && (
            <MotionBox
              variant="fadeInUp"
              duration={0.6}
              className="space-y-12 mt-24"
            >
              <h3 className="text-3xl font-bold text-center">Project Gallery</h3>
              <div 
                ref={galleryRef}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
              >
                {project.gallery.map((image, index) => (
                  <MotionBox
                    key={index}
                    variant="scaleIn"
                    delay={index * 0.1}
                    duration={0.4}
                    className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-800 cursor-zoom-in gallery-item block"
                    data-src={getOptimizedImagePath(image)} // Use optimized for display (fast)
                    data-thumb={getOptimizedImagePath(image)} // Use optimized for thumbnails
                    data-download-url={getOriginalImagePath(image)} // Use original for downloads
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${project.title} gallery image ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </MotionBox>
                ))}
              </div>
            </MotionBox>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ProjectDetail;
