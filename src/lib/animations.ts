/**
 * Framer Motion Animation Variants & Utilities
 * Reusable animation configurations for consistent UI motion
 */

import { Variants, Transition } from "framer-motion";

// Spring configurations
export const spring = {
  type: "spring",
  stiffness: 400,
  damping: 25,
} as const;

export const smoothSpring = {
  type: "spring",
  stiffness: 300,
  damping: 30,
} as const;

export const softSpring = {
  type: "spring",
  stiffness: 200,
  damping: 20,
} as const;

// Fade animations
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: smoothSpring },
  exit: { opacity: 0, y: 20 },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0, transition: smoothSpring },
  exit: { opacity: 0, y: -20 },
};

export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: smoothSpring },
  exit: { opacity: 0, x: -20 },
};

export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: smoothSpring },
  exit: { opacity: 0, x: 20 },
};

// Scale animations
export const scaleIn: Variants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: spring },
  exit: { scale: 0.9, opacity: 0 },
};

export const scaleUp: Variants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: smoothSpring },
  exit: { scale: 0.95, opacity: 0 },
};

// Hover animations
export const lift: Variants = {
  hover: {
    y: -8,
    transition: spring,
  },
  tap: {
    y: -4,
  },
};

export const scaleHover: Variants = {
  hover: {
    scale: 1.05,
    transition: spring,
  },
  tap: {
    scale: 0.98,
  },
};

export const buttonTap: Variants = {
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

// Stagger container
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerFastContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerSlowContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.15,
    },
  },
};

// Card animations
export const cardHover: Variants = {
  hover: {
    y: -8,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
    transition: spring,
  },
};

export const cardEntry: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: smoothSpring,
  },
};

// Slide animations
export const slideInFromRight: Variants = {
  initial: { x: "100%" },
  animate: { x: 0, transition: smoothSpring },
  exit: { x: "100%", transition: smoothSpring },
};

export const slideInFromLeft: Variants = {
  initial: { x: "-100%" },
  animate: { x: 0, transition: smoothSpring },
  exit: { x: "-100%", transition: smoothSpring },
};

export const slideInFromTop: Variants = {
  initial: { y: "-100%" },
  animate: { y: 0, transition: smoothSpring },
  exit: { y: "-100%", transition: smoothSpring },
};

export const slideInFromBottom: Variants = {
  initial: { y: "100%" },
  animate: { y: 0, transition: smoothSpring },
  exit: { y: "100%", transition: smoothSpring },
};

// Modal/Dialog animations
export const modalBackdrop: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const modalContent: Variants = {
  initial: { scale: 0.9, opacity: 0, y: 20 },
  animate: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: spring,
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 },
  },
};

// Page transitions
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

// Progress bar animation
export const progressBar: Variants = {
  initial: { scaleX: 0, originX: 0 },
  animate: { scaleX: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

// Icon animations
export const iconSpin: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export const iconBounce: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const iconPulse: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// List item animations
export const listItem: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: smoothSpring,
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.2 },
  },
};

// Utility functions
export const getStaggerDelay = (index: number, delay = 0.1) => ({
  transition: { delay: index * delay },
});

export const getReducedMotionVariant = (variants: Variants): Variants => {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.2 } },
      exit: { opacity: 0, transition: { duration: 0.2 } },
    };
  }
  return variants;
};

// Transition presets
export const transitions = {
  fast: { duration: 0.2, ease: "easeOut" } as Transition,
  normal: { duration: 0.3, ease: "easeInOut" } as Transition,
  slow: { duration: 0.5, ease: "easeInOut" } as Transition,
  spring: spring as Transition,
  smoothSpring: smoothSpring as Transition,
  softSpring: softSpring as Transition,
};
