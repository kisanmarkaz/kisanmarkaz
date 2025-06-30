import React from 'react';
import useScrollAnimation from '@/hooks/useScrollAnimation';

interface ScrollAnimatedElementProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  threshold?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
}

/**
 * A simple component that applies scroll animations to its children
 * using the useScrollAnimation hook
 */
const ScrollAnimatedElement: React.FC<ScrollAnimatedElementProps> = ({
  children,
  className = '',
  direction = 'up',
  threshold = 0.2,
  delay = 0,
  duration = 0.6,
  once = true,
}) => {
  const { ref, classes, style } = useScrollAnimation({
    direction,
    threshold,
    delay,
    duration,
    once,
  });

  return (
    <div
      ref={ref}
      className={`${className} ${classes}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default ScrollAnimatedElement;