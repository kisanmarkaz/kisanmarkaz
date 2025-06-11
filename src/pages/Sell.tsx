import React, { useState, useEffect } from 'react';
import { Camera, X, MapPin, Scale, Ruler, Calendar, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useStorage } from '@/hooks/useStorage';
import { useCategories } from '@/hooks/useCategories';
import { useCategoryFields } from '@/hooks/useCategoryFields';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

type ListingStatus = 'active' | 'sold' | 'expired' | 'draft';
type ListingInsert = Database['public']['Tables']['listings']['Insert'];

interface ListingFormData {
  title: string;
  description: string;
  price: string;
  category_id: string;
  location_city: string;
  location_province?: string;
  location_address?: string;
  quantity: string;
  quantity_unit: string;
  price_unit: string;
  harvest_date?: string;
  organic?: 'yes' | 'no';
  certification?: '' | 'organic' | 'gap' | 'other';
  negotiable?: 'yes' | 'no';
  condition?: 'new' | 'excellent' | 'good' | 'fair' | 'poor';
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  delivery_available?: 'yes' | 'no';
  min_order_quantity?: string;
  payment_terms?: '' | 'advance' | 'partial' | 'delivery' | 'credit';
  status?: ListingStatus;
}

const listingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().min(1, 'Price is required'),
  category_id: z.string().min(1, 'Category is required'),
  location_city: z.string().min(1, 'City is required'),
  location_province: z.string().optional(),
  location_address: z.string().optional(),
  quantity: z.string().min(1, 'Quantity is required'),
  quantity_unit: z.string().min(1, 'Unit is required'),
  price_unit: z.string().min(1, 'Price unit is required'),
  harvest_date: z.string().optional(),
  organic: z.enum(['yes', 'no']).optional(),
  certification: z.enum(['', 'organic', 'gap', 'other']).optional(),
  negotiable: z.enum(['yes', 'no']).optional(),
  condition: z.enum(['new', 'excellent', 'good', 'fair', 'poor']).optional(),
  contact_name: z.string().optional(),
  contact_phone: z.string().optional(),
  contact_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  delivery_available: z.enum(['yes', 'no']).optional(),
  min_order_quantity: z.string().optional(),
  payment_terms: z.enum(['', 'advance', 'partial', 'delivery', 'credit']).optional(),
  status: z.enum(['active', 'sold', 'expired', 'draft']).optional().default('active')
});

const Sell = () => {
  const { t } = useLanguage();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryFields, setCategoryFields] = useState<Record<string, any>>({});
  const { user } = useAuth();
  const { data: categories } = useCategories();
  const navigate = useNavigate();
  const { uploadImages } = useStorage();
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
      status: 'active',
      organic: 'no',
      negotiable: 'no',
      delivery_available: 'no',
      price_unit: 'total',
      quantity_unit: 'kg'
    }
  });

  const selectedCategory = watch('category_id');
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
    if (Object.keys(errors).length > 0) {
      console.log('Form validation errors:', errors);
    }
  }, [errors]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      
      // Check file types and sizes before adding
      const validFiles = newFiles.filter(file => {
        const isValidType = ACCEPTED_IMAGE_TYPES.includes(file.type);
        const isValidSize = file.size <= MAX_FILE_SIZE; // 5MB
        
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

  const onSubmit = async (data: ListingFormData) => {
    try {
      console.log('Form submission started with data:', data);
      console.log('Form validation state:', { isValid, errors });
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a listing.",
          variant: "destructive"
        });
        return;
      }

      if (selectedFiles.length === 0) {
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
      console.log('Uploading images...');

      // Upload images first
      const imageUrls = await uploadImages(selectedFiles, user.id);
      console.log('Images uploaded successfully:', imageUrls);

      // Create the listing
      const listingData = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        category_id: data.category_id,
        location_city: data.location_city,
        location_province: data.location_province,
        location_address: data.location_address,
        quantity: data.quantity ? parseFloat(data.quantity) : null,
        quantity_unit: data.quantity_unit,
        price_unit: data.price_unit,
        harvest_date: data.harvest_date,
        organic: data.organic,
        certification: data.certification,
        negotiable: data.negotiable,
        condition: data.condition,
        contact_name: data.contact_name,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
        delivery_available: data.delivery_available,
        min_order_quantity: data.min_order_quantity ? parseFloat(data.min_order_quantity) : null,
        payment_terms: data.payment_terms,
        status: data.status || 'active',
        images: imageUrls,
        user_id: user.id,
      } as const;

      console.log('Creating listing with data:', listingData);

      const { data: listing, error } = await supabase
        .from('listings')
        .insert([listingData])
        .select()
        .single();

      if (error) {
        console.error('Error inserting listing:', error);
        throw error;
      }

      console.log('Listing created successfully:', listing);

      // Save category-specific field values
      if (fields && fields.length > 0 && listing) {
        const fieldValues = fields.map(field => ({
          listing_id: listing.id,
          field_id: field.id,
          field_value: categoryFields[field.field_name]
        }));

        console.log('Saving category field values:', fieldValues);

        const { error: fieldError } = await supabase
          .from('listing_field_values')
          .insert(fieldValues);

        if (fieldError) {
          console.error('Error inserting field values:', fieldError);
          throw fieldError;
        }

        console.log('Category field values saved successfully');
      }

      toast({
        title: "Success!",
        description: "Your listing has been created.",
      });

      navigate(`/listing/${listing.id}`);
    } catch (error: any) {
      console.error('Error creating listing:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to create listing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: keyof ListingFormData, value: string) => {
    setValue(field, value);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Create a New Listing</h1>
        
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images (Max 5)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Product ${index + 1}`}
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
                {selectedFiles.length < 5 && (
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
                defaultValue={watch('category_id')}
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

            {/* Price and Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    onValueChange={(value) => setValue('price_unit', value)}
                    defaultValue={watch('price_unit')}
                  >
                    <SelectTrigger className={`w-[120px] ${errors.price_unit ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="total">Total</SelectItem>
                      <SelectItem value="per_kg">Per Kg</SelectItem>
                      <SelectItem value="per_ton">Per Ton</SelectItem>
                      <SelectItem value="per_piece">Per Piece</SelectItem>
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
                    onValueChange={(value) => setValue('quantity_unit', value)}
                    defaultValue={watch('quantity_unit')}
                  >
                    <SelectTrigger className={`w-[120px] ${errors.quantity_unit ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kg</SelectItem>
                      <SelectItem value="ton">Ton</SelectItem>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="dozen">Dozen</SelectItem>
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
                  defaultValue={watch('location_province')}
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

            {/* Category-specific fields */}
            {fields && fields.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Category Details</CardTitle>
                  <CardDescription>Additional information specific to this category</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field) => {
                    console.log('Rendering field:', field);
                    return (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.field_label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        
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

                        {field.field_type === 'select' && field.field_options?.options && (
                          <Select
                            value={categoryFields[field.field_name] || ''}
                            onValueChange={(value) => setCategoryFields(prev => ({
                              ...prev,
                              [field.field_name]: value
                            }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Select ${field.field_label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.field_options.options.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
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

                        {field.field_type === 'boolean' && (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={field.field_name}
                              checked={categoryFields[field.field_name] || false}
                              onCheckedChange={(checked) => setCategoryFields(prev => ({
                                ...prev,
                                [field.field_name]: checked
                              }))}
                            />
                            <label
                              htmlFor={field.field_name}
                              className="text-sm text-gray-600"
                            >
                              Yes
                            </label>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

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
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Listing...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Listing
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Sell;
