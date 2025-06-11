import React, { useState, useEffect } from 'react';
import { Camera, X, MapPin, Scale, Ruler, Calendar, ArrowLeft, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useStorage } from '@/hooks/useStorage';
import { useCategories } from '@/hooks/useCategories';
import { useCategoryFields } from '@/hooks/useCategoryFields';
import { useUpdateListing } from '@/hooks/useListings';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navigate, useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import type { Database } from '@/integrations/supabase/types';
import { 
  listingSchema, 
  type ListingFormData,
  type PriceUnit,
  type QuantityUnit,
  type YesNo,
  type Condition,
  type Certification,
  type PaymentTerms,
  PriceUnitEnum,
  QuantityUnitEnum,
  YesNoEnum,
  ConditionEnum,
  CertificationEnum,
  PaymentTermsEnum,
  ListingStatusEnum
} from '../schemas/listing';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

type ListingStatus = 'active' | 'sold' | 'expired' | 'draft';
type ListingUpdate = Database['public']['Tables']['listings']['Update'];
type ListingWithDetails = Database['public']['Tables']['listings']['Row'] & {
  category: Database['public']['Tables']['categories']['Row'];
  subcategory: Database['public']['Tables']['subcategories']['Row'] | null;
  user_id: string;
};

// Add this type after the ListingWithDetails type
type ListingFieldValue = {
  id: string;
  listing_id: string;
  field_id: string;
  field_value: string;
};

interface CategoryField {
  id: string;
  field_name: string;
  field_label: string;
  field_type: 'text' | 'number' | 'boolean' | 'select' | 'date';
  required: boolean;
  field_options: { options?: string[] } | null;
  category_id: string;
  created_at: string;
  updated_at: string;
}

const isPriceUnit = (value: unknown): value is PriceUnit => {
  return typeof value === 'string' && Object.values(PriceUnitEnum).includes(value as PriceUnit);
};

const isQuantityUnit = (value: unknown): value is QuantityUnit => {
  return typeof value === 'string' && Object.values(QuantityUnitEnum).includes(value as QuantityUnit);
};

const isYesNo = (value: unknown): value is YesNo => {
  return typeof value === 'string' && Object.values(YesNoEnum).includes(value as YesNo);
};

const isCondition = (value: unknown): value is Condition => {
  return typeof value === 'string' && Object.values(ConditionEnum).includes(value as Condition);
};

const isCertification = (value: unknown): value is Certification => {
  return typeof value === 'string' && Object.values(CertificationEnum).includes(value as Certification);
};

const isPaymentTerms = (value: unknown): value is PaymentTerms => {
  return typeof value === 'string' && Object.values(PaymentTermsEnum).includes(value as PaymentTerms);
};

const isListingStatus = (value: unknown): value is ListingStatus => {
  return typeof value === 'string' && Object.values(ListingStatusEnum).includes(value as ListingStatus);
};

const validatePriceUnit = (value: string | null | undefined): PriceUnit => {
  const safeValue = value || 'total';
  return isPriceUnit(safeValue) ? safeValue : 'total';
};

const validateQuantityUnit = (value: string | null | undefined): QuantityUnit => {
  const safeValue = value || 'kg';
  return isQuantityUnit(safeValue) ? safeValue : 'kg';
};

const validateYesNo = (value: string | null | undefined): YesNo => {
  const safeValue = value || 'no';
  return isYesNo(safeValue) ? safeValue : 'no';
};

const validateCondition = (value: string | null | undefined): Condition => {
  const safeValue = value || 'new';
  return isCondition(safeValue) ? safeValue : 'new';
};

const validateCertification = (value: string | null | undefined): Certification => {
  const safeValue = value || '';
  return isCertification(safeValue) ? safeValue : '';
};

const validatePaymentTerms = (value: string | null | undefined): PaymentTerms => {
  const safeValue = value || '';
  return isPaymentTerms(safeValue) ? safeValue : '';
};

const validateStatus = (value: string | null | undefined): ListingStatus => {
  const safeValue = value || 'active';
  return safeValue === 'active' ? 'active' : 'draft';
};

