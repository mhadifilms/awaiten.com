import React from 'react';
import Section from '../components/ui/Section';
import AnimatedHeading from '../components/ui/AnimatedHeading';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import MotionBox from '../components/ui/MotionBox';

const founders = [
  {
    id: 'hadi',
    name: 'Muhammad Hadi Yusufali',
    role: 'Co-Founder & Creative Director',
    image: '/images/mhadi.jpg',
    bio: 'M Hadi is a filmmaker, multimedia content creator, and co-founder of Awaiten, blending cinematic storytelling, digital media, and generative AI to create content that feels human, intentional, and genuinely memorable.',
    link: 'https://mhadi.tv',
    linkText: 'mhadi.tv'
  },
  {
    id: 'aalyan',
    name: 'Aalyan Aamir',
    role: 'Co-Founder & Lead Producer',
    image: '/images/aalyan.jpg',
    bio: 'Aalyan Aamir is a UC Berkeley physics student, researcher at Berkeley Lab, and co-founder of Awaiten, bringing a mix of technical rigor, drone cinematography, and community-driven storytelling to the studio.',
    link: 'https://aalyan.me',
    linkText: 'aalyan.me'
  }
];

const About = () => {
  return (
    <Section id="about" className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <MotionBox
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute -left-[10%] top-[20%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"
        />
        <MotionBox
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute -right-[10%] bottom-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10">
        <AnimatedHeading>The Team</AnimatedHeading>

        {/* Company Intro */}
        <MotionBox
          variant="fadeInUp"
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <h3 className="text-2xl md:text-3xl font-medium text-white mb-6">
            Writing your story as you read it.
          </h3>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            Awaiten is a Bay Area-based production company dedicated to sharing real stories 
            and experiences with the world. With over 7 years of experience and 1M+ views, 
            we combine technical expertise with narrative depth to create compelling visual content.
          </p>
        </MotionBox>

        {/* Founders Grid */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
          {founders.map((founder, index) => (
            <MotionBox
              key={founder.id}
              variant="fadeInUp"
              delay={index * 0.2}
              className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-colors duration-500"
            >
              {/* Image Header */}
              <div className="aspect-[3/4] md:aspect-square relative overflow-hidden">
                <ImageWithFallback
                  src={founder.image}
                  alt={founder.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Enhanced Gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                
                {/* Text Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col justify-end z-10">
                  <div className="transform md:translate-y-[140px] group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {founder.name}
                    </h3>
                    <p className="text-blue-400 font-medium mb-4 tracking-wide uppercase text-xs md:text-sm">
                      {founder.role}
                    </p>
                    
                    <div className="md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 ease-in-out delay-75 space-y-4 h-[140px]">
                      <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-4">
                        {founder.bio}
                      </p>
                      
                      <a 
                        href={founder.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-white font-medium hover:text-blue-400 transition-colors group/link"
                      >
                        <span className="border-b border-white/30 group-hover/link:border-blue-400 pb-0.5 transition-colors">
                          {founder.linkText}
                        </span>
                        <svg className="w-4 h-4 ml-2 opacity-70 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </MotionBox>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default About;
