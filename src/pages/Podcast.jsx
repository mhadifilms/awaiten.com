import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Mic, 
  Instagram, 
  Twitter, 
  Youtube, 
  ChevronRight, 
  Music,
  X,
  Linkedin
} from 'lucide-react';
import Section from '../components/ui/Section';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { getAssetPath } from '../utils/assets';

// --- Icons ---

const TikTokIcon = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const SpotifyIcon = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const ApplePodcastsIcon = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M22.5 12.5c0-5.79-4.71-10.5-10.5-10.5S1.5 6.71 1.5 12.5c0 5.79 4.71 10.5 10.5 10.5s10.5-4.71 10.5-10.5zm-19 0c0-4.69 3.81-8.5 8.5-8.5s8.5 3.81 8.5 8.5-3.81 8.5-8.5 8.5-8.5-3.81-8.5-8.5z"/>
    <path d="M12 7.5c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
    <path d="M13.5 12.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
  </svg>
);

const YouTubeMusicIcon = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 19.2c-3.98 0-7.2-3.22-7.2-7.2s3.22-7.2 7.2-7.2 7.2 3.22 7.2 7.2-3.22 7.2-7.2 7.2z"/>
    <path d="M10 8.4v7.2L15.6 12 10 8.4z"/>
  </svg>
);

// --- Video Thumbnail Component with Error Handling ---
const VideoThumbnail = ({ alt, className = "", videoId }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [attemptCount, setAttemptCount] = useState(0);
  const [triedOEmbed, setTriedOEmbed] = useState(false);

  // Try multiple thumbnail URL formats - start with most reliable
  const getThumbnailUrls = (vidId) => {
    if (!vidId) return [];
    // Try hqdefault first as it's most commonly available
    const formats = ['hqdefault', 'maxresdefault', 'sddefault', 'mqdefault', 'default'];
    const urls = [];
    formats.forEach(format => {
      urls.push(`https://img.youtube.com/vi/${vidId}/${format}.jpg`);
    });
    formats.forEach(format => {
      urls.push(`https://i.ytimg.com/vi/${vidId}/${format}.jpg`);
    });
    return urls;
  };

  // Fetch thumbnail using oEmbed API
  const fetchThumbnailFromOEmbed = async (vidId) => {
    if (triedOEmbed) return null;
    setTriedOEmbed(true);
    
    try {
      // Use no-cors mode and a proxy-friendly approach
      const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${vidId}&format=json`;
      const response = await fetch(oEmbedUrl, {
        method: 'GET',
        mode: 'cors',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.thumbnail_url) {
          return data.thumbnail_url;
        }
      }
    } catch {
      // Silently fail - oEmbed might not be available due to CORS
    }
    return null;
  };

  // Reset when videoId changes
  useEffect(() => {
    if (!videoId) {
      setHasError(true);
      setIsLoading(false);
      setImgSrc(null);
      setAttemptCount(0);
      setTriedOEmbed(false);
      return;
    }
    
    setHasError(false);
    setIsLoading(true);
    setAttemptCount(0);
    setTriedOEmbed(false);
    
    // Start with direct thumbnail URL
    const urls = getThumbnailUrls(videoId);
    setImgSrc(urls[0]);
  }, [videoId]);

  const handleError = async () => {
    if (!videoId) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    const urls = getThumbnailUrls(videoId);
    const nextIndex = attemptCount + 1;

    // Try all direct URLs first
    if (nextIndex < urls.length) {
      setAttemptCount(nextIndex);
      setImgSrc(urls[nextIndex]);
      setIsLoading(true);
      return;
    }

    // After all direct URLs fail, try oEmbed
    if (!triedOEmbed) {
      setIsLoading(true);
      const oEmbedThumbnail = await fetchThumbnailFromOEmbed(videoId);
      if (oEmbedThumbnail) {
        setImgSrc(oEmbedThumbnail);
        setAttemptCount(nextIndex);
        return;
      }
    }

    // All attempts failed
    setIsLoading(false);
    setHasError(true);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  if (!videoId || hasError) {
    return (
      <div className={`${className} bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative`}>
        <div className="text-center p-4">
          <Play size={48} className="text-white/50 mx-auto mb-2" />
          <p className="text-white/30 text-xs px-2 line-clamp-2">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse z-10" />
      )}
      {imgSrc && (
        <img 
          key={`${videoId}-${attemptCount}-${imgSrc}`}
          src={imgSrc} 
          alt={alt} 
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 relative z-0`}
          onError={handleError}
          onLoad={handleLoad}
          loading="lazy"
        />
      )}
    </div>
  );
};

