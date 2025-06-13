import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/use-toast';
import { useStorage } from '../hooks/useStorage';
import { useCategories } from '../hooks/useCategories';
import { useCategoryFields } from '../hooks/useCategoryFields';
import { useUpdateListing } from '../hooks/useListings';
import { listingSchema } from '../schemas/listing';
import Layout from '../components/Layout';
import { ImageUpload } from '../components/ImageUpload';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { YesNoEnum, CertificationEnum, ConditionEnum, PaymentTermsEnum, ListingStatusEnum, PriceUnitEnum, QuantityUnitEnum } from '../schemas/listing';
import { isYesNo, isCertification, isCondition, isPaymentTerms, isListingStatus, isPriceUnit, isQuantityUnit } from '../lib/typeGuards';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
}

type PriceUnit = typeof PriceUnitEnum[keyof typeof PriceUnitEnum];
type QuantityUnit = typeof QuantityUnitEnum[keyof typeof QuantityUnitEnum];
type YesNo = typeof YesNoEnum[keyof typeof YesNoEnum];
type Condition = typeof ConditionEnum[keyof typeof ConditionEnum];
type Certification = typeof CertificationEnum[keyof typeof CertificationEnum];
type PaymentTerms = typeof PaymentTermsEnum[keyof typeof PaymentTermsEnum];
type ListingStatus = typeof ListingStatusEnum[keyof typeof ListingStatusEnum];

interface ListingFormData {
  title: string;
  description: string;
  price: string;
  price_unit: PriceUnit;
  quantity: string;
  quantity_unit: QuantityUnit;
  category_id: string;
  location_city: string;
  location_state: string;
  location_country: string;
  organic: YesNo;
  condition: Condition;
  certification: Certification;
  payment_terms: PaymentTerms;
  status: ListingStatus;
}

interface ListingWithDetails {
  id: string;
  title: string;
  description: string;
  price: number;
  price_unit: PriceUnit;
  quantity: number;
  quantity_unit: QuantityUnit;
  category_id: string;
  location_city: string;
  location_state: string;
  location_country: string;
  organic: YesNo;
  condition: Condition;
  certification: Certification;
  payment_terms: PaymentTerms;
  status: ListingStatus;
  images: string[];
  category: Category;
  subcategory: Category | null;
  user_id: string;
}

// Helper functions to validate and convert values
const validatePriceUnit = (value: unknown): PriceUnit => {
  return isPriceUnit(value) ? value : PriceUnitEnum.total;
};

const validateQuantityUnit = (value: unknown): QuantityUnit => {
  return isQuantityUnit(value) ? value : QuantityUnitEnum.kg;
};

const validateYesNo = (value: unknown): YesNo => {
  return isYesNo(value) ? value : YesNoEnum.no;
};

const validateCondition = (value: unknown): Condition => {
  return isCondition(value) ? value : ConditionEnum.new;
};

const validateCertification = (value: unknown): Certification => {
  return isCertification(value) ? value : CertificationEnum.none;
};

const validatePaymentTerms = (value: unknown): PaymentTerms => {
  return isPaymentTerms(value) ? value : PaymentTermsEnum.none;
};

const validateStatus = (value: unknown): ListingStatus => {
  return isListingStatus(value) ? value : ListingStatusEnum.active;
};

