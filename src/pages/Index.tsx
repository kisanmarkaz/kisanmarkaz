import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedListings from '@/components/FeaturedListings';
import HeroSection from '@/components/HeroSection';
import Layout from '@/components/Layout';
import PageTransition from '@/components/PageTransition';
import { motion, useScroll, useSpring } from 'framer-motion';
import { fetchCategories } from '@/hooks/useCategories';

const Index = () => {
  const { scrollYProgress } = useScroll();
  const queryClient = useQueryClient();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Scroll to top on page load and prefetch categories
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Immediately load categories data
    queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: fetchCategories,
    });
  }, [queryClient]);

  return (
    <PageTransition>
      <Layout>
        {/* Progress bar */}
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-yellow-500 z-50 origin-left"
          style={{ scaleX }}
        />
        
        <HeroSection />
        <CategoryGrid />
        <FeaturedListings />
        
        {/* Scroll to top button */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-3 bg-green-600 text-white rounded-full shadow-lg z-40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </motion.button>
      </Layout>
    </PageTransition>
  );
};

export default Index;
