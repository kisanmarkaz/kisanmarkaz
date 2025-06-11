import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useStorage() {
  const [uploading, setUploading] = useState(false);

  const uploadImages = async (files: File[], userId: string) => {
    try {
      setUploading(true);
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('listings')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('listings')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImages,
    uploading
  };
} 