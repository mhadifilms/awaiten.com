import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import MotionBox from '../components/ui/MotionBox';

const PodcastPreview = () => {
  return (
    <Section id="podcast-preview" className="relative overflow-hidden min-h-[60vh] flex items-center">
       {/* Background */}
       <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[url('/images/branding/PodcastBG.png')] bg-cover bg-center scale-105 blur-sm opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/95 via-[#020617]/80 to-[#020617]" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <MotionBox variant="fadeInLeft">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="h-[1px] w-12 bg-red-500"></div>
                    <span className="text-red-500 uppercase tracking-[0.2em] text-sm font-bold">Original Series</span>
                 </div>
                 
                 <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Journey Tellers</h2>
                 
                 <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                    Reading and writing the stories of the Muslim West. Celebrating entrepreneurs, chefs, doctors, animators, converts, and educators.
                 </p>
                 
                 <div className="flex flex-wrap gap-4">
                    <Link to="/podcast">
                        <Button variant="primary" className="px-8 rounded-full w-full sm:w-auto">
                            Learn More
                        </Button>
                    </Link>
                 </div>
            </MotionBox>

            <MotionBox variant="fadeInRight" className="relative mx-auto w-full max-w-xl lg:max-w-none">
                 <Link to="/podcast" className="block group relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <img 
                        src="https://img.youtube.com/vi/zkvAHvcw8DE/maxresdefault.jpg" 
                        alt="Journey Tellers Latest Episode" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30 shadow-2xl transition-all duration-300 group-hover:bg-red-600 group-hover:border-red-500 group-hover:scale-110">
                            <Play size={32} className="text-white ml-1" fill="currentColor" />
                        </div>
                    </div>
                    
                    {/* Overlay Text */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                        <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-1">
                            <span className="bg-red-600 text-white px-2 py-0.5 rounded-sm">Featured</span>
                            <span>Documentary</span>
                        </div>
                        <p className="text-white font-medium text-lg line-clamp-1 group-hover:text-red-400 transition-colors">
                            From the World to Within: Rekindling Faith at Camp Noor
                        </p>
                    </div>
                 </Link>
                 
                 {/* Decorative Elements */}
                 <div className="absolute -z-10 -top-6 -right-6 w-full h-full border border-white/5 rounded-2xl hidden md:block" />
                 <div className="absolute -z-20 -bottom-6 -left-6 w-full h-full bg-white/5 rounded-2xl hidden md:block blur-3xl opacity-20" />
            </MotionBox>
        </div>
    </Section>
  );
};

export default PodcastPreview;

