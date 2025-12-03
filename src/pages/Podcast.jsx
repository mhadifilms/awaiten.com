import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Mic, 
  Instagram, 
  Twitter, 
  Youtube, 
  ChevronRight, 
  Music,
  X
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
const VideoThumbnail = ({ src, alt, className = "", onError, videoId }) => {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);
  const [loading, setLoading] = useState(true);

  const handleError = () => {
    if (!imgError) {
      setImgError(true);
      // Try different YouTube thumbnail formats
      if (src.includes('hqdefault')) {
        // Try maxresdefault
        setImgSrc(src.replace('hqdefault', 'maxresdefault'));
      } else if (src.includes('maxresdefault')) {
        // Try sddefault
        setImgSrc(src.replace('maxresdefault', 'sddefault'));
      } else if (videoId) {
        // Last resort: try mqdefault
        setImgSrc(`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`);
      } else if (onError) {
        onError();
        setLoading(false);
      }
    } else {
      // All attempts failed, show fallback
      if (onError) {
        onError();
      }
      setLoading(false);
    }
  };

  const handleLoad = () => {
    setLoading(false);
  };

  if (imgError && !loading) {
    // Fallback UI when image fails to load
    return (
      <div className={`${className} bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center`}>
        <div className="text-center">
          <Play size={48} className="text-white/50 mx-auto mb-2" />
          <p className="text-white/30 text-xs">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className={`${className} bg-gray-800 animate-pulse absolute inset-0`} />
      )}
      <img 
        src={imgSrc} 
        alt={alt} 
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        style={{ display: loading ? 'none' : 'block' }}
      />
    </>
  );
};

