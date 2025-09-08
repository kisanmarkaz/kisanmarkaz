import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Grid, List, MapPin, Calendar, Heart, Truck, CreditCard, Leaf, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/components/Layout';
import FeaturedListingBadge from '@/components/FeaturedListingBadge';
import { useFeaturedListings } from '@/hooks/useListings';
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import AdScript from '@/components/AdScript';

const FeaturedListingsPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [condition, setCondition] = useState<string>('all');
  const [deliveryAvailable, setDeliveryAvailable] = useState<string>('all');
  const [paymentTerms, setPaymentTerms] = useState<string>('all');
  const [organic, setOrganic] = useState<string>('all');
  const [quantityMin, setQuantityMin] = useState('');
  const [quantityMax, setQuantityMax] = useState('');

  const { data: featuredListings, isLoading, error } = useFeaturedListings();
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

  // Filter and sort the listings
  let filteredListings = featuredListings || [];
  
  // Apply filters
  if (priceMin) {
    filteredListings = filteredListings.filter(listing => listing.price >= parseFloat(priceMin));
  }
  if (priceMax) {
    filteredListings = filteredListings.filter(listing => listing.price <= parseFloat(priceMax));
  }
  if (condition !== 'all') {
    filteredListings = filteredListings.filter(listing => listing.condition === condition);
  }
  if (deliveryAvailable !== 'all') {
    filteredListings = filteredListings.filter(listing => 
      deliveryAvailable === 'yes' ? listing.delivery_available === 'yes' : listing.delivery_available === 'no'
    );
  }
  if (paymentTerms !== 'all') {
    filteredListings = filteredListings.filter(listing => listing.payment_terms === paymentTerms);
  }
  if (organic !== 'all') {
    filteredListings = filteredListings.filter(listing => 
      organic === 'yes' ? listing.organic === 'yes' : listing.organic === 'no'
    );
  }
  if (quantityMin) {
    filteredListings = filteredListings.filter(listing => listing.quantity >= parseFloat(quantityMin));
  }
  if (quantityMax) {
    filteredListings = filteredListings.filter(listing => listing.quantity <= parseFloat(quantityMax));
  }

  // Apply sorting
  filteredListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Featured Listings</h3>
              <p className="text-gray-600 mb-6">
                There was an error loading the featured listings. Please try again later.
              </p>
              <p className="text-sm text-gray-500">
                Error: {error.message}
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Featured Listings Header */}
      <div className="bg-gradient-to-r from-yellow-50 to-green-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-4">
            <Star className="h-8 w-8 text-yellow-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Featured Listings</h1>
          </div>
          <p className="text-gray-600 mb-4">
            Discover premium listings that stand out from the crowd. These listings have been specially promoted to get maximum visibility.
          </p>
          
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500">
            <span>Home</span> &gt; <span className="text-yellow-600">Featured Listings</span>
          </nav>
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

              {/* Condition */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger>
                    <SelectValue placeholder="All conditions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All conditions</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Delivery */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Truck className="h-4 w-4 mr-2" />
                  Delivery Available
                </label>
                <Select value={deliveryAvailable} onValueChange={setDeliveryAvailable}>
                  <SelectTrigger>
                    <SelectValue placeholder="All options" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All options</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Terms */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Terms
                </label>
                <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                  <SelectTrigger>
                    <SelectValue placeholder="All terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All terms</SelectItem>
                    <SelectItem value="advance">Advance payment</SelectItem>
                    <SelectItem value="partial">Partial payment</SelectItem>
                    <SelectItem value="delivery">Pay on delivery</SelectItem>
                    <SelectItem value="credit">Credit terms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Organic Status */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Leaf className="h-4 w-4 mr-2" />
                  Organic Status
                </label>
                <Select value={organic} onValueChange={setOrganic}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Organic</SelectItem>
                    <SelectItem value="no">Non-organic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity Range
                </label>
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Min quantity" 
                    value={quantityMin}
                    onChange={(e) => setQuantityMin(e.target.value)}
                  />
                  <Input 
                    placeholder="Max quantity"
                    value={quantityMax}
                    onChange={(e) => setQuantityMax(e.target.value)}
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
                <span className="text-gray-600">{filteredListings.length} featured listings found</span>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <Select 
                  value={sortBy} 
                  onValueChange={(value) => setSortBy(value)}
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

            {/* Ad Script */}
            <AdScript />

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
            ) : filteredListings.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredListings.map((listing) => (
                  <Link
                    key={listing.id}
                    to={`/listing/${listing.id}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
                      <div className="relative">
                        <img
                          src={listing.images?.[0] || "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=400&h=300&fit=crop"}
                          alt={listing.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <FeaturedListingBadge position="top-left" />
                        {listing.urgent && (
                          <span className="absolute top-2 right-12 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                            URGENT
                          </span>
                        )}
                        {user && (
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              handleToggleFavorite(listing.id);
                            }}
                            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
                          >
                            <Heart 
                              className={`h-5 w-5 ${isFavorite(listing.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
                            />
                          </button>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {listing.category?.name}
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            PKR {listing.price?.toLocaleString()}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {listing.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {listing.location_city}, {listing.location_province}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-400">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(listing.created_at), 'MMM d, yyyy')}
                          </div>
                          {listing.delivery_available === 'yes' && (
                            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full flex items-center">
                              <Truck className="h-3 w-3 mr-1" />
                              Delivery
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Featured Listings Found</h3>
                  <p className="text-gray-600 mb-6">
                    No featured listings match your current filters. Try adjusting your search criteria or browse all listings.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setPriceMin('');
                        setPriceMax('');
                        setCondition('all');
                        setDeliveryAvailable('all');
                        setPaymentTerms('all');
                        setOrganic('all');
                        setQuantityMin('');
                        setQuantityMax('');
                      }}
                    >
                      Clear Filters
                    </Button>
                    <Link to="/search">
                      <Button className="bg-green-600 hover:bg-green-700">
                        Browse All Listings
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FeaturedListingsPage;