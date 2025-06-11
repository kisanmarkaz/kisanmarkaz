import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export function useSubcategories(categoryId?: string) {
  return useQuery({
    queryKey: ['subcategories', categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .eq('category_id', categoryId)
        .order('name');
        
      if (error) {
        console.error('Error fetching subcategories:', error);
        return [];
      }
      
      return data as Tables<'subcategories'>[];
    },
    enabled: !!categoryId,
  });
} 