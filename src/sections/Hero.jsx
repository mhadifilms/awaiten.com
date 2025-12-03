import React from 'react';
import { motion } from 'framer-motion';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';

// Floating 3D Image Component
const FloatingImage = ({ src, alt, delay, x, y, scale = 1, glowColor = "rgba(255,255,255,0.1)" }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ 
      opacity: 1, 
      x: [x - 15, x + 15, x - 15], 
      y: [y - 15, y + 15, y - 15],
    }}
    transition={{ 
      opacity: { duration: 1, delay },
      x: { duration: 6, repeat: Infinity, ease: "easeInOut", delay },
      y: { duration: 8, repeat: Infinity, ease: "easeInOut", delay }
    }}
    className="absolute z-10"
    style={{ top: '50%', left: '50%', transform: `translate(-50%, -50%)` }}
  >
    <div 
      style={{ transform: `translate(${x}px, ${y}px) scale(${scale})` }} 
      className="relative"
    >
      {/* Glow Effect */}
      <div 
        className="absolute inset-0 blur-3xl rounded-full"
        style={{ 
          background: glowColor,
          width: '150%',
          height: '150%',
          top: '-25%',
          left: '-25%',
        }}
      />
      <img 
        src={src} 
        alt={alt}
        className="relative w-56 md:w-72 lg:w-80 h-auto z-10"
        style={{ 
          filter: 'drop-shadow(0 0 60px rgba(255,255,255,0.4)) brightness(1.2) contrast(1.1)',
          willChange: 'transform',
          imageRendering: 'high-quality'
        }}
        onError={(e) => {
          console.error('Image failed to load:', src);
          e.target.style.display = 'none';
        }}
        onLoad={() => console.log('Image loaded:', src)}
      />
    </div>
  </motion.div>
);

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-background">
      
      {/* Massive Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <h1 className="text-[20vw] md:text-[18vw] font-black text-white/[0.02] whitespace-nowrap tracking-tighter leading-none">
          AWAITEN FILMS
        </h1>
      </div>

      {/* Rich Background Gradient */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-background to-background" />
      </div>

      <Container className="relative z-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white">
            Awaiten Films
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto">
            Bringing your story to life.
          </p>
          
          {/* Button */}
          <div className="mt-8">
            <Button variant="primary" className="px-8 py-4 text-base rounded-full">
              View our work
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br from-gray-600 to-gray-800 overflow-hidden">
                  <div className="w-full h-full bg-gray-700" />
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-400">50+ Happy Clients</span>
          </div>
        </motion.div>
      </Container>

      {/* Floating 3D Elements */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Camera - Top Left (Orange glow) */}
        <FloatingImage 
          src="/images/camera.png"
          alt="Camera"
          x={-250} 
          y={-150} 
          delay={0} 
          scale={1.1}
          glowColor="rgba(251, 146, 60, 0.2)"
        />
        
        {/* Monitor - Top Right (Blue glow) */}
        <FloatingImage 
          src="/images/monitor.png"
          alt="Monitor"
          x={250} 
          y={-130} 
          delay={1} 
          scale={1.0}
          glowColor="rgba(59, 130, 246, 0.2)"
        />
        
        {/* Drone - Mid Left (Purple/Pink glow) */}
        <FloatingImage 
          src="/images/drone.png"
          alt="Drone"
          x={-320} 
          y={-10} 
          delay={0.5} 
          scale={1.0}
          glowColor="rgba(168, 85, 247, 0.2)"
        />
        
        {/* Action Camera - Mid Right (Red glow) */}
        <FloatingImage 
          src="/images/action-camera.png"
          alt="Action Camera"
          x={320} 
          y={10} 
          delay={1.2} 
          scale={0.9}
          glowColor="rgba(239, 68, 68, 0.2)"
        />
        
        {/* Mic - Bottom Left (Orange glow) */}
        <FloatingImage 
          src="/images/mic.png"
          alt="Microphone"
          x={-240} 
          y={140} 
          delay={2} 
          scale={0.95}
          glowColor="rgba(251, 146, 60, 0.2)"
        />
        
        {/* Headphones - Bottom Right (Teal glow) */}
        <FloatingImage 
          src="/images/monitor.png"
          alt="Headphones"
          x={240} 
          y={160} 
          delay={1.5} 
          scale={0.85}
          glowColor="rgba(20, 184, 166, 0.2)"
        />
        
        {/* Note: Headphones image not downloaded yet, will add placeholder or download */}
      </div>
    </section>
  );
};

export default Hero;
