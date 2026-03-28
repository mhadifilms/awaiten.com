// Animation presets for consistent motion across the app

// Transition presets
export const transitions = {
  spring: {
    type: "spring",
    stiffness: 100,
    damping: 20,
  },
  smooth: {
    type: "tween",
    ease: "easeInOut",
    duration: 0.5,
  },
  slow: {
    type: "tween",
    ease: "easeInOut",
    duration: 0.8,
  },
};

// Fade In Variants
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: transitions.smooth,
};

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: transitions.smooth,
};

export const fadeInDown = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0 },
  transition: transitions.smooth,
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: transitions.smooth,
};

export const fadeInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: transitions.smooth,
};

// Scale Variants
export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: transitions.spring,
};

export const scaleUp = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  transition: transitions.spring,
};

// Container/Stagger Variants
export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  animate: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// Hover Variants
export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.2 },
};

export const hoverLift = {
  whileHover: { y: -5 },
  transition: { duration: 0.2 },
};

// Floating Animation (for Hero)
export const floating = (delay = 0, xOffset = 15, yOffset = 15) => ({
  animate: {
    y: [0 - yOffset, 0 + yOffset, 0 - yOffset],
    x: [0 - xOffset, 0 + xOffset, 0 - xOffset],
    transition: {
      y: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      },
      x: {
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      },
    },
  },
});

// Legacy exports for backward compatibility (deprecated, prefer using named exports above)
export const fadeInUpDelayed = (delay = 0.2) => ({
  ...fadeInUp,
  transition: { ...fadeInUp.transition, delay },
});

export const staggerItem = (delay = 0.1) => ({
  ...fadeInUp,
  transition: { ...fadeInUp.transition, delay },
});

export const slideIn = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3 },
};
