import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { useEffect } from 'react';

// Separate the fetcher function so it can be used for prefetching
export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      subcategories:subcategories(*)
    `)
    .order('name');
  
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data as (Tables<'categories'> & { 
    subcategories: Tables<'subcategories'>[] 
  })[];
}

export function useCategories() {
  const queryClient = useQueryClient();

  // Prefetch on mount
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: fetchCategories,
    });
  }, [queryClient]);

  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 300000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    initialData: [], // Provide empty initial data to prevent undefined
  });
}

// Separate the subcategories fetcher
async function fetchSubcategories(categoryId?: string) {
  let query = supabase.from('subcategories').select('*');
  
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  
  const { data, error } = await query.order('name');
  if (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
  return data;
}

export function useSubcategories(categoryId?: string) {
  const queryClient = useQueryClient();

  // Prefetch subcategories when categoryId is available
  useEffect(() => {
    if (categoryId) {
      queryClient.prefetchQuery({
        queryKey: ['subcategories', categoryId],
        queryFn: () => fetchSubcategories(categoryId),
      });
    }
  }, [categoryId, queryClient]);

  return useQuery({
    queryKey: ['subcategories', categoryId],
    queryFn: () => fetchSubcategories(categoryId),
    enabled: !!categoryId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 300000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    initialData: [], // Provide empty initial data to prevent undefined
  });
}
