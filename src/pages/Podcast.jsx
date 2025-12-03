import React from 'react';
import Section from '../components/ui/Section';
import AnimatedHeading from '../components/ui/AnimatedHeading';
import { motion } from 'framer-motion';
import { fadeInUp } from '../constants/animations';

const episodes = [
  {
    id: 'episode-1',
    title: 'Law Enforcement Myths & Being a Muslim Cop',
    subtitle: 'ft. Irfan Zaidi',
    videoId: 'dQw4w9WgXcQ', // TODO: Replace with actual video ID (e.g. from YouTube URL)
    description: 'Irfan Zaidi joins us to discuss the misconceptions about law enforcement and his experience as a Muslim officer.',
  },
  {
    id: 'episode-2',
    title: 'The Secret to Getting 1 Billion Views with Comedy',
    subtitle: 'ft. Azfar Khan',
    videoId: 'LXb3EKWsInQ', // TODO: Replace with actual video ID
    description: 'Azfar Khan shares his journey in comedy and the secrets behind his viral success.',
  },
  {
    id: 'episode-3',
    title: 'The Ultimate Guide to Reclaiming Your Identity',
    subtitle: 'ft. Maulana Abidi, Sheikh Salim, and Sheikh Mehdi',
    videoId: 'jNQXAC9IVRw', // TODO: Replace with actual video ID
    description: 'A deep dive into identity, faith, and community with our esteemed guests.',
  }
];

const VideoCard = ({ video, index }) => {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      variants={fadeInUp}
      viewport={{ once: true }}
      custom={index}
      className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors duration-300 group"
    >
      <div className="relative pb-[56.25%] h-0 bg-black/20">
        <iframe
          src={`https://www.youtube.com/embed/${video.videoId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full border-0"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-1 text-white group-hover:text-red-500 transition-colors">{video.title}</h3>
        {video.subtitle && <p className="text-red-400 text-sm mb-3 font-medium">{video.subtitle}</p>}
        <p className="text-gray-400 text-sm leading-relaxed">{video.description}</p>
      </div>
    </motion.div>
  );
};

const Podcast = () => {
  return (
    <main className="min-h-screen bg-background text-primary overflow-x-hidden font-sans pt-20">
      <Section>
        <AnimatedHeading>Podcast</AnimatedHeading>
        <div className="max-w-2xl mx-auto text-center mb-16 -mt-8">
          <p className="text-gray-400 text-lg">
            Conversations that matter. Stories that inspire. Welcome to the Journey Tellers podcast.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {episodes.map((episode, index) => (
            <VideoCard key={episode.id} video={episode} index={index} />
          ))}
        </div>
        <div className="text-center mt-20">
            <p className="text-gray-400 mb-6">Watch more episodes on our YouTube channel</p>
            <a 
                href="https://www.youtube.com/@JourneyTellers" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-colors shadow-lg hover:shadow-red-900/20"
            >
                Visit Channel
            </a>
        </div>
      </Section>
    </main>
  );
};

export default Podcast;