export default function EditListing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { uploadImages, uploading, deleteImage } = useStorage();
  const { data: categories } = useCategories();
  const updateListing = useUpdateListing();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema)
  });

  const { data: fields = [] } = useCategoryFields(watch('category_id'));

  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { data: listing, isLoading } = useQuery<ListingWithDetails>({
    queryKey: ['listing', id],
    queryFn: async () => {
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

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  useEffect(() => {
    if (listing) {
      reset({
        title: listing.title || '',
        description: listing.description || '',
        price: listing.price?.toString() || '',
        price_unit: validatePriceUnit(listing.price_unit),
        quantity: listing.quantity?.toString() || '',
        quantity_unit: validateQuantityUnit(listing.quantity_unit),
        category_id: listing.category_id,
        location_city: listing.location_city || '',
        location_state: listing.location_state || '',
        location_country: listing.location_country || '',
        organic: validateYesNo(listing.organic),
        condition: validateCondition(listing.condition),
        certification: validateCertification(listing.certification),
        payment_terms: validatePaymentTerms(listing.payment_terms),
        status: validateStatus(listing.status)
      });

      if (listing.images) {
        setImages(listing.images);
      }
    }
  }, [listing, reset]);

  const handleImageUpload = async (file: File) => {
    if (!id || !user) return;

    setIsUploading(true);
    try {
      const urls = await uploadImages([file], user.id);
      if (urls.length > 0) {
        setImages(prev => [...prev, urls[0]]);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageDelete = async (url: string) => {
    try {
      await deleteImage(url);
      setImages(prev => prev.filter(img => img !== url));
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
    if (!id || !user) return;

    try {
      await updateListing.mutateAsync({
        id,
        data: {
          ...data,
          updated_at: new Date().toISOString(),
          images
        }
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
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!listing) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
          <Button asChild>
            <Link to="/listings">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Listings
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit Listing</CardTitle>
            <CardDescription>Update your listing details below</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="grid gap-4">
                  <div>
                    <Input
                      {...register('title')}
                      placeholder="Title"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                    )}
                  </div>
                  <div>
                    <Textarea
                      {...register('description')}
                      placeholder="Description"
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Price and Quantity */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Price and Quantity</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        type="number"
                        {...register('price')}
                        placeholder="Price"
                      />
                      {errors.price && (
                        <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
                      )}
                    </div>
                    <Select
                      value={watch('price_unit')}
                      onValueChange={(value) => setValue('price_unit', validatePriceUnit(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PriceUnitEnum).map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        type="number"
                        {...register('quantity')}
                        placeholder="Quantity"
                      />
                      {errors.quantity && (
                        <p className="text-sm text-red-500 mt-1">{errors.quantity.message}</p>
                      )}
                    </div>
                    <Select
                      value={watch('quantity_unit')}
                      onValueChange={(value) => setValue('quantity_unit', validateQuantityUnit(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(QuantityUnitEnum).map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Category</h3>
                <Select
                  value={watch('category_id')}
                  onValueChange={(value) => setValue('category_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category: Category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category_id && (
                  <p className="text-sm text-red-500 mt-1">{errors.category_id.message}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Location</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Input
                      {...register('location_city')}
                      placeholder="City"
                    />
                    {errors.location_city && (
                      <p className="text-sm text-red-500 mt-1">{errors.location_city.message}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      {...register('location_state')}
                      placeholder="State"
                    />
                    {errors.location_state && (
                      <p className="text-sm text-red-500 mt-1">{errors.location_state.message}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      {...register('location_country')}
                      placeholder="Country"
                    />
                    {errors.location_country && (
                      <p className="text-sm text-red-500 mt-1">{errors.location_country.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select
                    value={watch('condition')}
                    onValueChange={(value) => setValue('condition', validateCondition(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ConditionEnum).map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={watch('certification')}
                    onValueChange={(value) => setValue('certification', validateCertification(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Certification" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(CertificationEnum).map((cert) => (
                        <SelectItem key={cert} value={cert}>
                          {cert}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={watch('payment_terms')}
                    onValueChange={(value) => setValue('payment_terms', validatePaymentTerms(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Payment Terms" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(PaymentTermsEnum).map((term) => (
                        <SelectItem key={term} value={term}>
                          {term}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="organic"
                      checked={watch('organic') === YesNoEnum.yes}
                      onCheckedChange={(checked) =>
                        setValue('organic', checked ? YesNoEnum.yes : YesNoEnum.no)
                      }
                    />
                    <label
                      htmlFor="organic"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Organic
                    </label>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Images</h3>
                <div className="grid gap-4">
                  <div className="flex flex-wrap gap-4">
                    {images.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Product ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageDelete(url)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <ImageUpload
                    onFileSelect={handleImageUpload}
                    disabled={isUploading}
                    maxSize={MAX_FILE_SIZE}
                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/listings')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
} 