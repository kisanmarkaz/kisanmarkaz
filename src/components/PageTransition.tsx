import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;