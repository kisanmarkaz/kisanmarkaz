import React from 'react';
import ScrollReveal from './ScrollReveal';

interface ScrollAnimationWrapperProps {
  children: React.ReactNode;
}

/**
 * A wrapper component that applies scroll animations to direct children
 * Each child will be wrapped in a ScrollReveal component with staggered delays
 */
const ScrollAnimationWrapper: React.FC<ScrollAnimationWrapperProps> = ({ children }) => {
  // Convert children to array to apply different animations
  const childrenArray = React.Children.toArray(children);
  
  return (
    <>
      {childrenArray.map((child, index) => {
        // Skip null or undefined children
        if (!child) return null;
        
        // Determine animation variant based on index pattern
        let variant: 'fadeIn' | 'slideUp' | 'slideInLeft' | 'slideInRight' = 'slideUp';
        
        // Alternate between different animations for visual interest
        if (index % 4 === 0) variant = 'fadeIn';
        else if (index % 4 === 1) variant = 'slideUp';
        else if (index % 4 === 2) variant = 'slideInLeft';
        else if (index % 4 === 3) variant = 'slideInRight';
        
        // Calculate staggered delay
        const delay = 0.1 + (index * 0.05);
        
        return (
          <ScrollReveal 
            key={index} 
            variant={variant} 
            delay={delay}
            threshold={0.15}
          >
            {child}
          </ScrollReveal>
        );
      })}
    </>
  );
};

export default ScrollAnimationWrapper;