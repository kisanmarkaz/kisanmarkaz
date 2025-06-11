import { Variants } from 'framer-motion';

// Fade in animation
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

// Slide up animation
export const slideUp: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

// Slide in from left
export const slideInLeft: Variants = {
  hidden: { x: -50, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

// Slide in from right
export const slideInRight: Variants = {
  hidden: { x: 50, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

// Scale up animation
export const scaleUp: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

// Staggered children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Hover animation for cards
export const cardHover = {
  rest: { 
    scale: 1,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2, ease: "easeInOut" }
  },
  hover: { 
    scale: 1.03,
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
    transition: { duration: 0.2, ease: "easeInOut" }
  }
};

// Button hover animation
export const buttonHover = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2, ease: "easeInOut" }
  }
};

// Page transition
export const pageTransition: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Cursor animations with high contrast against green and white
export const cursorVariants = {
  default: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(128, 0, 128, 0.4)', // Purple (contrasts with both green and white)
    border: '3px solid rgba(128, 0, 128, 0.9)',
    boxShadow: '0 0 15px rgba(128, 0, 128, 0.8), 0 0 30px rgba(128, 0, 128, 0.4)',
  },
  link: {
    width: 45,
    height: 45,
    backgroundColor: 'rgba(255, 69, 0, 0.4)', // Orange-red (contrasts with green)
    border: '3px solid rgba(255, 69, 0, 0.9)',
    boxShadow: '0 0 20px rgba(255, 69, 0, 0.8), 0 0 40px rgba(255, 69, 0, 0.4)',
  },
  button: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(220, 20, 60, 0.4)', // Crimson (contrasts with green and white)
    border: '3px solid rgba(220, 20, 60, 0.9)',
    boxShadow: '0 0 20px rgba(220, 20, 60, 0.8), 0 0 40px rgba(220, 20, 60, 0.4)',
  },
  input: {
    width: 35,
    height: 35,
    backgroundColor: 'rgba(75, 0, 130, 0.4)', // Indigo (contrasts with green and white)
    border: '3px solid rgba(75, 0, 130, 0.9)',
    boxShadow: '0 0 20px rgba(75, 0, 130, 0.8), 0 0 40px rgba(75, 0, 130, 0.4)',
  },
};

// Cursor particle animation
export const particleAnimation = {
  initial: { opacity: 0.9, scale: 1 },
  animate: { 
    opacity: 0, 
    scale: 0.6,
    transition: { duration: 1.2 } 
  }
};