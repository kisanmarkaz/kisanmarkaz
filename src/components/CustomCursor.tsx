import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cursorVariants, particleAnimation } from '../lib/animations';
import '../styles/cursor.css';

interface CursorParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  lifespan: number;
}

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hoverType, setHoverType] = useState<'default' | 'link' | 'button' | 'input'>('default');
  const [particles, setParticles] = useState<CursorParticle[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);

  // Colors for particles with high contrast against green and white
  const particleColors = [
    'rgba(148, 0, 211, 0.8)',   // Dark Violet (contrasts with green and white)
    'rgba(255, 0, 0, 0.8)',     // Red (contrasts with green)
    'rgba(255, 69, 0, 0.8)',    // Orange-Red (contrasts with green)
    'rgba(138, 43, 226, 0.8)',  // Blue Violet (contrasts with green and white)
    'rgba(220, 20, 60, 0.8)',   // Crimson (contrasts with green and white)
  ];

  // Update cursor position
  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      
      // Add new particle
      if (Math.random() > 0.6) { // Increased frequency of particles
        const newParticle: CursorParticle = {
          id: particleIdRef.current++,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 12 + 4, // Random size between 4-16px (larger for better visibility)
          color: particleColors[Math.floor(Math.random() * particleColors.length)],
          lifespan: 25, // Increased lifespan for better visibility
        };
        
        setParticles(prev => [...prev, newParticle]);
      }
    };

    // Update particles (reduce lifespan, remove dead ones)
    const particleInterval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({ ...p, lifespan: p.lifespan - 1 }))
          .filter(p => p.lifespan > 0)
      );
    }, 50);

    // Check what element the cursor is hovering over
    const checkHoverElement = (e: MouseEvent) => {
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element) {
        const tagName = element.tagName.toLowerCase();
        const isLink = tagName === 'a' || element.closest('a') !== null;
        const isButton = 
          tagName === 'button' || 
          element.closest('button') !== null || 
          element.getAttribute('role') === 'button' ||
          element.classList.contains('btn') ||
          element.classList.contains('button');
        const isInput = 
          tagName === 'input' || 
          tagName === 'textarea' || 
          tagName === 'select' || 
          element.closest('input, textarea, select') !== null;

        setIsHovering(isLink || isButton || isInput);
        
        if (isLink) setHoverType('link');
        else if (isButton) setHoverType('button');
        else if (isInput) setHoverType('input');
        else setHoverType('default');
      } else {
        setIsHovering(false);
        setHoverType('default');
      }
    };

    // Hide cursor when it leaves the window
    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Show cursor when it enters the window
    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousemove', checkHoverElement);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousemove', checkHoverElement);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      clearInterval(particleInterval);
    };
  }, []);

  // Using cursor variants from animations.ts

  return (
    <>
      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className="custom-cursor"
        animate={hoverType}
        variants={cursorVariants}
        style={{
          left: position.x,
          top: position.y,
          opacity: isVisible ? 1 : 0,
          pointerEvents: 'none',
          position: 'fixed',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          mixBlendMode: 'difference',
          transition: 'width 0.2s, height 0.2s, background-color 0.2s, border 0.2s, box-shadow 0.2s',
        }}
      />

      {/* Inner dot */}
      <motion.div
        className="cursor-dot"
        style={{
          left: position.x,
          top: position.y,
          opacity: isVisible ? 1 : 0,
          pointerEvents: 'none',
          position: 'fixed',
          width: 8,
          height: 8,
          backgroundColor: '#FF1493', // Deep Pink (high contrast against both green and white)
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10000,
          boxShadow: '0 0 5px #FF1493, 0 0 10px rgba(255, 20, 147, 0.5)', // Glow effect
        }}
      />

      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="cursor-particle"
          initial={particleAnimation.initial}
          animate={{
            ...particleAnimation.animate,
            transition: { duration: particle.lifespan * 0.05 }
          }}
          style={{
            position: 'fixed',
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 9998,
          }}
        />
      ))}
    </>
  );
};

export default CustomCursor;