// --- Video Modal Component ---
const VideoModal = ({ videoId, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
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
  { id: 'w1', title: 'From the World to Within: Rekindling Faith at Camp Noor (Official Documentary)', thumbnail: 'https://img.youtube.com/vi/05cdl02skipv/hqdefault.jpg', videoId: '05cdl02skipv' },
  { id: 'w2', title: 'Why 25,000 People Gather Yearly to Celebrate Food, Community, and Unity', thumbnail: 'https://img.youtube.com/vi/f1yu1wo1dkj/hqdefault.jpg', videoId: 'f1yu1wo1dkj' },
  { id: 'w3', title: 'The Truth Behind The Pro-Palestine Protests at US Campuses', thumbnail: 'https://img.youtube.com/vi/qpuee6x1zw/hqdefault.jpg', videoId: 'qpuee6x1zw' },
];

const SEASONS = [
  {
    id: 's2',
    title: 'Season 2',
    episodes: [
      { id: 's2-1', title: 'Real People, Real Stories, Real Insights - Season 2 is Here.', thumbnail: 'https://img.youtube.com/vi/veb9hg03o8d/hqdefault.jpg', videoId: 'veb9hg03o8d' },
      { id: 's2-2', title: 'The Power of Education & Mindset ft. Raza Ali', thumbnail: 'https://img.youtube.com/vi/dine9c5qhto/hqdefault.jpg', videoId: 'dine9c5qhto' },
      { id: 's2-3', title: 'Escaping Iraq: War, Refugee Camps, and the Power of Faith ft. Jawad Almamori', thumbnail: 'https://img.youtube.com/vi/bst193gomk/hqdefault.jpg', videoId: 'bst193gomk' },
      { id: 's2-4', title: 'From College Dropout to Renowned Restaurateur: Hisham Abdelfattah', thumbnail: 'https://img.youtube.com/vi/hz15fatyftk/hqdefault.jpg', videoId: 'hz15fatyftk' },
    ]
  },
  {
    id: 's1',
    title: 'Season 1',
    episodes: [
      { id: 's1-1', title: 'Entrepreneurs, Leaders, and Mentors: The Journey of Ahmad Ahmadzia', thumbnail: 'https://img.youtube.com/vi/ilp31syc5n9/hqdefault.jpg', videoId: 'ilp31syc5n9' },
      { id: 's1-2', title: 'Risks, Startups, and Unconventional Routes: The Journey of Ali Mir', thumbnail: 'https://img.youtube.com/vi/n501r3vrqt/hqdefault.jpg', videoId: 'n501r3vrqt' },
      { id: 's1-3', title: 'Friends, Faith, and Family Advocates: The Journey of Natima Neily', thumbnail: 'https://img.youtube.com/vi/svz3gt4xv6/hqdefault.jpg', videoId: 'svz3gt4xv6' },
      { id: 's1-4', title: 'From Corporate Climber to Spiritual Seeker: The Journey of Mahdi Falahati', thumbnail: 'https://img.youtube.com/vi/e742fremhyo/hqdefault.jpg', videoId: 'e742fremhyo' },
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
    role: "Host",
    image: "/images/mhadi.jpg",
    bio: "Aute est ipsum aliquip consequat nulla sunt cillum reprehenderit. Fugiat anim cillum qui cupidatat ex duis sit cillum sit ut adipisicing.",
    socials: { youtube: "#", instagram: "#", twitter: "#" }
  },
  {
    name: "Ali Almathkur",
    role: "Host",
    image: "/images/aalyan.jpg", 
    bio: "Aute est ipsum aliquip consequat nulla sunt cillum reprehenderit. Fugiat anim cillum qui cupidatat ex duis sit cillum sit ut adipisicing.",
    socials: { youtube: "#", instagram: "#", twitter: "#" }
  }
];

// --- Shared Platform Icon Component ---
const PlatformIcon = ({ 
  icon: Icon, 
  bgColor, 
  size = 'md', 
  shape = 'circle',
  delay = 0,
  shadowColor,
  className = '',
  title,
  iconProps = {}
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

  const shapeClasses = shape === 'square' ? 'rounded-xl' : 'rounded-full';
  const bgStyle = typeof bgColor === 'string' && bgColor.includes('gradient')
    ? { background: bgColor }
    : { backgroundColor: bgColor };

  return (
    <div 
      className={`${sizeClasses[size]} ${shapeClasses} flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg ${className}`}
      style={{
        ...bgStyle,
        boxShadow: shadowColor ? `0 10px 30px ${shadowColor}` : undefined,
        transitionDelay: `${delay}ms`
      }}
      title={title}
    >
      <Icon size={iconSizes[size]} {...iconProps} />
    </div>
  );
};

// --- Sub-Components ---

const HeroSection = () => (
  <section className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden bg-[#020617]">
    {/* Creative Background */}
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-[url('/images/branding/PodcastBG.png')] bg-cover bg-center scale-105 blur-sm opacity-80" />
      {/* Subtle blue overlay gradient for styling */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-[#020617]/20 to-[#020617]" />
      {/* Smooth fade transition at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020617] to-transparent" />
    </div>

    <Container className="relative z-10 text-center max-w-5xl mx-auto px-6 pb-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-8"
      >
        <h2 className="text-red-500 font-bold tracking-[0.3em] uppercase text-sm md:text-base mb-6">Journey Tellers</h2>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-tight tracking-tight drop-shadow-2xl">
          Stories of the<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">Muslim West</span>
        </h1>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
      >
        Celebrating entrepreneurs, chefs, doctors, animators, converts, and educators. 
        <span className="block mt-2 text-white font-medium">Every failure is a lesson. Every story matters.</span>
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8"
      >
        <p className="text-sm text-gray-400 uppercase tracking-widest">Featuring</p>
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold">Muhammad Hadi Yusufali</span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          <span className="text-white font-semibold">Ali Almathkur</span>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="mt-12"
      >
         <Button variant="primary" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg">
           Support Us
         </Button>
      </motion.div>
    </Container>
    
    {/* Overlapping 'What's Your Story' Text - Fixed visibility */}
    <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-20 pointer-events-none">
       <h2 className="text-[12vw] md:text-[10vw] font-black text-white text-center tracking-tighter uppercase leading-none opacity-30 select-none">
         What's Your Story?
       </h2>
    </div>
  </section>
);

const PlatformLinks = () => (
  <section className="py-12 bg-[#020617] border-t border-white/5">
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Watch */}
        <div className="bg-[#0A1128] rounded-3xl p-8 flex flex-col items-center text-center hover:bg-[#0D1425] transition-colors group cursor-pointer border border-white/5 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-6">Watch</h3>
          <div className="flex items-center justify-center gap-4">
             <PlatformIcon 
               icon={Youtube} 
               bgColor="#FF0000" 
               size="md"
               shape="circle"
               delay={0}
               shadowColor="rgba(255, 0, 0, 0.3)"
               title="YouTube"
               iconProps={{ fill: "currentColor" }}
             />
             <PlatformIcon 
               icon={SpotifyIcon} 
               bgColor="#1DB954" 
               size="md"
               shape="circle"
               delay={75}
               shadowColor="rgba(29, 185, 84, 0.3)"
               title="Spotify"
             />
          </div>
        </div>

        {/* Listen */}
        <div className="bg-[#0A1128] rounded-3xl p-8 flex flex-col items-center text-center hover:bg-[#0D1425] transition-colors group cursor-pointer border border-white/5 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-6">Listen</h3>
          <div className="flex items-center justify-center gap-4">
             <PlatformIcon 
               icon={SpotifyIcon} 
               bgColor="#1DB954" 
               size="md"
               shape="circle"
               delay={0}
               title="Spotify"
             />
             <PlatformIcon 
               icon={ApplePodcastsIcon} 
               bgColor="#A020F0" 
               size="md"
               shape="circle"
               delay={75}
               title="Apple Podcasts"
             />
             <PlatformIcon 
               icon={YouTubeMusicIcon} 
               bgColor="#FF0000" 
               size="md"
               shape="circle"
               delay={100}
               title="YouTube Music"
             />
          </div>
        </div>

        {/* Clips */}
        <div className="bg-[#0A1128] rounded-3xl p-8 flex flex-col items-center text-center hover:bg-[#0D1425] transition-colors group cursor-pointer border border-white/5 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-6">Clips</h3>
          <div className="flex items-center justify-center gap-4">
             <PlatformIcon 
               icon={Instagram} 
               bgColor="linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)" 
               size="md"
               shape="circle"
               delay={0}
               title="Instagram"
             />
             <PlatformIcon 
               icon={TikTokIcon} 
               bgColor="#000000" 
               size="md"
               shape="circle"
               delay={75}
               className="border border-white/10"
               title="TikTok"
             />
          </div>
        </div>

      </div>
    </Container>
  </section>
);

const FeaturedGrid = ({ title, description, episodes, onViewAll, onVideoClick }) => {
  if (!episodes || episodes.length === 0) return null;
  
  const [latest, ...others] = episodes;

  return (
    <div className="py-12">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 px-4 md:px-0 gap-4">
        <div>
          <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
          {description && <p className="text-gray-400 text-sm max-w-2xl">{description}</p>}
        </div>
        {onViewAll && (
          <button className="text-xs md:text-sm font-medium text-gray-400 hover:text-white flex items-center gap-2 transition-colors uppercase tracking-wider whitespace-nowrap">
            View Full Playlist <ChevronRight size={14} />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 md:px-0">
        {/* Stacked List (Left) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
           {others.map((ep) => (
             <div key={ep.id} className="group cursor-pointer flex gap-4 items-start" onClick={() => onVideoClick(ep.videoId)}>
                <div className="w-40 aspect-video rounded-xl bg-gray-800 overflow-hidden relative border border-white/5 shadow-lg shrink-0">
                   <VideoThumbnail 
                     src={ep.thumbnail} 
                     alt={ep.title} 
                     videoId={ep.videoId}
                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                   />
                   <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                         <Play size={14} fill="currentColor" className="text-white ml-1" />
                      </div>
                   </div>
                </div>
                <div>
                   <h4 className="text-white font-bold text-sm leading-tight group-hover:text-red-500 transition-colors line-clamp-3">{ep.title}</h4>
                   <p className="text-gray-500 text-[10px] font-medium mt-2 uppercase tracking-wide">Watch Now</p>
                </div>
             </div>
           ))}
        </div>

        {/* Featured Item (Right) */}
        <div className="lg:col-span-2 group cursor-pointer relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl" onClick={() => onVideoClick(latest.videoId)}>
            <div className="absolute inset-0 bg-gray-900">
               <VideoThumbnail 
                 src={latest.thumbnail} 
                 alt={latest.title} 
                 videoId={latest.videoId}
                 className="w-full h-full object-cover opacity-80 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-90"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 flex flex-col items-start">
               <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-4 shadow-lg">Latest Episode</span>
               <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-red-400 transition-colors shadow-black drop-shadow-md">{latest.title}</h3>
               <div className="flex items-center gap-3 group/btn">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black group-hover/btn:bg-red-600 group-hover/btn:text-white transition-all shadow-lg">
                     <Play size={24} fill="currentColor" className="ml-1" />
                  </div>
                  <span className="text-white font-bold text-sm tracking-widest uppercase opacity-0 -translate-x-4 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300">Watch Now</span>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const EpisodeGrid = ({ title, description, episodes, onViewAll, onVideoClick }) => (
  <div className="py-12">
    <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 px-4 md:px-0 gap-4">
      <div>
        <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
        {description && <p className="text-gray-400 text-sm max-w-2xl">{description}</p>}
      </div>
      {onViewAll && (
        <button className="text-xs md:text-sm font-medium text-gray-400 hover:text-white flex items-center gap-2 transition-colors uppercase tracking-wider whitespace-nowrap">
          View Full Playlist <ChevronRight size={14} />
        </button>
      )}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
      {episodes.map((ep) => (
        <div key={ep.id} className="group cursor-pointer" onClick={() => onVideoClick(ep.videoId)}>
          <div className="aspect-video rounded-xl bg-gray-800 overflow-hidden mb-3 relative border border-white/5 shadow-lg">
             <VideoThumbnail 
               src={ep.thumbnail} 
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
  <section className="py-24 bg-[#020617]">
    <Container>
      <div className="text-center mb-16">
         <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Meet the Hosts</h2>
         <div className="w-24 h-1 bg-red-500 mx-auto rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-5xl mx-auto">
        {HOSTS.map((host, i) => (
          <div key={i} className="bg-[#0A1128] rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 border border-white/5 hover:border-white/10 transition-all group hover:-translate-y-1 shadow-xl">
            <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full overflow-hidden border-4 border-[#020617] shadow-xl group-hover:border-red-500/50 transition-colors duration-300">
              <img src={getAssetPath(host.image)} alt={host.name} className="w-full h-full object-cover" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-1">{host.name}</h3>
              <p className="text-red-400 text-sm font-medium uppercase tracking-widest mb-4">{host.role}</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{host.bio}</p>
              <div className="flex justify-center md:justify-start gap-4">
                <a 
                  href={host.socials.youtube} 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all"
                  aria-label="YouTube"
                >
                  <Youtube size={18} />
                </a>
                <a 
                  href={host.socials.instagram} 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a 
                  href={host.socials.twitter} 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-all"
                  aria-label="Twitter"
                >
                  <Twitter size={18} />
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
  <section className="py-24 bg-[#020617]">
    <Container>
      <div className="text-center mb-16">
         <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What People Say</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="bg-[#0A1128] p-8 rounded-3xl hover:bg-[#0D1425] transition-all duration-300 border border-white/5 flex flex-col hover:-translate-y-1 shadow-lg hover:shadow-xl items-center text-center justify-center min-h-[200px]">
            <div className="relative">
               <p className="text-gray-300 text-sm leading-relaxed italic">"{t.text}"</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

const Podcast = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

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
      <HeroSection />
      
      {/* Spacer to account for the negative margin overlap */}
      <div className="pt-24">
        <PlatformLinks />
      </div>

      <HostsSection />
      
      <Container className="py-12">
        <FeaturedGrid 
          title="In The World" 
          description="Documentaries with the goal of sharing raw & authentic stories of success, failure, and everything in between."
          episodes={IN_THE_WORLD} 
          onViewAll 
          onVideoClick={handleVideoClick}
        />
        {SEASONS.map((season) => (
          <EpisodeGrid key={season.id} title={season.title} episodes={season.episodes} onViewAll onVideoClick={handleVideoClick} />
        ))}
      </Container>

      <TestimonialsSection />

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