// --- Video Modal Component ---
const VideoModal = ({ videoId, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-5xl mx-4 aspect-video" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors z-10"
          aria-label="Close video"
        >
          <X size={32} />
        </button>
        <div className="w-full h-full rounded-lg overflow-hidden shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

// --- Data ---

const IN_THE_WORLD = [
  { id: 'w1', title: 'From the World to Within: Rekindling Faith at Camp Noor (Official Documentary)', thumbnail: 'https://img.youtube.com/vi/zkvAHvcw8DE/hqdefault.jpg', videoId: 'zkvAHvcw8DE' },
  { id: 'w2', title: 'Why 25,000 People Gather Yearly to Celebrate Food, Community, and Unity', thumbnail: 'https://img.youtube.com/vi/yh_vlDCPPQI/hqdefault.jpg', videoId: 'yh_vlDCPPQI' },
  { id: 'w3', title: 'The Truth Behind The Pro-Palestine Protests at US Campuses', thumbnail: 'https://img.youtube.com/vi/3InCliGukWg/hqdefault.jpg', videoId: '3InCliGukWg' },
];

const SEASONS = [
  {
    id: 's2',
    title: 'Season 2',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLpAlE5yiBP3gTPumwQc7G9jmsEtcPRc3H',
    episodes: [
      { id: 's2-7', title: 'Law Enforcement Myths & Being a Muslim Cop: Irfan Zaidi', thumbnail: 'https://img.youtube.com/vi/LOo1FpDaw9E/hqdefault.jpg', videoId: 'LOo1FpDaw9E' },
      { id: 's2-6', title: 'The Secret to Getting 1 Billion Views with Comedy: Azfar Khan', thumbnail: 'https://img.youtube.com/vi/qCmr3NFFIdE/hqdefault.jpg', videoId: 'qCmr3NFFIdE' },
      { id: 's2-5', title: 'Showing the Media That Muslims Also Have Fun: Irfan Rydhan and the Story of HalalFest', thumbnail: 'https://img.youtube.com/vi/kJlH3zx1jVs/hqdefault.jpg', videoId: 'kJlH3zx1jVs' },
      { id: 's2-4', title: 'From College Dropout to Renowned Restaurateur: Hisham Abdelfattah and the Story of El Halal Amigos', thumbnail: 'https://img.youtube.com/vi/opZHgqnkh7s/hqdefault.jpg', videoId: 'opZHgqnkh7s' },
      { id: 's2-3', title: 'Escaping Iraq: War, Refugee Camps, and the Power of Faith ft. Jawad Almamori', thumbnail: 'https://img.youtube.com/vi/3FcAWSa1Ldg/hqdefault.jpg', videoId: '3FcAWSa1Ldg' },
      { id: 's2-2', title: 'The Power of Education & Mindset ft. Raza Ali', thumbnail: 'https://img.youtube.com/vi/RJN_m5PglPs/hqdefault.jpg', videoId: 'RJN_m5PglPs' },
    ]
  },
  {
    id: 's1',
    title: 'Season 1',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLpAlE5yiBP3gJCK54sfZDQvNwWGkXtbDv',
    episodes: [
      { id: 's1-10', title: 'The Secrets Behind Pixar\'s Most Famous Movies ft. Eman Abdul-Razzak', thumbnail: 'https://img.youtube.com/vi/c9s8OEdERuA/hqdefault.jpg', videoId: 'c9s8OEdERuA' },
      { id: 's1-9', title: '43 Years Volunteering at a Mosque ft. Muzaffer Khan', thumbnail: 'https://img.youtube.com/vi/lR72xZBrkZs/hqdefault.jpg', videoId: 'lR72xZBrkZs' },
      { id: 's1-8', title: 'Cooking, Creativity, and Community ft. Abbas Mohamed', thumbnail: 'https://img.youtube.com/vi/BQEJyiOT3kg/hqdefault.jpg', videoId: 'BQEJyiOT3kg' },
      { id: 's1-7', title: 'Unlocking Global Impact through Business ft. Mir Aamir', thumbnail: 'https://img.youtube.com/vi/A4zGTaW6vfU/hqdefault.jpg', videoId: 'A4zGTaW6vfU' },
      { id: 's1-6', title: 'AI - the Good, the Bad, and the Ugly ft. Nazneen Rajani', thumbnail: 'https://img.youtube.com/vi/a7jMrGHX5P4/hqdefault.jpg', videoId: 'a7jMrGHX5P4' },
      { id: 's1-5', title: 'From Punk Rock to PhD: The Journey of David Coolidge', thumbnail: 'https://img.youtube.com/vi/OJP0fubChH0/hqdefault.jpg', videoId: 'OJP0fubChH0' },
      { id: 's1-4', title: 'From Corporate Climber to Spiritual Seeker: The Journey of Mahdi Falahati', thumbnail: 'https://img.youtube.com/vi/tg5nFaIgVFg/hqdefault.jpg', videoId: 'tg5nFaIgVFg' },
      { id: 's1-3', title: 'Friends, Faith, and Family Advocates: The Journey of Natima Neily', thumbnail: 'https://img.youtube.com/vi/3Y02YIphMAA/hqdefault.jpg', videoId: '3Y02YIphMAA' },
      { id: 's1-2', title: 'Risks, Startups, and Unconventional Routes: The Journey of Ali Mir', thumbnail: 'https://img.youtube.com/vi/cvx4cxLYVh4/hqdefault.jpg', videoId: 'cvx4cxLYVh4' },
      { id: 's1-1', title: 'Entrepreneurs, Leaders, and Mentors: The Journey of Ahmad Ahmadzia', thumbnail: 'https://img.youtube.com/vi/JgU_n00d0JU/hqdefault.jpg', videoId: 'JgU_n00d0JU' },
    ]
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    text: "Journey Tellers was the channel for me to learn from new mentors who taught me new life lessons. It has been a beacon to get inspiration and personal growth.",
  },
  {
    id: 2,
    text: "The stories on the podcast are incredibly inspiring and have given me some ideas of how I can improve myself and what I could actually do despite my limitations.",
  },
  {
    id: 3,
    text: "The hosts are charismatic, engaging, and passionate... I am able to connect on a personal level, while obtaining priceless experiences, lessons, and insights.",
  },
  {
    id: 4,
    text: "These young men are doing amazing work spotlighting our diverse and talented community. I look forward to seeing it grow to greater heights.",
  }
];

const HOSTS = [
  {
    name: "M Hadi",
    image: "/images/mhadi.jpg",
    bio: "M Hadi is a filmmaker and co-founder of Journey Tellers, where he uses his background in film and AI-powered video to craft cinematic, story-driven conversations with guests from all walks of life.",
    socials: { 
      youtube: "https://www.youtube.com/@mhadifilms", 
      instagram: "https://www.instagram.com/mhadifilms", 
      linkedin: "https://www.linkedin.com/in/mhadimedia/" 
    }
  },
  {
    name: "Ali Almathkur",
    image: "/images/ali.jpg", 
    bio: "Ali Almathkur is the co-founder and co-host of Journey Tellers, known for his calm, curious interview style and his focus on honest, nuanced conversations about faith, community, and unconventional careers.",
    socials: { 
      youtube: "https://www.youtube.com/@alialmathkur", 
      instagram: "https://www.instagram.com/alialmathkur", 
      linkedin: "https://www.linkedin.com/in/ali-almathkur-65783521b/" 
    }
  }
];

// --- Shared Platform Icon Component ---
const PlatformIcon = ({ 
  icon: Icon, 
  href,
  size = 'md', 
  className = '',
  title,
  iconProps = {},
  isYouTube = false
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };
  
  const iconSizes = {
    sm: 24,
    md: 28,
    lg: 32
  };

  // Special styling for YouTube to ensure visibility
  const bgClass = isYouTube 
    ? 'bg-red-600/20 border-red-500/30 text-red-400 hover:bg-red-600/30 hover:border-red-500/50 hover:text-red-300'
    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20 hover:text-white';

  const iconElement = (
    <div 
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${bgClass} hover:scale-110 transition-all duration-300 ${className}`}
      title={title}
    >
      <Icon size={iconSizes[size]} {...iconProps} />
    </div>
  );

  if (href) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block"
      >
        {iconElement}
      </a>
    );
  }

  return iconElement;
};

// --- Shared Design Constants ---
const SECTION_PADDING = 'py-12 md:py-16';
const SECTION_BG = 'bg-[#020617]';
const CARD_BG = 'bg-[#0A1128]';
const CARD_BG_HOVER = 'hover:bg-[#0D1425]';
const CARD_BORDER = 'border border-white/5';
const CARD_BORDER_HOVER = 'hover:border-white/10';
const CARD_ROUNDED = 'rounded-2xl';
const RED_ACCENT = 'bg-red-500';
const TEXT_PRIMARY = 'text-white';
const TEXT_SECONDARY = 'text-gray-300';
const TEXT_MUTED = 'text-gray-400';

// --- Shared Section Header Component ---
const SectionHeader = ({ label, title, description, className = '' }) => (
  <div className={`text-center mb-12 ${className}`}>
    {label && (
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className={`h-[1px] w-12 ${RED_ACCENT}`}></div>
        <span className={`${RED_ACCENT} uppercase tracking-[0.2em] text-sm font-bold`}>{label}</span>
        <div className={`h-[1px] w-12 ${RED_ACCENT}`}></div>
      </div>
    )}
    {title && (
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{title}</h2>
    )}
    {description && (
      <p className={`${TEXT_MUTED} text-lg max-w-2xl mx-auto`}>{description}</p>
    )}
  </div>
);

// --- Sub-Components ---

const HeroSection = ({ onVideoClick }) => {
  const latestVideoId = SEASONS[0]?.episodes[0]?.videoId || 'WgvWTu-pKew'; // Season 2 Episode 1

  const scrollToHosts = () => {
    const hostsSection = document.getElementById('hosts');
    if (hostsSection) {
      hostsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center bg-[#020617]">
      {/* Creative Background - Contained */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/branding/PodcastBG.png')] bg-cover bg-center scale-105 blur-sm opacity-80" />
        {/* Subtle blue overlay gradient for styling */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-[#020617]/20 to-[#020617]" />
        {/* Smooth fade transition at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020617] to-transparent" />
      </div>

      <Container className="relative z-10 text-center max-w-5xl mx-auto px-6 pb-12 md:pb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <h2 className="text-red-500 font-bold tracking-[0.3em] uppercase text-sm md:text-base mb-6">JOURNEY TELLERS</h2>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
            Reading and writing the<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">stories of the Muslim West</span>
          </h1>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed font-light"
        >
          Celebrating entrepreneurs, chefs, doctors, animators, converts, and educators. 
          <span className="block mt-2 text-white font-medium">Every failure is a lesson. Every story matters.</span>
        </motion.p>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
        >
          Ft. <span className="text-white font-medium">Muhammad Hadi Yusufali</span> & <span className="text-white font-medium">Ali Almathkur</span>
        </motion.p>
      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          <Button 
            variant="primary" 
            className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg w-full sm:w-auto"
            onClick={() => onVideoClick && onVideoClick(latestVideoId)}
          >
            Latest Video
          </Button>
          <Button 
            variant="outline" 
            className="px-8 py-3 rounded-full font-bold w-full sm:w-auto"
            onClick={scrollToHosts}
          >
            About Us
          </Button>
        </motion.div>
      </Container>
      
      {/* Overlapping 'What's Your Story' Text - Creative Design */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none overflow-hidden" style={{ transform: 'translateY(30%)' }}>
        <div className="relative w-full flex items-center justify-center px-4 sm:px-6 md:px-8 py-0">
          {/* Background blur layer for depth */}
          <h2 
            className="text-[10vw] sm:text-[9vw] md:text-[7vw] lg:text-[6vw] xl:text-[5vw] font-black text-white text-center tracking-tight sm:tracking-[-0.01em] uppercase leading-[0.75] select-none whitespace-nowrap absolute m-0 p-0"
            style={{
              opacity: 0.08,
              filter: 'blur(6px)',
              transform: 'translateY(1px)',
            }}
          >
            What's Your Story?
          </h2>
          
          {/* Main text */}
          <h2 
            className="relative text-[10vw] sm:text-[9vw] md:text-[7vw] lg:text-[6vw] xl:text-[5vw] font-black text-white text-center tracking-tight sm:tracking-[-0.01em] uppercase leading-[0.75] select-none whitespace-nowrap m-0 p-0"
            style={{
              opacity: 0.25,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            What's Your Story?
          </h2>
        </div>
      </div>
    </section>
  );
};

const DocumentarySection = ({ title, description, episodes, onVideoClick }) => {
  if (!episodes || episodes.length === 0) return null;
  const [featured, ...others] = episodes;

  return (
    <div className={`${SECTION_PADDING} border-b border-white/5`}>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-4">
             <div className={`h-[1px] w-12 ${RED_ACCENT}`}></div>
             <span className={`${RED_ACCENT} uppercase tracking-[0.2em] text-sm font-bold`}>Documentaries</span>
          </div>
          <h3 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-none">{title}</h3>
          {description && <p className={`${TEXT_MUTED} text-lg md:text-xl font-light leading-relaxed max-w-2xl`}>{description}</p>}
        </div>
        <button className="group flex items-center gap-3 text-white font-medium uppercase tracking-widest text-sm hover:text-red-500 transition-colors">
           View All Documentaries
           <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-red-500 group-hover:bg-red-500/10 transition-all">
             <ChevronRight size={14} />
           </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Featured Video - Large */}
        <div className="lg:col-span-8 group cursor-pointer" onClick={() => onVideoClick(featured.videoId)}>
           <div className={`aspect-video ${CARD_ROUNDED} overflow-hidden relative shadow-2xl ${CARD_BORDER}`}>
              <VideoThumbnail 
                alt={featured.title} 
                videoId={featured.videoId}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Darker gradient at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 via-black/40 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30 shadow-2xl transition-all duration-300 group-hover:bg-white/30 group-hover:border-white/50">
                   <Play size={32} className="text-white ml-1" fill="currentColor" />
                </div>
              </div>

              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 max-w-3xl z-10">
                 <span className="inline-block px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider mb-3">Featured Documentary</span>
                 <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight mb-2 group-hover:text-red-400 transition-colors">{featured.title}</h4>
              </div>
           </div>
        </div>

        {/* Sidebar List - Vertical */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           {others.map((ep) => (
             <div key={ep.id} className={`group/item cursor-pointer flex gap-4 items-start p-4 ${CARD_ROUNDED} ${CARD_BG_HOVER} transition-colors ${CARD_BORDER} ${CARD_BORDER_HOVER}`} onClick={() => onVideoClick(ep.videoId)}>
                <div className="w-32 aspect-video rounded-lg bg-gray-800 overflow-hidden relative shrink-0 shadow-lg">
                   <VideoThumbnail 
                     alt={ep.title} 
                     videoId={ep.videoId}
                     className="w-full h-full object-cover opacity-80 group-hover/item:opacity-100 transition-all"
                   />
                </div>
                <div>
                   <h5 className="text-white font-bold text-sm leading-snug mb-2 line-clamp-3 group-hover/item:text-red-400 transition-colors">{ep.title}</h5>
                   <span className="text-xs text-gray-500 uppercase tracking-wider font-medium flex items-center gap-2">
                     <Play size={10} /> Watch Now
                   </span>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

const PlatformLinks = () => (
  <section className={`${SECTION_PADDING} ${SECTION_BG} border-t border-white/5`}>
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Watch */}
        <div className={`${CARD_BG} rounded-3xl p-8 flex flex-col items-center text-center ${CARD_BG_HOVER} transition-colors ${CARD_BORDER} shadow-lg`}>
          <h3 className="text-xl font-bold text-white mb-6">Watch</h3>
          <div className="flex items-center justify-center gap-4">
             <PlatformIcon 
               icon={Youtube} 
               href="https://www.youtube.com/channel/UC8RY70d8KyIMicnrGtwVOAA"
               size="md"
               title="YouTube"
               iconProps={{ fill: "currentColor" }}
               isYouTube={true}
             />
             <PlatformIcon 
               icon={SpotifyIcon} 
               href="https://open.spotify.com/show/6QAqMcRyGUBL3tAyLa72dT"
               size="md"
               title="Spotify"
             />
          </div>
        </div>

        {/* Listen */}
        <div className={`${CARD_BG} rounded-3xl p-8 flex flex-col items-center text-center ${CARD_BG_HOVER} transition-colors ${CARD_BORDER} shadow-lg`}>
          <h3 className="text-xl font-bold text-white mb-6">Listen</h3>
          <div className="flex items-center justify-center gap-4">
             <PlatformIcon 
               icon={SpotifyIcon} 
               href="https://open.spotify.com/show/6QAqMcRyGUBL3tAyLa72dT"
               size="md"
               title="Spotify"
             />
             <PlatformIcon 
               icon={ApplePodcastsIcon} 
               href="https://podcasts.apple.com/us/podcast/journey-tellers/id1679027751"
               size="md"
               title="Apple Podcasts"
             />
             <PlatformIcon 
               icon={YouTubeMusicIcon} 
               href="https://music.youtube.com/playlist?list=PLpAlE5yiBP3j7ja00oROCYUgjIcsUAht9&si=Hsrwffi2CPu3ZgDC"
               size="md"
               title="YouTube Music"
               isYouTube={true}
             />
          </div>
        </div>

        {/* Clips */}
        <div className={`${CARD_BG} rounded-3xl p-8 flex flex-col items-center text-center ${CARD_BG_HOVER} transition-colors ${CARD_BORDER} shadow-lg`}>
          <h3 className="text-xl font-bold text-white mb-6">Clips</h3>
          <div className="flex items-center justify-center gap-4">
             <PlatformIcon 
               icon={Instagram} 
               href="https://www.instagram.com/journey.tellers/"
               size="md"
               title="Instagram"
             />
             <PlatformIcon 
               icon={TikTokIcon} 
               href="https://www.tiktok.com/@journeytellers"
               size="md"
               title="TikTok"
             />
          </div>
        </div>

      </div>
    </Container>
  </section>
);


const EpisodeGrid = ({ title, description, episodes, playlistUrl, onVideoClick }) => (
  <div className={SECTION_PADDING}>
    <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 px-4 md:px-0 gap-4">
      <div>
        <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
        {description && <p className={`${TEXT_MUTED} text-sm max-w-2xl`}>{description}</p>}
      </div>
      {playlistUrl && (
        <a 
          href={playlistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs md:text-sm font-medium text-gray-400 hover:text-white flex items-center gap-2 transition-colors uppercase tracking-wider whitespace-nowrap"
        >
          View Full Playlist <ChevronRight size={14} />
        </a>
      )}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
      {episodes.map((ep) => (
        <div key={ep.id} className="group cursor-pointer" onClick={() => onVideoClick(ep.videoId)}>
          <div className="aspect-video rounded-xl bg-gray-800 overflow-hidden mb-3 relative border border-white/5 shadow-lg">
             <VideoThumbnail 
               alt={ep.title} 
               videoId={ep.videoId}
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                   <Play size={20} fill="currentColor" className="text-white ml-1" />
                </div>
             </div>
          </div>
          <h4 className="text-white font-bold text-base leading-tight group-hover:text-red-500 transition-colors line-clamp-2">{ep.title}</h4>
        </div>
      ))}
    </div>
  </div>
);

const HostsSection = () => (
  <section id="hosts" className={`${SECTION_PADDING} ${SECTION_BG}`}>
    <Container>
      <SectionHeader title="Meet the Hosts" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
        {HOSTS.map((host, i) => (
          <div key={i} className={`${CARD_BG} rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-8 ${CARD_BORDER} ${CARD_BORDER_HOVER} transition-all group hover:-translate-y-1 shadow-xl`}>
            <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full overflow-hidden border-4 border-[#020617] shadow-xl group-hover:border-red-500/50 transition-colors duration-300">
              <img src={getAssetPath(host.image)} alt={host.name} className="w-full h-full object-cover" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-2xl font-bold text-white mb-1">{host.name}</h3>
              <p className="text-red-400 text-sm font-medium uppercase tracking-widest mb-4">{host.role}</p>
              <p className={`${TEXT_MUTED} text-sm leading-relaxed mb-6 line-clamp-3`}>{host.bio}</p>
              <div className="flex justify-center sm:justify-start gap-4">
                <a 
                  href={host.socials.youtube} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all"
                  aria-label="YouTube"
                >
                  <Youtube size={18} />
                </a>
                <a 
                  href={host.socials.instagram} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a 
                  href={host.socials.linkedin} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

const TestimonialsSection = () => (
  <section className={`${SECTION_PADDING} ${SECTION_BG} border-t border-white/5`}>
    <Container>
      <SectionHeader 
        label="Testimonials" 
        title="What People Say" 
        description="Hear from our community about their Journey Tellers experience"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className={`group relative bg-gradient-to-br from-[#0A1128] to-[#0D1425] p-8 ${CARD_ROUNDED} ${CARD_BORDER} ${CARD_BORDER_HOVER} transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl`}>
            <div className="absolute top-6 left-6 text-red-500/20 text-6xl font-serif leading-none">"</div>
            <div className="relative z-10">
              <p className={`${TEXT_SECONDARY} text-base leading-relaxed pl-4`}>{t.text}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

const CTASection = () => (
  <section className={`py-16 md:py-24 bg-gradient-to-br from-[#0A1128] via-[#020617] to-[#0A1128] border-t border-white/5`}>
    <Container>
      <div className="max-w-4xl mx-auto text-center">
        <SectionHeader 
          title="Start Your Journey Today"
          description="Subscribe to Journey Tellers and never miss a story. Watch on YouTube, listen on your favorite podcast platform, or follow us for clips and updates."
          className="mb-10"
        />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            className="px-8 py-3 rounded-full font-bold w-full sm:w-auto"
            onClick={() => window.open('https://www.youtube.com/channel/UC8RY70d8KyIMicnrGtwVOAA', '_blank')}
          >
            Subscribe on YouTube
            <ChevronRight size={18} className="ml-2" />
          </Button>
          <Button
            variant="outline"
            className="px-8 py-3 rounded-full font-bold w-full sm:w-auto"
            onClick={() => window.open('https://open.spotify.com/show/6QAqMcRyGUBL3tAyLa72dT', '_blank')}
          >
            Listen on Spotify
            <Music size={18} className="ml-2" />
          </Button>
        </div>
        <div className={`mt-8 flex items-center justify-center gap-6 ${TEXT_MUTED} text-sm`}>
          <a href="https://www.instagram.com/journey.tellers/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
            <Instagram size={18} />
            Instagram
          </a>
          <span>•</span>
          <a href="https://www.tiktok.com/@journeytellers" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
            <TikTokIcon size={18} />
            TikTok
          </a>
          <span>•</span>
          <a href="https://podcasts.apple.com/us/podcast/journey-tellers/id1679027751" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
            <ApplePodcastsIcon size={18} />
            Apple Podcasts
          </a>
        </div>
      </div>
    </Container>
  </section>
);

const Podcast = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Set page title
  useEffect(() => {
    document.title = "Journey Tellers • Awaiten";
    return () => {
      document.title = "Awaiten • Creative Production Studio";
    };
  }, []);

  const handleVideoClick = (videoId) => {
    setSelectedVideo(videoId);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
    document.body.style.overflow = '';
  };

  return (
    <main className="bg-[#020617] text-white min-h-screen overflow-x-hidden font-sans">
      <HeroSection onVideoClick={handleVideoClick} />
      
      {/* Spacer to account for the negative margin overlap */}
      <div className="pt-12 md:pt-16">
        <PlatformLinks />
      </div>

      <HostsSection />
      
      <Container>
        <DocumentarySection 
          title="In The World" 
          description="Documentaries with the goal of sharing raw & authentic stories of success, failure, and everything in between."
          episodes={IN_THE_WORLD} 
          onVideoClick={handleVideoClick}
        />
        {SEASONS.map((season) => (
          <EpisodeGrid key={season.id} title={season.title} episodes={season.episodes} playlistUrl={season.playlistUrl} onVideoClick={handleVideoClick} />
        ))}
      </Container>

      <TestimonialsSection />

      <CTASection />

      {/* Video Modal */}
      <VideoModal 
        videoId={selectedVideo} 
        isOpen={!!selectedVideo} 
        onClose={handleCloseVideo} 
      />
    </main>
  );
};

export default Podcast;
