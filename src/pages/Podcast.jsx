import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Mic, 
  Instagram, 
  Twitter, 
  Youtube, 
  ChevronRight, 
  ChevronLeft,
  Music
} from 'lucide-react';
import Section from '../components/ui/Section';
import Container from '../components/ui/Container';
import AnimatedHeading from '../components/ui/AnimatedHeading';
import Button from '../components/ui/Button';
import { getAssetPath } from '../utils/assets';

// --- Icons ---

const TikTokIcon = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const ShortsIcon = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33c-.77-.32-1.96-.32-1.96-.32s-.1-1.14-.32-1.97a3.32 3.32 0 0 0-5.32-1.4H10l-1.66-1.6C9.5 3.8 11.15 3 13 3a5.5 5.5 0 0 1 5.5 5.5c0 .65-.13 1.26-.36 1.82zM6.23 13.67c.77.32 1.96.32 1.96.32s.1 1.14.32 1.97a3.32 3.32 0 0 0 5.32 1.4H14l1.66 1.6c-1.17 1.22-2.82 2.03-4.66 2.03a5.5 5.5 0 0 1-5.5-5.5c0-.65.13-1.26.36-1.82z"/>
    <path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm0-2c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="none"/>
  </svg>
);

// --- Mock Data ---

const SEASONS = [
  {
    id: 's3',
    title: 'Season 3',
    episodes: [
      { id: '3-1', title: 'Law Enforcement Myths', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' },
      { id: '3-2', title: 'Muslim Cop Experience', thumbnail: 'https://img.youtube.com/vi/LXb3EKWsInQ/maxresdefault.jpg' },
      { id: '3-3', title: 'Community Stories', thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg' },
      { id: '3-4', title: 'Faith in Action', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' },
    ]
  },
  {
    id: 's2',
    title: 'Season 2',
    episodes: [
      { id: '2-1', title: 'The Art of Storytelling', thumbnail: 'https://img.youtube.com/vi/LXb3EKWsInQ/maxresdefault.jpg' },
      { id: '2-2', title: 'Digital Age Dawah', thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg' },
      { id: '2-3', title: 'Creative Muslims', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' },
      { id: '2-4', title: 'Breaking Barriers', thumbnail: 'https://img.youtube.com/vi/LXb3EKWsInQ/maxresdefault.jpg' },
    ]
  },
];

const TRENDING = [
  { id: 't1', title: 'The Secret to 1 Billion Views', thumbnail: 'https://img.youtube.com/vi/LXb3EKWsInQ/maxresdefault.jpg' },
  { id: 't2', title: 'Reclaiming Identity', thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg' },
  { id: 't3', title: 'Comedy in Islam', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' },
  { id: 't4', title: 'Mental Health', thumbnail: 'https://img.youtube.com/vi/LXb3EKWsInQ/maxresdefault.jpg' },
];

const TESTIMONIALS = [
  {
    id: 1,
    text: "Journey Tellers was the channel for me to learn from new mentors who taught me new life lessons. It has been a beacon to get inspiration and personal growth.",
    author: "Sima",
    image: "/images/reviews/Sima.jpg"
  },
  {
    id: 2,
    text: "The stories on the podcast are incredibly inspiring and have given me some ideas of how I can improve myself and what I could actually do despite my limitations.",
    author: "Sahar",
    image: "/images/reviews/Sahar.png"
  },
  {
    id: 3,
    text: "The hosts are charismatic, engaging, and passionate... I am able to connect on a personal level, while obtaining priceless experiences, lessons, and insights.",
    author: "Isa",
    image: "/images/reviews/Isa.jpg"
  },
  {
    id: 4,
    text: "These young men are doing amazing work spotlighting our diverse and talented community. I look forward to seeing it grow to greater heights.",
    author: "Ruqayya",
    image: "/images/reviews/Ruqayya.jpg"
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

// --- Sub-Components ---

const HeroSection = () => (
  <section className="relative min-h-[90vh] flex items-center pt-20 pb-12 overflow-hidden bg-[#0A1128]">
    {/* Stylized Background */}
    <div className="absolute inset-0 bg-[url('/images/cms/3fIIPenDTFHDAU24jUoC5VVEoU.jpg')] bg-cover bg-center opacity-20" />
    <div className="absolute inset-0 bg-gradient-to-b from-[#0A1128] via-transparent to-[#0A1128]" />
    
    {/* Top Nav Elements (Absolute) */}
    <div className="absolute top-6 right-6 md:right-12 z-50 hidden md:flex gap-6 items-center text-sm font-medium">
       <Button variant="primary" className="bg-[#F5F5DA] text-black px-6 py-2 rounded-full font-bold hover:bg-white transition-colors">
         Support Us
       </Button>
    </div>

    <Container className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-left"
      >
        <div className="flex items-center gap-3 mb-6">
           <h2 className="text-white font-bold text-xl tracking-tight">Journey Tellers</h2>
           <span className="text-xs text-gray-400 tracking-[0.2em] uppercase border-l border-gray-600 pl-3">
             Real People. Real Stories. Real Insights.
           </span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-[0.9]">
          This, This, <br /> and That
        </h1>
        <p className="text-red-500 tracking-widest text-sm font-semibold uppercase mb-6">
          The Journey of This Person
        </p>
        
        <p className="text-gray-400 text-lg max-w-lg mb-10 leading-relaxed">
          Ea enim aliqua dolor pariatur proident cillum in consequat do laboris incididunt proident ullamco ut. Tempor laboris nulla fugiat dolore irure qui occaecat ex tempor.
        </p>

        {/* Custom Player Controls Mockup */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-4 mb-8 max-w-md group hover:bg-white/10 transition-colors cursor-pointer">
           <button className="w-12 h-12 shrink-0 rounded-full bg-[#F5F5DA] flex items-center justify-center text-black hover:scale-105 transition-transform">
             <Play size={20} fill="currentColor" className="ml-1" />
           </button>
           <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-red-500 rounded-full relative">
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm"></div>
              </div>
           </div>
           <span className="text-xs text-gray-400 font-mono whitespace-nowrap">12:45 / 45:00</span>
           <Button variant="outline" className="hidden sm:flex text-xs px-3 py-1 border-white/20 text-white rounded-full whitespace-nowrap hover:bg-white/10 items-center gap-1">
             Episode Page <ChevronRight size={12} />
           </Button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
         {/* Video Container */}
         <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5 bg-black group">
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 pointer-events-none group-hover:bg-black/20 transition-colors">
              <p className="text-white/50 font-bold tracking-widest uppercase text-sm">Auto-Playing Video</p>
            </div>
            <iframe 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=0&loop=1&playlist=dQw4w9WgXcQ" 
              title="Latest Episode"
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
         </div>
         
         {/* Decorative Elements */}
         <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
         <div className="absolute -top-6 -left-6 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      </motion.div>
    </Container>
  </section>
);

const PlatformLinks = () => (
  <section className="py-12 bg-[#0A1128]">
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Clips */}
        <div className="bg-[#161F38] rounded-3xl p-8 flex flex-col items-center text-center hover:bg-[#1c2845] transition-colors group cursor-pointer border border-white/5">
          <h3 className="text-xl font-bold text-white mb-6">Clips</h3>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg">
               <Instagram size={24} />
             </div>
             <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white group-hover:scale-110 transition-transform delay-75 shadow-lg border border-white/10">
               <TikTokIcon size={20} />
             </div>
             <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform delay-100 shadow-lg">
               <ShortsIcon size={20} />
             </div>
          </div>
        </div>

        {/* Watch */}
        <div className="bg-[#161F38] rounded-3xl p-8 flex flex-col items-center text-center hover:bg-[#1c2845] transition-colors group cursor-pointer border border-white/5">
          <h3 className="text-xl font-bold text-white mb-6">Watch</h3>
          <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-900/30 group-hover:scale-110 transition-transform">
            <Youtube size={32} fill="currentColor" />
          </div>
        </div>

        {/* Listen */}
        <div className="bg-[#161F38] rounded-3xl p-8 flex flex-col items-center text-center hover:bg-[#1c2845] transition-colors group cursor-pointer border border-white/5">
          <h3 className="text-xl font-bold text-white mb-6">Listen</h3>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-[#1DB954] flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg">
               <Music size={20} />
             </div>
             <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform delay-75 shadow-lg">
               <Mic size={20} />
             </div>
             <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform delay-100 shadow-lg">
               <Mic size={20} />
             </div>
          </div>
        </div>
      </div>
    </Container>
  </section>
);

const EpisodeGrid = ({ title, episodes, onViewAll }) => (
  <div className="py-12">
    <div className="flex justify-between items-end mb-6 px-4 md:px-0">
      <h3 className="text-2xl md:text-3xl font-bold text-white">{title}</h3>
      <button className="text-xs md:text-sm font-medium text-gray-400 hover:text-white flex items-center gap-2 transition-colors uppercase tracking-wider">
        View Full Playlist <ChevronRight size={14} />
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-0">
      {episodes.map((ep) => (
        <div key={ep.id} className="group cursor-pointer">
          <div className="aspect-video rounded-xl bg-gray-800 overflow-hidden mb-3 relative border border-white/5 shadow-lg">
             <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                   <Play size={20} fill="currentColor" className="text-white ml-1" />
                </div>
             </div>
          </div>
          <h4 className="text-white font-bold text-lg leading-tight group-hover:text-red-500 transition-colors">{ep.title}</h4>
          <p className="text-gray-500 text-xs font-medium mt-1 uppercase tracking-wide">Journey of This Person</p>
        </div>
      ))}
    </div>
  </div>
);

const HostsSection = () => (
  <section className="py-24 bg-[#0D1425]">
    <Container>
      <div className="text-center mb-16">
         <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Meet the Hosts</h2>
         <div className="w-24 h-1 bg-red-500 mx-auto rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-5xl mx-auto">
        {HOSTS.map((host, i) => (
          <div key={i} className="bg-[#161F38] rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 border border-white/5 hover:border-white/10 transition-all group hover:-translate-y-1">
            <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full overflow-hidden border-4 border-[#0A1128] shadow-xl group-hover:border-red-500/50 transition-colors duration-300">
              <img src={getAssetPath(host.image)} alt={host.name} className="w-full h-full object-cover" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-1">{host.name}</h3>
              <p className="text-red-400 text-sm font-medium uppercase tracking-widest mb-4">{host.role}</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{host.bio}</p>
              <div className="flex justify-center md:justify-start gap-4">
                <a href={host.socials.youtube} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all"><Youtube size={18} /></a>
                <a href={host.socials.instagram} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all"><Instagram size={18} /></a>
                <a href={host.socials.twitter} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-all"><Twitter size={18} /></a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

const TestimonialsSection = () => (
  <section className="py-24 bg-[#0A1128]">
    <Container>
      <div className="text-center mb-16">
         <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What People Say</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TESTIMONIALS.map((t) => (
          <div key={t.id} className="bg-[#161F38] p-8 rounded-3xl hover:bg-[#1c2845] transition-all duration-300 border border-white/5 flex flex-col hover:-translate-y-1 shadow-lg hover:shadow-xl">
            <div className="mb-6">
               <div className="flex gap-1 mb-4 text-yellow-500">
                 {[1,2,3,4,5].map(s => <span key={s}>★</span>)}
               </div>
               <p className="text-gray-300 text-sm leading-relaxed italic">"{t.text}"</p>
            </div>
            <div className="mt-auto flex items-center gap-4 pt-4 border-t border-white/5">
               <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 shrink-0">
                 {t.image ? (
                   <img src={getAssetPath(t.image)} alt={t.author} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-xs text-white font-bold">{t.author[0]}</div>
                 )}
               </div>
               <p className="text-white font-bold text-sm">{t.author}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

const ContactSection = () => (
  <section id="contact" className="py-24 bg-[#0D1425]">
    <Container className="max-w-xl text-center">
      <h2 className="text-3xl font-bold text-white mb-12">Contact Us</h2>
      <form className="space-y-4">
        <input 
          type="text" 
          placeholder="Your name" 
          className="w-full bg-[#161F38] border border-white/5 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-all"
        />
        <input 
          type="email" 
          placeholder="Your email" 
          className="w-full bg-[#161F38] border border-white/5 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-all"
        />
        <textarea 
          placeholder="Your message" 
          rows={5}
          className="w-full bg-[#161F38] border border-white/5 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-all resize-none"
        />
        <div className="flex justify-center pt-6">
          <button className="bg-[#F5F5DA] text-black px-12 py-3 rounded-full font-bold hover:bg-white hover:scale-105 transition-all shadow-xl shadow-yellow-900/10">
            Send
          </button>
        </div>
      </form>
      <p className="text-gray-500 text-xs mt-12">© The Journey Tellers Podcast 2025</p>
      <div className="flex justify-center gap-6 mt-4 text-gray-500">
        <Youtube size={20} className="hover:text-white cursor-pointer transition-colors" />
        <Instagram size={20} className="hover:text-white cursor-pointer transition-colors" />
        <Twitter size={20} className="hover:text-white cursor-pointer transition-colors" />
      </div>
    </Container>
  </section>
);

const Podcast = () => {
  return (
    <main className="bg-[#0A1128] text-white min-h-screen overflow-x-hidden font-sans">
      <HeroSection />
      
      {/* Story Strip */}
      <div className="relative py-32 overflow-hidden flex items-center justify-center bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/images/pages/Documentary.jpg')" }}>
        <div className="absolute inset-0 bg-[#0A1128]/80 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-transparent to-[#0A1128]"></div>
        <Container className="relative z-10">
           <div className="relative">
              {/* Text Shadow/Outline Effect */}
              <h2 className="text-5xl md:text-7xl lg:text-9xl font-black text-transparent text-center tracking-tighter uppercase select-none" 
                  style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                What's Your Story?
              </h2>
              <div className="absolute inset-0 flex items-center justify-center">
                 <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-white text-center tracking-tighter uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                   What's Your Story?
                 </h2>
              </div>
           </div>
        </Container>
      </div>

      <PlatformLinks />
      
      <Container className="py-12">
        <EpisodeGrid title="Trending Now" episodes={TRENDING} />
        {SEASONS.map((season) => (
          <EpisodeGrid key={season.id} title={season.title} episodes={season.episodes} />
        ))}
      </Container>

      <HostsSection />
      <TestimonialsSection />

      {/* Partners */}
      <section className="py-20 bg-[#0A1128] border-t border-white/5">
        <Container>
          <h3 className="text-center text-2xl text-white font-bold mb-16">In Partnership With</h3>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
             <div className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer grayscale hover:grayscale-0">
                <div className="w-12 h-12 bg-white rounded-full"></div>
                <span className="text-xl font-bold text-white">AL-KISA<br/><span className="text-xs font-normal tracking-widest">FOUNDATION</span></span>
             </div>
             <div className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer grayscale hover:grayscale-0">
                <div className="w-12 h-12 bg-white rounded-md rotate-45"></div>
                <span className="text-xl font-bold text-white">The Academy<br/><span className="text-xs font-normal tracking-widest">FOR LEARNING ISLAM</span></span>
             </div>
             <div className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer grayscale hover:grayscale-0">
                <span className="text-2xl font-black text-white tracking-tighter">&lt;ReKompile&gt;</span>
             </div>
          </div>
        </Container>
      </section>

      <ContactSection />
    </main>
  );
};

export default Podcast;
