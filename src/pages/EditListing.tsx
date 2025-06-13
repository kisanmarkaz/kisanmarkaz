import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2, X, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useStorage } from '@/hooks/useStorage';
import { useCategories } from '@/hooks/useCategories';
import { useCategoryFields } from '@/hooks/useCategoryFields';
import { useUpdateListing } from '@/hooks/useListings';
import { listingSchema } from '@/schemas/listing';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListingStatusEnum } from '../schemas/listing';
import { isListingStatus } from '../lib/typeGuards';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Database } from '@/integrations/supabase/types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp"
];

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
}

type ListingStatus = typeof ListingStatusEnum[keyof typeof ListingStatusEnum];

interface ListingFormData {
  title: string;
  description: string;
  price: string;
  quantity: string;
  category_id: string;
  location_city: string;
  location_province: string;
  location_address?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  status: ListingStatus;
  images: string[];
}

interface ListingWithDetails {
  id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  category_id: string;
  location_city: string;
  location_province: string;
  location_address: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  status: ListingStatus;
  images: string[];
  category: Category;
  subcategory: Category | null;
  user_id: string;
}

export default function EditListing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const storage = useStorage();
  const { data: categories } = useCategories();
  const updateListing = useUpdateListing();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryFields, setCategoryFields] = useState<Record<string, any>>({});
  const [error, setError] = useState<Error | null>(null);

  // Handle authentication
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('No authenticated user, redirecting to login');
      toast({
        title: "Authentication required",
        description: "Please log in to edit listings",
        variant: "destructive"
      });
      navigate('/auth');
    }
  }, [user, authLoading, navigate, toast]);

  const { data: listing, isLoading: listingLoading, error: queryError } = useQuery<ListingWithDetails>({
    queryKey: ['listing', id],
    queryFn: async () => {
      console.log('Fetching listing data for id:', id);
      if (!id) throw new Error('No listing ID provided');
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          category:categories!inner(*),
          subcategory:categories(*),
          user_id
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Listing not found');
      }

      if (data.user_id !== user.id) {
        throw new Error('You do not have permission to edit this listing');
      }
      
      console.log('Fetched listing data:', data);
      return data as ListingWithDetails;
    },
    enabled: !!id && !!user,
    retry: false
  });

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '0',
      quantity: '0',
      category_id: '',
      location_city: '',
      location_province: '',
      location_address: '',
      contact_name: '',
      contact_phone: '',
      contact_email: '',
      status: ListingStatusEnum.active,
      images: []
    }
  });

  // Update form when listing data is available
  useEffect(() => {
    if (!listing) return;

    console.log('Updating form with listing data:', listing);
    try {
      form.reset({
        title: listing.title,
        description: listing.description,
        price: listing.price.toString(),
        quantity: listing.quantity.toString(),
        category_id: listing.category_id,
        location_city: listing.location_city,
        location_province: listing.location_province,
        location_address: listing.location_address || '',
        contact_name: listing.contact_name || '',
        contact_phone: listing.contact_phone || '',
        contact_email: listing.contact_email || '',
        status: validateStatus(listing.status),
        images: listing.images || []
      });
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error resetting form:', error);
      toast({
        title: 'Error',
        description: 'Failed to load listing data into form',
        variant: 'destructive'
      });
    }
  }, [listing, form.reset, toast]);

  const selectedCategory = form.watch('category_id');
  const { data: fields, isLoading: fieldsLoading } = useCategoryFields(selectedCategory);

  // Update form when category fields change
  useEffect(() => {
    console.log('Category fields changed:', {
      selectedCategory,
      fields,
      fieldsLoading
    });
    
    if (fields) {
      const defaultValues: Record<string, any> = {};
      fields.forEach(field => {
        defaultValues[field.field_name] = field.field_type === 'boolean' ? false : '';
      });
      setCategoryFields(defaultValues);
    }
  }, [fields, selectedCategory, fieldsLoading]);

  // Debug form errors
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.log('Form validation errors:', form.formState.errors);
    }
  }, [form.formState.errors]);

  const handleImageUpload = async (file: File) => {
    if (!id || !user) return;

    // Validate file type and size
    const isValidType = ACCEPTED_IMAGE_TYPES.includes(file.type);
    const isValidSize = file.size <= MAX_FILE_SIZE;
    
    if (!isValidType) {
      toast({
        title: "Invalid file type",
        description: `${file.name} is not a supported image type. Please use JPEG, PNG, or WebP images.`,
        variant: "destructive"
      });
      return;
    }
    
    if (!isValidSize) {
      toast({
        title: "File too large",
        description: `${file.name} exceeds the 5MB size limit.`,
        variant: "destructive"
      });
      return;
    }

    try {
      const urls = await storage.uploadImages([file], user.id);
      if (urls.length > 0) {
        const newImages = [...(form.watch('images') || []), urls[0]];
        form.setValue('images', newImages);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive'
      });
    }
  };

  const handleImageDelete = async (url: string) => {
    try {
      await storage.deleteImage(url);
      const currentImages = form.watch('images') || [];
      form.setValue('images', currentImages.filter(img => img !== url));
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete image',
        variant: 'destructive'
      });
    }
  };

  const onSubmit = async (data: ListingFormData) => {
    if (!listing) {
      toast({
        title: 'Error',
        description: 'Listing not found',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const listingData = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price.toString()),
        quantity: parseFloat(data.quantity.toString()),
        category_id: data.category_id,
        location_city: data.location_city,
        location_province: data.location_province,
        location_address: data.location_address || null,
        contact_name: data.contact_name || null,
        contact_phone: data.contact_phone || null,
        contact_email: data.contact_email || null,
        status: data.status,
        images: data.images
      };

      await updateListing.mutateAsync({
        id: listing.id,
        data: listingData
      });

      toast({
        title: 'Success',
        description: 'Listing updated successfully'
      });
      
      navigate('/listings');
    } catch (error) {
      console.error('Error updating listing:', error);
      toast({
        title: 'Error',
        description: 'Failed to update listing',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Checking authentication...</span>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null; // The useEffect above will handle the redirect
  }

  if (error || queryError) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>Failed to load listing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-red-500">{error?.message || queryError?.message || 'An unknown error occurred'}</p>
            </CardContent>
            <CardContent>
              <Button onClick={() => navigate('/listings')}>Back to Listings</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (listingLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading listing...</span>
        </div>
      </Layout>
    );
  }

  if (!listing) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Not Found</CardTitle>
              <CardDescription>This listing could not be found</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/listings')}>Back to Listings</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Edit Listing</h1>
        
        <div className="max-w-3xl mx-auto">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images (Max 5)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {form.watch('images')?.map((url: string, index: number) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageDelete(url)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {(!form.watch('images') || form.watch('images').length < 5) && (
                  <label className="aspect-square flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer">
                    <input
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(',')}
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          handleImageUpload(files[0]);
                        }
                      }}
                      className="hidden"
                    />
                    <div className="text-center">
                      <Camera className="mx-auto h-8 w-8 text-gray-400" />
                      <span className="mt-2 block text-sm font-medium text-gray-600">
                        Add Photo
                      </span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="Enter product title"
                className={form.formState.errors.title ? 'border-red-500' : ''}
              />
              {form.formState.errors.title && (
                <p className="mt-1 text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Describe your product in detail"
                className={`min-h-[120px] ${form.formState.errors.description ? 'border-red-500' : ''}`}
              />
              {form.formState.errors.description && (
                <p className="mt-1 text-sm text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select
                value={form.watch('category_id')}
                onValueChange={(value) => {
                  console.log('Category selected:', value);
                  form.setValue('category_id', value);
                }}
              >
                <SelectTrigger className={form.formState.errors.category_id ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.category_id && (
                <p className="mt-1 text-sm text-red-500">{form.formState.errors.category_id.message}</p>
              )}
            </div>

            {/* Price and Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (PKR)
                </label>
                <Input
                  id="price"
                  {...form.register('price')}
                  type="number"
                  placeholder="Enter price"
                  className={form.formState.errors.price ? 'border-red-500' : ''}
                />
                {form.formState.errors.price && (
                  <p className="mt-1 text-sm text-red-500">{form.formState.errors.price.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <Input
                  id="quantity"
                  {...form.register('quantity')}
                  type="number"
                  placeholder="Enter quantity"
                  className={form.formState.errors.quantity ? 'border-red-500' : ''}
                />
                {form.formState.errors.quantity && (
                  <p className="mt-1 text-sm text-red-500">{form.formState.errors.quantity.message}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Where is your product located?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="location_city" className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <Input
                      id="location_city"
                      {...form.register('location_city')}
                      placeholder="Enter city"
                      className={form.formState.errors.location_city ? 'border-red-500' : ''}
                    />
                    {form.formState.errors.location_city && (
                      <p className="mt-1 text-sm text-red-500">{form.formState.errors.location_city.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="location_province" className="block text-sm font-medium text-gray-700 mb-2">
                      Province/State
                    </label>
                    <Input
                      id="location_province"
                      {...form.register('location_province')}
                      placeholder="Enter province/state"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="location_address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address (Optional)
                  </label>
                  <Input
                    id="location_address"
                    {...form.register('location_address')}
                    placeholder="Enter detailed address"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How buyers can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name
                  </label>
                  <Input
                    id="contact_name"
                    {...form.register('contact_name')}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    id="contact_phone"
                    {...form.register('contact_phone')}
                    placeholder="Your phone number"
                    type="tel"
                  />
                </div>

                <div>
                  <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="contact_email"
                    {...form.register('contact_email')}
                    placeholder="Your email address"
                    type="email"
                  />
                  {form.formState.errors.contact_email && (
                    <p className="mt-1 text-sm text-red-500">{form.formState.errors.contact_email.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/listings')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Listing...
                  </>
                ) : (
                  <>
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
} 