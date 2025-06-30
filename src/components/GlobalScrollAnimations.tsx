import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * GlobalScrollAnimations adds site-wide scroll-triggered animations and effects
 * This component should be included once at the app root level
 */
const GlobalScrollAnimations: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Track scroll position for various effects
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [lastScrollY, setLastScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
      setLastScrollY(currentScrollY);
      setScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Show scroll indicator only when near the top
  const showScrollIndicator = scrollY < window.innerHeight;

  return (
    <>
      {/* Enhanced progress bar with glow effect */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 z-50 origin-left shadow-lg shadow-yellow-500/30"
        style={{ scaleX }}
      />
      
      {/* Floating scroll indicator */}
      <motion.div 
        className="fixed bottom-8 right-8 z-40 flex flex-col items-center opacity-80 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: showScrollIndicator ? 1 : 0,
          y: showScrollIndicator ? 0 : 20
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="w-8 h-14 border-2 border-yellow-500 rounded-full mb-2 flex justify-center p-1"
        >
          <motion.div 
            className="w-2 h-2 bg-yellow-500 rounded-full"
            animate={{ 
              y: [0, 20, 0],
              opacity: [1, 0.5, 1]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatType: "loop" 
            }}
          />
        </motion.div>
        <motion.span 
          className="text-xs text-yellow-500 font-medium"
          animate={{ 
            opacity: [1, 0.5, 1]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            repeatType: "loop" 
          }}
        >
          Scroll
        </motion.span>
      </motion.div>

      {/* Subtle parallax background effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-[-1] opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
          transform: `translateY(${scrollY * 0.05}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      />
    </>
  );
};

export default GlobalScrollAnimations;