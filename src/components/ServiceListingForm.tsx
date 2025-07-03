import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, X, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useStorage } from '@/hooks/useStorage';
import { ServiceTypeEnum } from '@/types/service';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  service_type: z.enum(Object.keys(ServiceTypeEnum) as [string, ...string[]]),
  price: z.string().min(1, 'Price is required'),
  price_unit: z.enum(['per_hour', 'per_acre', 'per_day', 'fixed']),
  negotiable: z.boolean().default(false),
  location_city: z.string().min(1, 'City is required'),
  location_province: z.string().min(1, 'Province is required'),
  location_address: z.string().optional(),
  contact_name: z.string().min(1, 'Contact name is required'),
  contact_phone: z.string().min(1, 'Contact phone is required'),
  contact_email: z.string().email('Invalid email').optional(),
  status: z.enum(['active', 'inactive']).default('active')
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceListingFormProps {
  onSubmit: (data: ServiceFormData, images: File[]) => Promise<void>;
  initialData?: Partial<ServiceFormData>;
  isLoading?: boolean;
}

const ServiceListingForm = ({ onSubmit, initialData, isLoading = false }: ServiceListingFormProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const { uploadImages } = useStorage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      ...initialData,
      status: 'active',
      negotiable: false
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: 'Error',
          description: `${file.name} is too large. Maximum size is 5MB.`,
          variant: 'destructive'
        });
        return false;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: 'Error',
          description: `${file.name} has an invalid file type.`,
          variant: 'destructive'
        });
        return false;
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (data: ServiceFormData) => {
    try {
      await onSubmit(data, selectedFiles);
    } catch (error) {
      console.error('Error submitting service:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit service listing. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Service Title
        </label>
        <Input
          id="title"
          {...register('title')}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Service Type */}
      <div>
        <label htmlFor="service_type" className="block text-sm font-medium text-gray-700">
          Service Type
        </label>
        <Select
          onValueChange={(value) => setValue('service_type', value)}
          defaultValue={watch('service_type')}
        >
          <SelectTrigger className={errors.service_type ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select service type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ServiceTypeEnum).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.service_type && (
          <p className="mt-1 text-sm text-red-500">{errors.service_type.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Textarea
          id="description"
          {...register('description')}
          className={`min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Price and Unit */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <Input
            id="price"
            type="number"
            {...register('price')}
            className={errors.price ? 'border-red-500' : ''}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="price_unit" className="block text-sm font-medium text-gray-700">
            Price Unit
          </label>
          <Select
            onValueChange={(value) => setValue('price_unit', value as any)}
            defaultValue={watch('price_unit')}
          >
            <SelectTrigger className={errors.price_unit ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select price unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="per_hour">Per Hour</SelectItem>
              <SelectItem value="per_acre">Per Acre</SelectItem>
              <SelectItem value="per_day">Per Day</SelectItem>
              <SelectItem value="fixed">Fixed Price</SelectItem>
            </SelectContent>
          </Select>
          {errors.price_unit && (
            <p className="mt-1 text-sm text-red-500">{errors.price_unit.message}</p>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="location_city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <Input
            id="location_city"
            {...register('location_city')}
            className={errors.location_city ? 'border-red-500' : ''}
          />
          {errors.location_city && (
            <p className="mt-1 text-sm text-red-500">{errors.location_city.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="location_province" className="block text-sm font-medium text-gray-700">
            Province
          </label>
          <Input
            id="location_province"
            {...register('location_province')}
            className={errors.location_province ? 'border-red-500' : ''}
          />
          {errors.location_province && (
            <p className="mt-1 text-sm text-red-500">{errors.location_province.message}</p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700">
            Contact Name
          </label>
          <Input
            id="contact_name"
            {...register('contact_name')}
            className={errors.contact_name ? 'border-red-500' : ''}
          />
          {errors.contact_name && (
            <p className="mt-1 text-sm text-red-500">{errors.contact_name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">
            Contact Phone
          </label>
          <Input
            id="contact_phone"
            {...register('contact_phone')}
            className={errors.contact_phone ? 'border-red-500' : ''}
          />
          {errors.contact_phone && (
            <p className="mt-1 text-sm text-red-500">{errors.contact_phone.message}</p>
          )}
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images
        </label>
        <div className="grid grid-cols-4 gap-4">
          {selectedFiles.map((file, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-2">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          ))}
          <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
            <Camera className="h-8 w-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">Add Image</span>
            <input
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              onChange={handleFileSelect}
              className="hidden"
              multiple
            />
          </label>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Service Listing'
        )}
      </Button>
    </form>
  );
};

export default ServiceListingForm; 