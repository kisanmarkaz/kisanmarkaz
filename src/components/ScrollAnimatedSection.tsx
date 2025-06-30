import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface ScrollAnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  distance?: number;
  once?: boolean;
  staggerChildren?: boolean;
  staggerDelay?: number;
}

const ScrollAnimatedSection: React.FC<ScrollAnimatedSectionProps> = ({
  children,
  className = '',
  threshold = 0.2,
  delay = 0,
  direction = 'up',
  duration = 0.6,
  distance = 50,
  once = true,
  staggerChildren = false,
  staggerDelay = 0.1,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, threshold });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    } else if (!once && !isInView) {
      setHasAnimated(false);
    }
  }, [isInView, hasAnimated, once]);

  // Define initial animation state based on direction
  let initial = { opacity: 0 };
  if (direction === 'up') initial = { ...initial, y: distance };
  if (direction === 'down') initial = { ...initial, y: -distance };
  if (direction === 'left') initial = { ...initial, x: distance };
  if (direction === 'right') initial = { ...initial, x: -distance };

  // Define animation variants
  const variants = {
    hidden: initial,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Custom ease curve for smooth animation
        when: staggerChildren ? "beforeChildren" : undefined,
        staggerChildren: staggerChildren ? staggerDelay : undefined,
      },
    },
  };

  // Child variants for staggered animations
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // Wrap children with motion.div if staggerChildren is true
  const renderChildren = () => {
    if (!staggerChildren) return children;

    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;
      
      return (
        <motion.div variants={childVariants}>
          {child}
        </motion.div>
      );
    });
  };

  // Add parallax scroll effect
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      style={{
        willChange: 'opacity, transform',
        // Subtle parallax effect based on scroll position
        transform: `translateY(${isInView ? scrollY * 0.03 : 0}px)`,
      }}
    >
      {renderChildren()}
    </motion.div>
  );
};

export default ScrollAnimatedSection;