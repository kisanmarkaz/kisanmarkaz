import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, Grid, List, MapPin, Calendar, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/components/Layout';
import { useCategories, useSubcategories } from '@/hooks/useCategories';
import { useListings } from '@/hooks/useListings';
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

const Category = () => {
  const { categoryId } = useParams();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  const { data: categories } = useCategories();
  const category = categories?.find(cat => cat.slug === categoryId);
  const { data: subcategories } = useSubcategories(category?.id);
  
  const { data: listings, isLoading } = useListings({
    categoryId: category?.id,
    subcategoryId: selectedSubcategory === 'all' ? undefined : selectedSubcategory,
    priceMin: priceMin ? parseFloat(priceMin) : undefined,
    priceMax: priceMax ? parseFloat(priceMax) : undefined
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

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <Layout>
      {/* Category Header */}
      <div className="bg-green-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
          <p className="text-gray-600 mb-4">{category.description}</p>
          
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500">
            <span>Home</span> &gt; <span className="text-green-600">{category.name}</span>
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

              {/* Subcategories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All subcategories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All subcategories</SelectItem>
                    {subcategories?.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select value={sortBy} onValueChange={setSortBy}>
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
                    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
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
                            Rs {listing.price?.toLocaleString()}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
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
    </Layout>
  );
};

export default Category;
