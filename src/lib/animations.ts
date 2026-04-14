import { Variants } from 'framer-motion';

/**
 * PERFORMANCE OPTIMIZED Animation Variants (Framer Motion 11+)
 *
 * Rules:
 * 1. Use ONLY transform & opacity (GPU-accelerated)
 * 2. Avoid animating width, height, padding, margins (layout-thrashing)
 * 3. Keep durations under 600ms (feels snappy)
 * 4. Use easeOut by default (natural feel)
 * 5. Stagger children with delays, not container transitions
 */

// Fade in animations (opacity only - GPU accelerated)
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Fade in up animations (translateY + opacity - GPU accelerated)
export const fadeInUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Slide in left (translateX + opacity)
export const slideInLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -24,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Slide in right (translateX + opacity)
export const slideInRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 24,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Scale in (scale + opacity)
export const scaleInVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

// Staggered container (parent - doesn't animate itself)
export const staggerContainerVariants: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

// Stagger item (child - animates separately)
export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

// Button hover animations (scale only - GPU accelerated)
export const buttonHoverVariants: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.15, ease: 'easeOut' },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.08, ease: 'easeIn' },
  },
};

// Card hover animations (translateY + opacity)
export const cardHoverVariants: Variants = {
  rest: { y: 0, opacity: 1 },
  hover: {
    y: -6,
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
};

// Page transition
export const pageTransitionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

// Icon hover spin
export const iconHoverVariants: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
};
