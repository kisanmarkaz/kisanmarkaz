import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedListings from '@/components/FeaturedListings';
import HeroSection from '@/components/HeroSection';
import Layout from '@/components/Layout';
import PageTransition from '@/components/PageTransition';
import ScrollAnimatedSection from '@/components/ScrollAnimatedSection';
import { fetchCategories } from '@/hooks/useCategories';

const Index = () => {
  const queryClient = useQueryClient();

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
        <HeroSection />
        
        <ScrollAnimatedSection 
          direction="up" 
          threshold={0.2} 
          delay={0.1}
          staggerChildren={true}
        >
          <div className="py-8">
            <CategoryGrid />
          </div>
        </ScrollAnimatedSection>
        
        <ScrollAnimatedSection 
          direction="up" 
          threshold={0.2} 
          delay={0.2}
        >
          <div className="py-8">
            <FeaturedListings />
          </div>
        </ScrollAnimatedSection>
      </Layout>
    </PageTransition>
  );
};

export default Index;
