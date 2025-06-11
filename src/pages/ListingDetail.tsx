import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowLeft, Phone, Mail, Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites';
import type { Listing } from '@/types/supabase';

const ListingDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: favorites } = useFavorites();
  const toggleFavorite = useToggleFavorite();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      // First get the listing
      const { data: listingData, error: listingError } = await supabase
        .from('listings')
        .select(`
          *,
          category:categories(*),
          subcategory:subcategories(*),
          field_values:listing_field_values(
            *,
            field:category_fields(*)
          )
        `)
        .eq('id', id)
        .single();

      if (listingError) throw listingError;

      // Then get the user profile
      if (listingData?.user_id) {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', listingData.user_id)
          .single();

        if (!userError && userData) {
          return { ...listingData, user: userData } as Listing;
        }
      }

      return listingData as Listing;
    }
  });

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

  const handlePrevImage = () => {
    if (selectedImageIndex === null || !listing?.images) return;
    setSelectedImageIndex((selectedImageIndex - 1 + listing.images.length) % listing.images.length);
  };

  const handleNextImage = () => {
    if (selectedImageIndex === null || !listing?.images) return;
    setSelectedImageIndex((selectedImageIndex + 1) % listing.images.length);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedImageIndex === null) return;
    if (e.key === 'ArrowLeft') handlePrevImage();
    if (e.key === 'ArrowRight') handleNextImage();
    if (e.key === 'Escape') setSelectedImageIndex(null);
  };

  React.useEffect(() => {
    if (selectedImageIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedImageIndex]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-200 w-3/4 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 w-1/4 rounded mb-8"></div>
            <div className="h-32 bg-gray-200 rounded mb-8"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 mt-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h1>
          <p className="text-gray-600 mb-8">The listing you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <div className="relative">
                <img
                  src={listing.images?.[0] || "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=800&h=600&fit=crop"}
                  alt={listing.title}
                  className="w-full h-96 object-cover cursor-pointer"
                  onClick={() => setSelectedImageIndex(0)}
                />
                {listing.images && listing.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 mt-2 p-2">
                    {listing.images.slice(1).map((image, index) => (
                      <img
                        key={index + 1}
                        src={image}
                        alt={`${listing.title} - Image ${index + 2}`}
                        className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedImageIndex(index + 1)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Listing Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-green-600 mr-4">
                    Rs {listing.price?.toLocaleString()}
                  </span>
                  {user && (
                    <button 
                      onClick={() => handleToggleFavorite(listing.id)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <Heart className={`h-6 w-6 ${isFavorite(listing.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-6">
                <MapPin className="h-4 w-4 mr-1" />
                {listing.location_city}, {listing.location_province}
                <span className="mx-2">•</span>
                <Calendar className="h-4 w-4 mr-1" />
                {format(new Date(listing.created_at), 'MMM d, yyyy')}
              </div>

              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{listing.description}</p>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500">Category:</span>
                  <span className="ml-2 text-gray-900">{listing.category?.name}</span>
                </div>
                {listing.subcategory && (
                  <div>
                    <span className="text-gray-500">Subcategory:</span>
                    <span className="ml-2 text-gray-900">{listing.subcategory?.name}</span>
                  </div>
                )}
                {listing.price_unit && (
                  <div>
                    <span className="text-gray-500">Price Unit:</span>
                    <span className="ml-2 text-gray-900">
                      {listing.price_unit === 'total' ? 'Total Price' :
                       listing.price_unit === 'per_kg' ? 'Per Kg' :
                       listing.price_unit === 'per_acre' ? 'Per Acre' :
                       'Per Unit'}
                    </span>
                  </div>
                )}
                {listing.quantity && (
                  <div>
                    <span className="text-gray-500">Quantity:</span>
                    <span className="ml-2 text-gray-900">
                      {listing.quantity} {listing.quantity_unit}
                    </span>
                  </div>
                )}
                {listing.condition && (
                  <div>
                    <span className="text-gray-500">Condition:</span>
                    <span className="ml-2 text-gray-900 capitalize">{listing.condition}</span>
                  </div>
                )}
                {listing.negotiable && (
                  <div>
                    <span className="text-gray-500">Negotiable:</span>
                    <span className="ml-2 text-gray-900 capitalize">{listing.negotiable}</span>
                  </div>
                )}
                {listing.harvest_date && (
                  <div>
                    <span className="text-gray-500">Harvest Date:</span>
                    <span className="ml-2 text-gray-900">
                      {format(new Date(listing.harvest_date), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
                {listing.organic && (
                  <div>
                    <span className="text-gray-500">Organic:</span>
                    <span className="ml-2 text-gray-900 capitalize">{listing.organic}</span>
                  </div>
                )}
                {listing.certification && (
                  <div>
                    <span className="text-gray-500">Certification:</span>
                    <span className="ml-2 text-gray-900 capitalize">{listing.certification}</span>
                  </div>
                )}
                {listing.delivery_available && (
                  <div>
                    <span className="text-gray-500">Delivery Available:</span>
                    <span className="ml-2 text-gray-900 capitalize">{listing.delivery_available}</span>
                  </div>
                )}
                {listing.min_order_quantity && (
                  <div>
                    <span className="text-gray-500">Minimum Order:</span>
                    <span className="ml-2 text-gray-900">
                      {listing.min_order_quantity} {listing.quantity_unit}
                    </span>
                  </div>
                )}
                {listing.payment_terms && (
                  <div>
                    <span className="text-gray-500">Payment Terms:</span>
                    <span className="ml-2 text-gray-900 capitalize">{listing.payment_terms}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Location:</span>
                  <span className="ml-2 text-gray-900">
                    {listing.location_address && `${listing.location_address}, `}
                    {listing.location_city}, {listing.location_province}
                  </span>
                </div>

                {/* Category-specific fields */}
                {listing.field_values?.map((fieldValue) => (
                  <div key={fieldValue.id}>
                    <span className="text-gray-500">{fieldValue.field.field_label}:</span>
                    <span className="ml-2 text-gray-900">
                      {fieldValue.field.field_type === 'boolean' 
                        ? (fieldValue.field_value ? 'Yes' : 'No')
                        : fieldValue.field.field_type === 'date'
                        ? format(new Date(fieldValue.field_value), 'MMM d, yyyy')
                        : fieldValue.field_value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Seller Information */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Seller Information</h2>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {listing.user?.full_name || 'Anonymous Seller'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {listing.user?.created_at 
                      ? `Member since ${format(new Date(listing.user.created_at), 'MMM yyyy')}`
                      : 'Member'}
                  </p>
                </div>
              </div>

              {user ? (
                <div className="space-y-3">
                  {listing.contact_phone && (
                    <Button className="w-full" variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      {listing.contact_phone}
                    </Button>
                  )}
                  <Button className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Seller
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Login to contact the seller</p>
                  <Link to="/auth">
                    <Button className="w-full">Login</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImageIndex !== null && listing.images && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
             onClick={() => setSelectedImageIndex(null)}>
          <div className="relative max-w-7xl mx-auto px-4 py-8">
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={() => setSelectedImageIndex(null)}
            >
              <X className="h-8 w-8" />
            </button>
            
            <img
              src={listing.images[selectedImageIndex]}
              alt={`${listing.title} - Image ${selectedImageIndex + 1}`}
              className="max-h-[80vh] w-auto mx-auto"
              onClick={(e) => e.stopPropagation()}
            />

            {listing.images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                >
                  <ChevronLeft className="h-12 w-12" />
                </button>
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                >
                  <ChevronRight className="h-12 w-12" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {listing.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === selectedImageIndex ? 'bg-white' : 'bg-gray-500'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(index);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ListingDetail; 