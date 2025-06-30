import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'none';

interface UseScrollAnimationOptions {
  threshold?: number;
  once?: boolean;
  delay?: number;
  direction?: AnimationDirection;
  duration?: number;
}

/**
 * Custom hook for adding scroll-triggered animations to any component
 * 
 * @param options Configuration options for the animation
 * @returns Object containing ref to attach to the element and animation classes
 */
const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const {
    threshold = 0.2,
    once = true,
    delay = 0,
    direction = 'up',
    duration = 0.6,
  } = options;

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

  // Determine which animation class to use based on direction
  let animationClass = '';
  if (direction === 'up') animationClass = 'animate-slide-up';
  if (direction === 'down') animationClass = 'animate-slide-down';
  if (direction === 'left') animationClass = 'animate-slide-left';
  if (direction === 'right') animationClass = 'animate-slide-right';
  if (direction === 'none') animationClass = 'animate-fade';

  // Apply animation class only when in view
  const classes = isInView ? animationClass : 'opacity-0';

  // Calculate inline styles for delay and duration
  const style = {
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    // Prevent animation from showing before JS loads
    opacity: hasAnimated || isInView ? 1 : 0,
  };

  return { ref, classes, style, isInView };
};

export default useScrollAnimation;