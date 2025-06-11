import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useListings } from '@/hooks/useListings';
import { Filter, Grid, List, MapPin, Calendar, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const location = searchParams.get('location') || 'all';
  const [viewMode, setViewMode] = React.useState('grid');
  const [sortBy, setSortBy] = React.useState<'newest' | 'oldest' | 'price-low' | 'price-high'>('newest');
  const [priceMin, setPriceMin] = React.useState('');
  const [priceMax, setPriceMax] = React.useState('');

  const { data: listings, isLoading } = useListings({
    searchQuery: query,
    location: location === 'all' ? undefined : location,
    priceMin: priceMin ? parseFloat(priceMin) : undefined,
    priceMax: priceMax ? parseFloat(priceMax) : undefined,
    sortBy
  });

  const { data: favorites } = useFavorites();
  const { user } = useAuth();
  const toggleFavorite = useToggleFavorite();

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Search Header */}
      <div className="bg-green-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          <p className="text-gray-600 mb-4">
            {query ? `Showing results for "${query}"` : 'All listings'}
            {location !== 'all' ? ` in ${location}` : ''}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </h3>
              
              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (PKR)
                </label>
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Min" 
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                  />
                  <Input 
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{listings?.length || 0} results found</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <Select 
                  value={sortBy} 
                  onValueChange={(value: 'newest' | 'oldest' | 'price-low' | 'price-high') => setSortBy(value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex border rounded">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Listings Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {listings?.map((listing) => (
                  <Link
                    key={listing.id}
                    to={`/listing/${listing.id}`}
                    className="group"
                  >
                    <div
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
                    >
                      <div className="relative">
                        <img
                          src={listing.images?.[0] || "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=400&h=300&fit=crop"}
                          alt={listing.title}
                          className="w-full h-48 object-cover"
                        />
                        {listing.urgent && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                            URGENT
                          </span>
                        )}
                        {user && (
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              handleToggleFavorite(listing.id);
                            }}
                            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                          >
                            <Heart className={`h-4 w-4 ${isFavorite(listing.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                          </button>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
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
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Search; 