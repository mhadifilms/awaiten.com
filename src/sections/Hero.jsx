import React from 'react';
import { useLenis } from 'lenis/react';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import MotionBox from '../components/ui/MotionBox';
import BlurReveal from '../components/ui/BlurReveal';

// Floating 3D Image Component
const FloatingImage = ({ src, alt, delay, x, y, scale = 1, glowColor = "rgba(255,255,255,0.1)", className = "" }) => (
  <div
    className={`absolute z-10 ${className}`}
    style={{ 
      top: '50%', 
      left: '50%', 
      transform: `translate(calc(-50% + ${typeof x === 'number' ? x + 'px' : x}), calc(-50% + ${typeof y === 'number' ? y + 'px' : y}))` 
    }}
  >
    {/* Entrance Animation */}
    <MotionBox variant="fadeIn" delay={delay} duration={1}>
      {/* Floating Animation */}
      <MotionBox variant="floating" delay={delay}>
        <div 
          style={{ transform: `scale(${scale})` }} 
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
            className="relative w-24 md:w-32 lg:w-40 h-auto z-10"
            style={{ 
              filter: 'drop-shadow(0 0 60px rgba(255,255,255,0.4)) brightness(1.2) contrast(1.1)',
              willChange: 'transform',
              imageRendering: 'high-quality'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      </MotionBox>
    </MotionBox>
  </div>
);

const Hero = () => {
  const lenis = useLenis();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-background">
      
      {/* Massive Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <div className="whitespace-nowrap animate-scroll-text flex">
          {/* First Set */}
          <div className="flex shrink-0 items-center">
            <span className="text-[20vw] md:text-[18vw] font-black text-white/[0.02] tracking-tighter leading-none mx-8">
              AWAITEN FILMS
            </span>
            <span className="text-[20vw] md:text-[18vw] font-black text-white/[0.02] tracking-tighter leading-none mx-8">
              AWAITEN FILMS
            </span>
            <span className="text-[20vw] md:text-[18vw] font-black text-white/[0.02] tracking-tighter leading-none mx-8">
              AWAITEN FILMS
            </span>
          </div>
          {/* Duplicate Set for Seamless Loop */}
          <div className="flex shrink-0 items-center">
            <span className="text-[20vw] md:text-[18vw] font-black text-white/[0.02] tracking-tighter leading-none mx-8">
              AWAITEN FILMS
            </span>
            <span className="text-[20vw] md:text-[18vw] font-black text-white/[0.02] tracking-tighter leading-none mx-8">
              AWAITEN FILMS
            </span>
            <span className="text-[20vw] md:text-[18vw] font-black text-white/[0.02] tracking-tighter leading-none mx-8">
              AWAITEN FILMS
            </span>
          </div>
        </div>
      </div>

      {/* Rich Background Gradient */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-background to-background" />
      </div>

      <Container className="relative z-20 flex flex-col items-center text-center">
        <MotionBox
          variant="fadeInUp"
          duration={0.8}
          className="max-w-4xl mx-auto space-y-6"
        >
          <BlurReveal 
            text="The next Hollywood is unscripted." 
            className="text-4xl md:text-6xl font-bold text-white tracking-tight [&>span:last-child]:italic [&>span:last-child]:font-medium"
            delay={0.2}
          />
          <p className="body-large max-w-2xl mx-auto">
            Bringing your story to life.
          </p>
          
          {/* Button */}
          <div className="mt-8">
            <Button 
              variant="primary" 
              className="px-8 py-4 text-base rounded-full"
              onClick={() => {
                if (lenis) {
                  lenis.scrollTo('#work');
                } else {
                  document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Explore our work
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="flex -space-x-3">
              {[
                '/awaiten.com/images/reviews/Sahar.png',
                '/awaiten.com/images/reviews/Isa.jpg',
                '/awaiten.com/images/reviews/Ruqayya.jpg'
              ].map((src, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-gray-800">
                  <img 
                    src={src} 
                    alt={`Client ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-400">50+ Happy Clients</span>
          </div>
        </MotionBox>
      </Container>

      {/* Floating 3D Elements */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Camera - Top Left (Orange glow) */}
        <FloatingImage 
          src="/awaiten.com/images/home_icns/Camera.png"
          alt="Camera"
          x="-35vw" 
          y="-25vh" 
          delay={0} 
          scale={1.1}
          glowColor="rgba(251, 146, 60, 0.1)"
          className="hidden md:block"
        />
        <FloatingImage 
          src="/awaiten.com/images/home_icns/Camera.png"
          alt="Camera"
          x="-35vw" 
          y="-25vh" 
          delay={0} 
          scale={0.8}
          glowColor="rgba(251, 146, 60, 0.1)"
          className="md:hidden"
        />
        
        {/* Monitor - Top Right (Blue glow) */}
        <FloatingImage 
          src="/awaiten.com/images/home_icns/Computer.png"
          alt="Monitor"
          x="35vw" 
          y="-22vh" 
          delay={1} 
          scale={1.0}
          glowColor="rgba(59, 130, 246, 0.1)"
          className="hidden md:block"
        />
        <FloatingImage 
          src="/awaiten.com/images/home_icns/Computer.png"
          alt="Monitor"
          x="35vw" 
          y="-25vh" 
          delay={1} 
          scale={0.8}
          glowColor="rgba(59, 130, 246, 0.1)"
          className="md:hidden"
        />
        
        {/* Drone - Mid Left (Purple/Pink glow) */}
        <FloatingImage 
          src="/awaiten.com/images/home_icns/Drone.png"
          alt="Drone"
          x="-40vw" 
          y="-5vh" 
          delay={0.5} 
          scale={1.0}
          glowColor="rgba(168, 85, 247, 0.1)"
          className="hidden md:block"
        />
        
        {/* Action Camera - Mid Right (Red glow) */}
        <FloatingImage 
          src="/awaiten.com/images/home_icns/GoPro.png"
          alt="Action Camera"
          x="40vw" 
          y="5vh" 
          delay={1.2} 
          scale={0.9}
          glowColor="rgba(239, 68, 68, 0.1)"
          className="hidden md:block"
        />
        
        {/* Mic - Bottom Left (Orange glow) */}
        <FloatingImage 
          src="/awaiten.com/images/home_icns/Mic.png"
          alt="Microphone"
          x="-25vw" 
          y="25vh" 
          delay={2} 
          scale={0.95}
          glowColor="rgba(251, 146, 60, 0.1)"
          className="hidden md:block"
        />
        <FloatingImage 
          src="/awaiten.com/images/home_icns/Mic.png"
          alt="Microphone"
          x="-30vw" 
          y="25vh" 
          delay={2} 
          scale={0.8}
          glowColor="rgba(251, 146, 60, 0.1)"
          className="md:hidden"
        />
        
        {/* Headphones - Bottom Right (Teal glow) */}
        <FloatingImage 
          src="/awaiten.com/images/home_icns/Headphones.png"
          alt="Headphones"
          x="25vw" 
          y="30vh" 
          delay={1.5} 
          scale={0.85}
          glowColor="rgba(20, 184, 166, 0.1)"
          className="hidden md:block"
        />
        <FloatingImage 
          src="/awaiten.com/images/home_icns/Headphones.png"
          alt="Headphones"
          x="30vw" 
          y="25vh" 
          delay={1.5} 
          scale={0.8}
          glowColor="rgba(20, 184, 166, 0.1)"
          className="md:hidden"
        />
      </div>
    </section>
  );
};

export default Hero;
