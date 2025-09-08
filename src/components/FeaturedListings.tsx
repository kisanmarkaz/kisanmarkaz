
import React from 'react';
import FeaturedListingBadge from '@/components/FeaturedListingBadge';
import { Heart, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFeaturedListings } from '@/hooks/useListings';
import { useListings } from '@/hooks/useListings';
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { staggerContainer, fadeIn, cardHover } from '@/lib/animations';

const FeaturedListings = () => {
  const { data: featuredListings, isLoading: isLoadingFeatured } = useFeaturedListings();
  const { data: latestListings, isLoading: isLoadingLatest } = useListings({ sortBy: 'newest' });
  const { data: favorites } = useFavorites();
  const { user } = useAuth();
  const toggleFavorite = useToggleFavorite();
  const ref = React.useRef(null);
  const isInView = React.useRef(false);

  // Show maximum 3 featured listings, or latest listings if no featured ones
  let combinedListings = [];
  if (featuredListings && featuredListings.length > 0) {
    // Show up to 3 featured listings
    combinedListings = featuredListings.slice(0, 3);
  } else if (latestListings && latestListings.length > 0) {
    // If no featured listings, show up to 3 latest listings
    combinedListings = latestListings.slice(0, 3);
  }

  // Check if element is in view
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isInView.current = true;
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const isFavorite = (listingId: string) => {
    return favorites?.some(fav => fav.listing_id === listingId) || false;
  };

  const handleToggleFavorite = (listingId: string) => {
    if (!user) return;
    toggleFavorite.mutate({
      listingId,
      isFavorite: isFavorite(listingId)
    });
  };


  if (isLoadingFeatured || isLoadingLatest) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Listings</h2>
            <Link to="/featured">
              <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm h-64 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Listings</h2>
          <Link to="/featured">
            <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
              View All
            </Button>
          </Link>
        </div>

        {combinedListings && combinedListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {combinedListings.map((listing) => (
            <Link to={`/listing/${listing.id}`} key={listing.id} className="group">
              <div
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={listing.images?.[0] || "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=400&h=300&fit=crop"}
                    alt={listing.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Always show FEATURED tag for listings in featured section */}
                  <FeaturedListingBadge position="top-left" />
                  {listing.urgent && (
                    <span className="absolute top-2 right-12 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                      URGENT
                    </span>
                  )}
                  {user && (
                    <button 
                      onClick={(e) => { e.preventDefault(); handleToggleFavorite(listing.id); }}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                    >
                      <Heart className={`h-4 w-4 ${isFavorite(listing.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                    </button>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {listing.category?.name}
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      Rs {listing.price?.toLocaleString()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {listing.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {listing.location_city}, {listing.location_province}
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(listing.created_at), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
            </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Listings Available</h3>
              <p className="text-gray-600 mb-4">
                There are currently no featured or recent listings to display.
              </p>
              <Link to="/search">
                <Button className="bg-green-600 hover:bg-green-700">
                  Browse All Listings
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedListings;
