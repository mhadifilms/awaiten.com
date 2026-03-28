import React from 'react';
import { motion } from 'framer-motion';

const BlurReveal = ({ text, className = "", delay = 0, duration = 0.4 }) => {
  const words = text.split(" ");

  return (
    <h1 className={className}>
      {words.map((word, wordIndex) => {
        // Calculate the starting index for this word based on previous words length
        // This ensures the stagger is continuous across the whole sentence
        const previousCharsCount = words
          .slice(0, wordIndex)
          .reduce((acc, w) => acc + w.length, 0);
        
        return (
          <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em] last:mr-0">
            {word.split("").map((char, charIndex) => (
              <motion.span
                key={charIndex}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{
                  duration: duration,
                  delay: delay + (previousCharsCount + charIndex) * 0.03, // Faster stagger (0.03 vs 0.05)
                  ease: "easeOut",
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </span>
        );
      })}
    </h1>
  );
};

export default BlurReveal;
