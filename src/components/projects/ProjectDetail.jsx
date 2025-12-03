import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImageWithFallback from '../ui/ImageWithFallback';
import { fadeInUp } from '../../constants/animations';

const ProjectDetail = ({ project }) => {
  return (
    <div className="space-y-16 md:space-y-24 pb-20">
      {/* Header Section */}
      <motion.div
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={fadeInUp.transition}
        className="text-center max-w-4xl mx-auto space-y-12 md:space-y-16 pt-10 md:pt-20"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          {project.title}
        </h1>

        {/* Project Meta Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
          {project.duration && (
            <div className="space-y-2">
              <h3 className="text-gray-400 text-sm uppercase tracking-wider font-medium">Duration</h3>
              <p className="text-xl md:text-2xl font-bold">{project.duration}</p>
            </div>
          )}
          
          {project.client && (
            <div className="space-y-2">
              <h3 className="text-gray-400 text-sm uppercase tracking-wider font-medium">Client</h3>
              <p className="text-xl md:text-2xl font-bold">{project.client}</p>
            </div>
          )}
          
          {project.deliverables && (
            <div className="space-y-2">
              <h3 className="text-gray-400 text-sm uppercase tracking-wider font-medium">Deliverables</h3>
              <p className="text-xl md:text-2xl font-bold">{project.deliverables}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Media Section (Video or Hero Image) */}
      <motion.div
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={{ ...fadeInUp.transition, delay: 0.2 }}
        className="w-full"
      >
        {project.videoEmbed ? (
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black/20">
            <div 
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: project.videoEmbed }}
            />
          </div>
        ) : (
          <div className="aspect-video w-full rounded-2xl overflow-hidden">
            <ImageWithFallback
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </motion.div>

      {/* Content Sections */}
      <div className="max-w-3xl mx-auto space-y-16 md:space-y-24">
        {/* About/Summary Section */}
        {project.about && (
          <motion.div
            initial={fadeInUp.initial}
            whileInView={fadeInUp.animate}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 text-center"
          >
            <h3 className="text-gray-400 text-sm uppercase tracking-wider font-medium">Summary</h3>
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
              {project.about}
            </div>
          </motion.div>
        )}

        {/* Dynamic Content (Our Involvement, About Client, etc) */}
        {project.content && (
          <motion.div
            initial={fadeInUp.initial}
            whileInView={fadeInUp.animate}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-invert prose-lg max-w-none space-y-12"
            dangerouslySetInnerHTML={{ __html: project.content }}
          />
        )}

        {/* Additional Info Fields mapped to specific sections if needed */}
        {(project.otherInfo1 || project.otherInfo2) && (
          <motion.div
            initial={fadeInUp.initial}
            whileInView={fadeInUp.animate}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
             {project.otherInfo1 && (
               <div className="space-y-4">
                 <h3 className="text-2xl font-bold">Our Involvement</h3>
                 <p className="text-gray-300 text-lg leading-relaxed">{project.otherInfo1}</p>
               </div>
             )}
             {project.otherInfo2 && (
               <div className="space-y-4">
                 <h3 className="text-2xl font-bold">About {project.client}</h3>
                 <p className="text-gray-300 text-lg leading-relaxed">{project.otherInfo2}</p>
               </div>
             )}
          </motion.div>
        )}
      </div>

      {/* Gallery Section */}
      {project.gallery && project.gallery.length > 0 && (
        <motion.div
          initial={fadeInUp.initial}
          whileInView={fadeInUp.animate}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h3 className="text-3xl font-bold text-center">Project Gallery</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {project.gallery.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-800"
              >
                <ImageWithFallback
                  src={image}
                  alt={`${project.title} gallery image ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectDetail;

