import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export interface CategoryField {
  id: string;
  category_id: string;
  field_name: string;
  field_type: 'text' | 'number' | 'select' | 'date' | 'boolean';
  field_label: string;
  field_options: { options?: string[] } | null;
  required: boolean;
  created_at: string;
  updated_at: string;
}

async function fetchCategoryFields(categoryId?: string) {
  if (!categoryId) return [];
  
  console.log('Fetching fields for category:', categoryId);
  
  const { data, error } = await supabase
    .from('category_fields')
    .select('*')
    .eq('category_id', categoryId)
    .order('field_name');

  if (error) {
    console.error('Error fetching category fields:', error);
    return [];
  }

  console.log('Fetched category fields:', data);
  return data as unknown as CategoryField[];
}

export function useCategoryFields(categoryId?: string) {
  const query = useQuery({
    queryKey: ['category_fields', categoryId],
    queryFn: () => fetchCategoryFields(categoryId),
    enabled: !!categoryId,
    staleTime: 300000, // 5 minutes
    gcTime: 3600000, // 1 hour
  });

  console.log('useCategoryFields hook result:', {
    categoryId,
    isLoading: query.isLoading,
    isError: query.isError,
    data: query.data
  });

  return query;
} 