const EditListing = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryFields, setCategoryFields] = useState<Record<string, any>>({});
  const [categoryFieldValues, setCategoryFieldValues] = useState<Record<string, any>>({});

  const { user } = useAuth();
  const { data: categories } = useCategories();
  const updateListing = useUpdateListing();
  const navigate = useNavigate();
  const { uploadImages, uploading } = useStorage();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      status: ListingStatusEnum.active,
      organic: YesNoEnum.no,
      negotiable: YesNoEnum.no,
      delivery_available: YesNoEnum.no,
      price_unit: PriceUnitEnum.total,
      quantity_unit: QuantityUnitEnum.kg
    }
  });

  const selectedCategory = watch('category_id');
  const { data: fields, isLoading: fieldsLoading } = useCategoryFields(selectedCategory);
  const categoryFieldsData = fields as CategoryField[] | undefined;

  // Fetch existing listing data
  const { data: listing, isLoading } = useQuery<ListingWithDetails>({
    queryKey: ['listing', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          category:categories(*),
          subcategory:subcategories(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  // Update the field values query to use a custom table
  const { data: fieldValues } = useQuery<ListingFieldValue[]>({
    queryKey: ['listing-field-values', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listing_field_values')
        .select(`
          id,
          listing_id,
          field_id,
          field_value
        `)
        .eq('listing_id', id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!id
  });

  // Populate form with existing data
  useEffect(() => {
    if (listing) {
      // Set basic fields
      setValue('category_id', listing.category_id);
      setValue('title', listing.title);
      setValue('description', listing.description);
      setValue('price', listing.price.toString());
      setValue('quantity', listing.quantity.toString());
      setValue('harvest_date', listing.harvest_date || '');
      setValue('location_city', listing.location_city);
      setValue('location_province', listing.location_province || '');
      setValue('location_address', listing.location_address || '');
      setValue('contact_name', listing.contact_name || '');
      setValue('contact_phone', listing.contact_phone || '');
      setValue('contact_email', listing.contact_email || '');
      setValue('min_order_quantity', listing.min_order_quantity?.toString() || '');

      // Set enum fields with type guards
      setValue('price_unit', isPriceUnit(listing.price_unit) ? listing.price_unit : PriceUnitEnum.total);
      setValue('quantity_unit', isQuantityUnit(listing.quantity_unit) ? listing.quantity_unit : QuantityUnitEnum.kg);
      setValue('organic', isYesNo(listing.organic) ? listing.organic : YesNoEnum.no);
      setValue('certification', isCertification(listing.certification) ? listing.certification : CertificationEnum.none);
      setValue('negotiable', isYesNo(listing.negotiable) ? listing.negotiable : YesNoEnum.no);
      setValue('condition', isCondition(listing.condition) ? listing.condition : ConditionEnum.new);
      setValue('delivery_available', isYesNo(listing.delivery_available) ? listing.delivery_available : YesNoEnum.no);
      setValue('payment_terms', isPaymentTerms(listing.payment_terms) ? listing.payment_terms : PaymentTermsEnum.none);
      setValue('status', isListingStatus(listing.status) ? listing.status : ListingStatusEnum.draft);

      // Set images
      setExistingImages(listing.images || []);
    }
  }, [listing, setValue]);

  // Add this effect to populate category field values
  useEffect(() => {
    if (fieldValues) {
      const values = fieldValues.reduce((acc, value) => {
        acc[value.field_id] = value.field_value;
        return acc;
      }, {} as Record<string, any>);
      setCategoryFieldValues(values);
    }
  }, [fieldValues]);

  // Debug form errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Form validation errors:', errors);
    }
  }, [errors]);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      
      // Check file types and sizes before adding
      const validFiles = newFiles.filter(file => {
        const isValidType = ACCEPTED_IMAGE_TYPES.includes(file.type);
        const isValidSize = file.size <= MAX_FILE_SIZE;
        
        if (!isValidType) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not a supported image type. Please use JPEG, PNG, or WebP images.`,
            variant: "destructive"
          });
          return false;
        }
        
        if (!isValidSize) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds the 5MB size limit.`,
            variant: "destructive"
          });
          return false;
        }
        
        return true;
      });

      setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  // Update the Select onValueChange handlers with proper types
  const handlePriceUnitChange = (value: string) => {
    if (isPriceUnit(value)) {
      setValue('price_unit', value);
    }
  };

  const handleQuantityUnitChange = (value: string) => {
    if (isQuantityUnit(value)) {
      setValue('quantity_unit', value);
    }
  };

  const handleYesNoChange = (field: keyof ListingFormData, value: string) => {
    if (isYesNo(value)) {
      setValue(field, value);
    }
  };

  const handleConditionChange = (value: string) => {
    if (isCondition(value)) {
      setValue('condition', value);
    }
  };

  const handleCertificationChange = (value: string) => {
    if (isCertification(value)) {
      setValue('certification', value);
    }
  };

  const handlePaymentTermsChange = (value: string) => {
    if (isPaymentTerms(value)) {
      setValue('payment_terms', value);
    }
  };

  const onSubmit = async (data: ListingFormData) => {
    try {
      console.log('Form submission started with data:', data);
      console.log('Form validation state:', { isValid, errors });
      
      if (!user || !id) {
        toast({
          title: "Error",
          description: "You must be logged in to update the listing.",
          variant: "destructive"
        });
        return;
      }

      if (existingImages.length === 0 && selectedFiles.length === 0) {
        toast({
          title: "Error",
          description: "Please upload at least one image.",
          variant: "destructive"
        });
        return;
      }

      if (!data.price_unit) {
      toast({
          title: "Error",
          description: "Please select a price unit.",
        variant: "destructive"
      });
      return;
    }

      if (!data.quantity_unit) {
        toast({
          title: "Error",
          description: "Please select a quantity unit.",
          variant: "destructive"
        });
        return;
      }

      setIsSubmitting(true);
      console.log('Uploading new images...');

      // Upload new images if any
      let newImageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        try {
          newImageUrls = await uploadImages(selectedFiles, user.id);
        } catch (error) {
          toast({
            title: "Error uploading images",
            description: "Failed to upload one or more images. Please try again.",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Combine existing and new images
      const allImages = [...existingImages, ...newImageUrls];

      // Create the listing update data
      const listingData: ListingUpdate = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        category_id: data.category_id,
        location_city: data.location_city,
        location_province: data.location_province,
        location_address: data.location_address,
        quantity: parseFloat(data.quantity),
        quantity_unit: data.quantity_unit,
        price_unit: data.price_unit,
        harvest_date: data.harvest_date ? new Date(data.harvest_date).toISOString() : null,
        organic: data.organic,
        certification: data.certification || null,
        negotiable: data.negotiable,
        condition: data.condition,
        contact_name: data.contact_name,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
        delivery_available: data.delivery_available,
        min_order_quantity: data.min_order_quantity ? parseFloat(data.min_order_quantity) : null,
        payment_terms: data.payment_terms || null,
        status: data.status,
        images: allImages
      };

      console.log('Updating listing with data:', listingData);

      // Update the listing
      await updateListing.mutateAsync({ id, data: listingData });

      // Save category field values
      if (fields && fields.length > 0) {
        const fieldValues = fields.map(field => ({
          listing_id: id,
          field_id: field.id,
          field_value: String(categoryFields[field.field_name] || '')
        }));

        // Delete existing field values
        await supabase
          .from('listing_field_values')
          .delete()
          .eq('listing_id', id);

        // Insert new field values
        const { error: fieldError } = await supabase
          .from('listing_field_values')
          .insert(fieldValues.map(value => ({
            listing_id: value.listing_id,
            field_id: value.field_id,
            field_value: value.field_value
          })));

        if (fieldError) {
          console.error('Error saving field values:', fieldError);
          throw fieldError;
        }
      }

      toast({
        title: "Listing updated!",
        description: "Your listing has been updated successfully."
      });

      navigate('/my-listings');
    } catch (error) {
      console.error('Error updating listing:', error);
      toast({
        title: "Error updating listing",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-200 w-3/4 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 w-1/4 rounded mb-8"></div>
            <div className="h-32 bg-gray-200 rounded mb-8"></div>
          </div>
        </div>
      </Layout>
    );
  }

  // Check if the user owns this listing
  if (listing && listing.user_id !== user.id) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized</h1>
            <p className="text-gray-600 mb-8">You don't have permission to edit this listing.</p>
            <Link to="/my-listings">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to My Listings
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/my-listings')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Listings
          </Button>
          <h1 className="text-2xl font-bold">Edit Listing</h1>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images (Max 5)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Existing Images */}
                {existingImages.map((image, index) => (
                  <div key={`existing-${index}`} className="relative aspect-square">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {/* New Images */}
                {selectedFiles.map((file, index) => (
                  <div key={`new-${index}`} className="relative aspect-square">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New upload ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {/* Upload Button */}
                {existingImages.length + selectedFiles.length < 5 && (
                  <div className="aspect-square">
                    <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                      <Camera className="h-8 w-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">Add Image</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Upload up to 5 images (JPG, PNG, WebP). Max size: 5MB each.
              </p>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Enter a descriptive title"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe your product in detail"
                className={`min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select
                onValueChange={(value) => {
                  console.log('Category selected:', value);
                  setValue('category_id', value);
                }}
                value={watch('category_id')}
              >
                <SelectTrigger className={errors.category_id ? 'border-red-500' : ''}>
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
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-500">{errors.category_id.message}</p>
              )}
            </div>

            {/* Category-specific fields */}
            {fields && fields.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Category Details</CardTitle>
                  <CardDescription>Additional information specific to this category</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categoryFieldsData?.map((field) => (
                    <div key={field.id} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        {field.field_label}
                        {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {field.field_type === 'select' && field.field_options?.options ? (
                        <select
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          value={categoryFieldValues[field.id] || ''}
                          onChange={(e) => {
                            const newValues = { ...categoryFieldValues };
                            newValues[field.id] = e.target.value;
                            setCategoryFieldValues(newValues);
                          }}
                        >
                          <option value="">{t('select_option')}</option>
                          {field.field_options.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <>
                          {field.field_type === 'text' && (
                            <Input
                              value={categoryFields[field.field_name] || ''}
                              onChange={(e) => setCategoryFields(prev => ({
                                ...prev,
                                [field.field_name]: e.target.value
                              }))}
                              required={field.required}
                            />
                          )}

                          {field.field_type === 'number' && (
                            <Input
                              type="number"
                              value={categoryFields[field.field_name] || ''}
                              onChange={(e) => setCategoryFields(prev => ({
                                ...prev,
                                [field.field_name]: e.target.value
                              }))}
                              required={field.required}
                            />
                          )}

                          {field.field_type === 'boolean' && (
                            <Select
                              value={categoryFields[field.field_name] ? 'yes' : 'no'}
                              onValueChange={(value) => setCategoryFields(prev => ({
                                ...prev,
                                [field.field_name]: value === 'yes'
                              }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select yes/no" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          )}

                          {field.field_type === 'date' && (
                            <Input
                              type="date"
                              value={categoryFields[field.field_name] || ''}
                              onChange={(e) => setCategoryFields(prev => ({
                                ...prev,
                                [field.field_name]: e.target.value
                              }))}
                              required={field.required}
                            />
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Price and Quantity */}
            <div className="space-y-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (PKR)
                </label>
                <div className="flex gap-2">
                  <Input
                    id="price"
                    {...register('price')}
                    type="number"
                    placeholder="Enter price"
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  <Select
                    onValueChange={(value) => {
                      if (isPriceUnit(value)) {
                        setValue('price_unit', value);
                      }
                    }}
                    value={watch('price_unit')}
                  >
                    <SelectTrigger className={`w-[120px] ${errors.price_unit ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PriceUnitEnum.total}>Total</SelectItem>
                      <SelectItem value={PriceUnitEnum.per_kg}>Per Kg</SelectItem>
                      <SelectItem value={PriceUnitEnum.per_acre}>Per Acre</SelectItem>
                      <SelectItem value={PriceUnitEnum.per_unit}>Per Unit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(errors.price || errors.price_unit) && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.price?.message || errors.price_unit?.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex gap-2">
                  <Input
                    id="quantity"
                    {...register('quantity')}
                    type="number"
                    placeholder="Enter quantity"
                    className={errors.quantity ? 'border-red-500' : ''}
                  />
                  <Select
                    onValueChange={(value) => {
                      if (isQuantityUnit(value)) {
                        setValue('quantity_unit', value);
                      }
                    }}
                    value={watch('quantity_unit')}
                  >
                    <SelectTrigger className={`w-[120px] ${errors.quantity_unit ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={QuantityUnitEnum.kg}>Kg</SelectItem>
                      <SelectItem value={QuantityUnitEnum.tons}>Tons</SelectItem>
                      <SelectItem value={QuantityUnitEnum.acres}>Acres</SelectItem>
                      <SelectItem value={QuantityUnitEnum.units}>Units</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(errors.quantity || errors.quantity_unit) && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.quantity?.message || errors.quantity_unit?.message}
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location_city" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="space-y-4">
                <Input
                  id="location_city"
                  {...register('location_city')}
                  placeholder="City"
                  className={errors.location_city ? 'border-red-500' : ''}
                />
                <Select
                  onValueChange={(value) => setValue('location_province', value)}
                  value={watch('location_province')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Punjab">Punjab</SelectItem>
                    <SelectItem value="Sindh">Sindh</SelectItem>
                    <SelectItem value="KPK">KPK</SelectItem>
                    <SelectItem value="Balochistan">Balochistan</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  {...register('location_address')}
                  placeholder="Detailed address"
                />
              </div>
              {errors.location_city && (
                <p className="mt-1 text-sm text-red-500">{errors.location_city.message}</p>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              <div>
                <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name
                </label>
                <Input
                  id="contact_name"
                  {...register('contact_name')}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input
                  id="contact_phone"
                  {...register('contact_phone')}
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
                  {...register('contact_email')}
                  placeholder="Your email address"
                  type="email"
                />
                {errors.contact_email && (
                  <p className="mt-1 text-sm text-red-500">{errors.contact_email.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button 
                type="submit" 
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isSubmitting || uploading}
              >
                {isSubmitting || uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Update Listing
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                type="button"
                className="flex-1"
                onClick={() => navigate('/my-listings')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditListing; 