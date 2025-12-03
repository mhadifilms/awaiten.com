import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ImageWithFallback from '../ui/ImageWithFallback';
import MotionBox from '../ui/MotionBox';
import Container from '../ui/Container';
import { getAssetPath } from '../../utils/assets';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import lightGallery from 'lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';

// Helper function to process HTML content and fix image paths
const processHtmlContent = (html) => {
  if (!html) return html;
  // Replace all /images/ paths with getAssetPath processed paths
  return html.replace(/src="(\/images\/[^"]+)"/g, (match, path) => {
    return `src="${getAssetPath(path)}"`;
  });
};

const ProjectDetail = ({ project }) => {
  const galleryRef = useRef(null);
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
    let contentLg;
    if (project.content && contentRef.current) {
      const contentDiv = contentRef.current;
      const children = Array.from(contentDiv.children);
      let mediaGroup = [];

      const isMedia = (node) => {
        // Check if node is img
        if (node.tagName === 'IMG') return true;
        // Check if node is a wrapper (p, figure, div) containing only an image
        if (['P', 'FIGURE', 'DIV'].includes(node.tagName)) {
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
        
        const wrapper = document.createElement('div');
        // Grid layout for grouped images
        wrapper.className = 'grid grid-cols-1 md:grid-cols-2 gap-6 my-8 [&>*:nth-child(odd):last-child]:md:col-span-2 [&_img]:rounded-2xl [&_img]:w-full [&_img]:h-full [&_img]:object-cover';
        
        // Insert wrapper before the first element of the group
        group[0].parentNode.insertBefore(wrapper, group[0]);
        
        // Move elements into wrapper
        group.forEach(node => wrapper.appendChild(node));
      };

      children.forEach((child) => {
        if (isMedia(child)) {
          mediaGroup.push(child);
        } else {
          if (mediaGroup.length > 1) {
            wrapGroup(mediaGroup);
          }
          mediaGroup = [];
        }
      });
      
      // Handle trailing group
      if (mediaGroup.length > 1) {
        wrapGroup(mediaGroup);
      }

      // Process YouTube iframes - wrap them in responsive containers and group them
      const allIframes = Array.from(contentDiv.querySelectorAll('iframe[src*="youtube.com"], iframe[src*="youtu.be"]'));
      
      if (allIframes.length === 0) {
        // No iframes to process
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
        // Multiple iframes - always group them into a grid
        const firstIframe = allIframes[0];
        const firstParent = firstIframe.parentElement;
        
        // Create grid wrapper
        const gridWrapper = document.createElement('div');
        gridWrapper.className = 'grid grid-cols-1 md:grid-cols-2 gap-8 my-12 w-full';
        gridWrapper.style.maxWidth = '100%';
        
        // Insert grid before first iframe
        firstParent.insertBefore(gridWrapper, firstIframe);
        
        // Process all iframes
        allIframes.forEach((iframe) => {
          const wrapper = document.createElement('div');
          wrapper.className = 'youtube-embed-wrapper aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black/20';
          wrapper.style.minHeight = '0';
          
          const parent = iframe.parentElement;
          parent.removeChild(iframe);
          wrapper.appendChild(iframe);
          gridWrapper.appendChild(wrapper);
          
          // Clean up empty parent
          if (parent.tagName === 'P' && parent.textContent.trim() === '' && !parent.querySelector('*')) {
            parent.remove();
          }
          
          iframe.className = 'w-full h-full';
          iframe.style.border = 'none';
          iframe.style.display = 'block';
        });
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

      contentLg = lightGallery(contentDiv, {
        plugins: [lgZoom], // Removed lgThumbnail for faster loading
        speed: 200,
        selector: 'img', // Select all images inside content
        download: true,
        preload: 0, // Disable preloading - only load current image
        mode: 'lg-fade',
        thumbnail: false, // Disable thumbnails entirely for faster loading
        startAnimationDuration: 0,
        backdropDuration: 200,
      });
    }

    // Handle Main Project Gallery
    let galleryLg;
    if (project.gallery && project.gallery.length > 0 && galleryRef.current) {
      galleryLg = lightGallery(galleryRef.current, {
        plugins: [lgZoom], // Removed lgThumbnail for faster loading
        speed: 200,
        selector: '.gallery-item',
        download: true,
        preload: 0, // Disable preloading - only load current image
        mode: 'lg-fade',
        thumbnail: false, // Disable thumbnails entirely for faster loading
        startAnimationDuration: 0,
        backdropDuration: 200,
      });
    }

    return () => {
      if (contentLg) contentLg.destroy();
      if (galleryLg) galleryLg.destroy();
    };
  }, [project.gallery, project.content]);

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
              {project.videoEmbed ? (
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
                    data-src={getAssetPath(image)} // Required for lightGallery (optimized for display)
                    data-thumb={getAssetPath(image)} // Required for thumbnails
                    data-download-url={image.startsWith('/images/gallery/') 
                      ? getAssetPath(image.replace('/images/gallery/', '/images/originals/gallery/'))
                      : getAssetPath(image)} // Use original full-res for downloads
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
