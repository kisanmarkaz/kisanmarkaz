import React from 'react';
import { Button } from '@/components/ui/button';
import { useFeaturedListings } from '@/hooks/useListings';
import { useListings } from '@/hooks/useListings';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { staggerContainer, fadeIn } from '@/lib/animations';
import ListingCard from '@/components/ListingCard';

const FeaturedListings = () => {
  const { data: featuredListings, isLoading: isLoadingFeatured } = useFeaturedListings();
  const { data: latestListings, isLoading: isLoadingLatest } = useListings({ sortBy: 'newest' });
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  // Helper to check current featured status
  const isCurrentlyFeatured = (listing: any) => {
    return Boolean(
      listing?.featured_listings &&
      listing.featured_listings.length > 0 &&
      listing.featured_listings.some((fl: any) =>
        fl.status === 'active' &&
        new Date(fl.featured_from) <= new Date() &&
        new Date(fl.featured_until) >= new Date()
      )
    );
  };

  // Only show currently active featured listings
  const combinedListings: any[] = (featuredListings || [])
    .filter(isCurrentlyFeatured)
    .slice(0, 3);

  if (isLoadingFeatured || isLoadingLatest) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Featured Listings</h2>
            <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-[400px] animate-pulse border border-gray-100 shadow-sm" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no featured listings, don't show the section
  if (!combinedListings || combinedListings.length === 0) {
    return null;
  }

  return (
    <section className="py-20" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">Premium Picks</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Listings</h2>
          </div>
          <Link to="/featured">
            <Button variant="outline" className="text-primary border-primary/20 hover:bg-primary/5 hover:border-primary rounded-xl px-6">
              View All Featured
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {combinedListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              variants={fadeIn}
              transition={{ delay: index * 0.1 }}
            >
              <ListingCard listing={listing} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedListings;
