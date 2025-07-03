import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCreateService } from '@/hooks/useServices';
import { useStorage } from '@/hooks/useStorage';
import Layout from '@/components/Layout';
import ServiceListingForm from '@/components/ServiceListingForm';
import { useToast } from '@/components/ui/use-toast';

const NewService = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const createService = useCreateService();
  const { uploadImages } = useStorage();

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (data: any, images: File[]) => {
    try {
      // Upload images first
      let imageUrls: string[] = [];
      if (images.length > 0) {
        imageUrls = await uploadImages(images, 'services');
      }

      // Create service with image URLs
      await createService.mutateAsync({
        ...data,
        user_id: user.id,
        images: imageUrls,
        status: 'active',
        views_count: 0,
        featured: false
      });

      toast({
        title: 'Success',
        description: 'Service listing created successfully!',
      });

      navigate('/services');
    } catch (error) {
      console.error('Error creating service:', error);
      toast({
        title: 'Error',
        description: 'Failed to create service listing. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Post a Service</h1>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <ServiceListingForm
              onSubmit={handleSubmit}
              isLoading={createService.isPending}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewService; 