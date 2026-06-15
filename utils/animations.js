export const premiumEase = [0.22, 1, 0.36, 1];
export const premiumDuration = 0.35;

// Animation variants for Framer Motion
// Reusable across all components
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: premiumDuration, ease: premiumEase },
};
export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: premiumDuration, ease: premiumEase },
};
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3, ease: premiumEase },
};
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.3, ease: premiumEase },
};
export const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: { duration: premiumDuration, ease: premiumEase },
};
export const slideInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
  transition: { duration: premiumDuration, ease: premiumEase },
};
// Container animations - stagger children
export const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};
export const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: premiumDuration, ease: premiumEase },
  },
};
export const pageSlideUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 12 },
  transition: { duration: premiumDuration, ease: premiumEase },
};
export const hoverLift = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)",
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03)",
  },
};
export const filterPanelVariants = {
  closed: {
    opacity: 0,
    y: -12,
    height: 0,
    transition: { duration: 0.22, ease: premiumEase },
  },
  open: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: { duration: 0.28, ease: premiumEase },
  },
};
export const messageListVariants = {
  initial: { opacity: 1 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};
export const messageItemVariants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: premiumEase },
  },
};
export const notificationVariants = {
  initial: { opacity: 0, x: 24, y: -14, scale: 0.98 },
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: premiumEase },
  },
  exit: {
    opacity: 0,
    x: 16,
    transition: { duration: 0.22, ease: premiumEase },
  },
};
export const modalOverlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};
export const modalContentVariants = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 220, damping: 22 },
  },
  exit: { opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.2 } },
};
export const typingContainerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
export const typingDotVariants = {
  initial: { y: 0, opacity: 0.55 },
  animate: {
    y: [0, -4, 0],
    opacity: [0.45, 1, 0.45],
    transition: {
      duration: 0.9,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
// Hover animations
export const cardHover = {
  whileHover: {
    y: -4,
    scale: 1.02,
    transition: { duration: 0.25, ease: premiumEase },
  },
};
export const buttonHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: { duration: 0.2 },
};
// Page transition
export const pageTransition = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 12 },
  transition: { duration: premiumDuration, ease: premiumEase },
};
// Staggered list items
export const listContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};
export const listItem = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: premiumEase },
  },
};
export const landingHeroContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};
export const landingHeroItem = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: premiumEase },
  },
};
export const landingMediaReveal = {
  hidden: { opacity: 0, x: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.8, ease: premiumEase },
  },
};
export const landingSectionHeading = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: premiumEase },
  },
};
export const landingCardReveal = {
  hidden: { opacity: 0, y: 26, scale: 0.98 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      delay: index * 0.1,
      ease: premiumEase,
    },
  }),
};
export const subtleLoop = {
  y: [0, -8, 0],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};
// Shimmer loading effect
export const shimmer = {
  initial: { backgroundPosition: "-1000px 0" },
  animate: { backgroundPosition: "1000px 0" },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "linear",
  },
};
