import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '../components/Layout';
import { useStartConversation } from '@/hooks/useMessages';
import { useListingAnalytics } from '@/hooks/useListingAnalytics';
import AdScript from '@/components/AdScript';

interface CategoryField {
  id: string;
  field_name: string;
  field_label: string;
  field_type: string;
  required: boolean;
  field_options?: {
    options: string[];
  };
}

interface ListingFieldValue {
  id: string;
  listing_id: string;
  field_id: string;
  field_value: string;
  field?: CategoryField;
}

interface ListingWithFieldValues extends Listing {
  field_values?: ListingFieldValue[];
}

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { data: favorites } = useFavorites();
  const toggleFavorite = useToggleFavorite();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showPhone, setShowPhone] = useState(false);
  const startConversation = useStartConversation();
  const navigate = useNavigate();
  const { trackClick, trackPhoneView, trackMessage } = useListingAnalytics(id || '');

  const { data: listing, isLoading } = useQuery<ListingWithFieldValues>({
    queryKey: ['listing', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          category:categories(*),
          subcategory:subcategories(*),
          user:profiles(*),
          field_values:listing_field_values(
            *,
            field:category_fields(*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
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

  useEffect(() => {
    if (selectedImageIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedImageIndex]);

  const handleShowPhone = () => {
    setShowPhone(true);
    trackPhoneView().catch(console.error);
  };

  const handleMessageSeller = async () => {
    if (!user) return;
    if (!listing?.user_id) return;

    try {
      const conversation = await startConversation.mutateAsync({
        listingId: listing.id,
        sellerId: listing.user_id
      });
      trackMessage().catch(console.error);
      navigate(`/messages/${conversation.id}`);
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    trackClick().catch(console.error);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div>Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!listing) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div>Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:w-2/3">
            {/* Image gallery implementation */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="relative">
                <img
                  src={listing.images?.[0] || "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=800&h=600&fit=crop"}
                  alt={listing.title}
                  className="w-full h-96 object-cover cursor-pointer"
                  onClick={() => handleImageClick(0)}
                />
                {listing.images && listing.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 mt-2 p-2">
                    {listing.images.slice(1).map((image, index) => (
                      <img
                        key={index + 1}
                        src={image}
                        alt={`${listing.title} - Image ${index + 2}`}
                        className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleImageClick(index + 1)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Main Details */}
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
                {listing.quantity && (
                  <div>
                    <span className="text-gray-500">Quantity:</span>
                    <span className="ml-2 text-gray-900">
                      {listing.quantity}
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
                      {listing.min_order_quantity}
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
              </div>
            </div>

            {/* Ad Script */}
            <AdScript />

            {/* Additional Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {listing.field_values?.map((fieldValue) => (
                  <div key={fieldValue.id}>
                    <span className="text-gray-500">{fieldValue.field?.field_label}:</span>
                    <span className="ml-2 text-gray-900">
                      {fieldValue.field?.field_type === 'boolean' 
                        ? (fieldValue.field_value === 'true' ? 'Yes' : 'No')
                        : fieldValue.field?.field_type === 'date'
                        ? format(new Date(fieldValue.field_value), 'MMM d, yyyy')
                        : fieldValue.field_value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Seller Info */}
          <div className="lg:w-1/3">
            {/* Seller information section */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Seller Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Name</label>
                  <p className="font-medium">{listing.contact_name}</p>
                </div>

                {listing.contact_phone && (
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <div className="flex items-center gap-2">
                      {showPhone ? (
                        <p className="font-medium">{listing.contact_phone}</p>
                      ) : (
                        <p className="font-medium">••••••••••</p>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShowPhone}
                      >
                        {showPhone ? 'Hide' : 'Show'}
                      </Button>
                    </div>
                  </div>
                )}

                {listing.contact_email && (
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">{listing.contact_email}</p>
                  </div>
                )}

                <div className="pt-4">
                  {user ? (
                    user.id !== listing.user_id ? (
                      <Button
                        className="w-full"
                        onClick={handleMessageSeller}
                        disabled={startConversation.isPending}
                      >
                        Message Seller
                      </Button>
                    ) : (
                      <p className="text-sm text-gray-500 text-center">This is your listing</p>
                    )
                  ) : (
                    <Link to="/auth" className="block">
                      <Button className="w-full">
                        Login to Message Seller
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {selectedImageIndex !== null && listing.images && listing.images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl w-full">
            <img
              src={listing.images[selectedImageIndex]}
              alt={`Image ${selectedImageIndex + 1}`}
              className="w-full h-auto"
            />
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
            {listing.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ListingDetail; 