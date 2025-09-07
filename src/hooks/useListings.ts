import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export function useListings(filters?: {
  categoryId?: string;
  subcategoryId?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  featured?: boolean;
  searchQuery?: string;
  sortBy?: 'newest' | 'oldest' | 'price-low' | 'price-high';
  condition?: 'new' | 'excellent' | 'good' | 'fair' | 'poor';
  deliveryAvailable?: boolean;
  paymentTerms?: 'advance' | 'partial' | 'delivery' | 'credit';
  organic?: boolean;
  quantityMin?: number;
  quantityMax?: number;
}) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: async () => {
      let query = supabase
        .from('listings')
        .select(`
          *,
          category:categories(*),
          subcategory:subcategories(*),
          featured_listings!left(
            id,
            featured_from,
            featured_until,
            status
          )
        `)
        .eq('status', 'active');

      // Apply search query
      if (filters?.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
      }

      // Apply filters
      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      if (filters?.subcategoryId) {
        query = query.eq('subcategory_id', filters.subcategoryId);
      }
      if (filters?.location) {
        query = query.or(`location_city.ilike.%${filters.location}%,location_province.ilike.%${filters.location}%`);
      }
      if (filters?.priceMin) {
        query = query.gte('price', filters.priceMin);
      }
      if (filters?.priceMax) {
        query = query.lte('price', filters.priceMax);
      }
      if (filters?.featured) {
        // Only show currently active featured listings
        const now = new Date().toISOString();
        query = query
          .not('featured_listings', 'is', null)
          .eq('featured_listings.status', 'active')
          .lte('featured_listings.featured_from', now)
          .gte('featured_listings.featured_until', now);
      }
      
      // New filters
      if (filters?.condition) {
        query = query.eq('condition', filters.condition);
      }
      if (filters?.deliveryAvailable !== undefined) {
        query = query.eq('delivery_available', filters.deliveryAvailable ? 'yes' : 'no');
      }
      if (filters?.paymentTerms) {
        query = query.eq('payment_terms', filters.paymentTerms);
      }
      if (filters?.organic !== undefined) {
        query = query.eq('organic', filters.organic ? 'yes' : 'no');
      }
      if (filters?.quantityMin) {
        query = query.gte('quantity', filters.quantityMin);
      }
      if (filters?.quantityMax) {
        query = query.lte('quantity', filters.quantityMax);
      }

      // Apply sorting
      switch (filters?.sortBy) {
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Sort featured listings to the top when not specifically filtering for featured only
      if (!filters?.featured && data) {
        return data.sort((a, b) => {
          const aIsFeatured = a.featured_listings && a.featured_listings.length > 0;
          const bIsFeatured = b.featured_listings && b.featured_listings.length > 0;
          
          if (aIsFeatured && !bIsFeatured) return -1;
          if (!aIsFeatured && bIsFeatured) return 1;
          return 0; // Keep original order for same type
        });
      }
      
      return data;
    }
  });
}

export function useFeaturedListings() {
  return useListings({ featured: true });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (listing: TablesInsert<'listings'>) => {
      const { data, error } = await supabase
        .from('listings')
        .insert(listing)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    }
  });
}

export function useUserListings(userId?: string) {
  return useQuery({
    queryKey: ['user-listings', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          category:categories(*),
          subcategory:subcategories(*),
          featured_listings!left(
            id,
            featured_from,
            featured_until,
            status
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TablesInsert<'listings'>> }) => {
      const { data: updatedData, error } = await supabase
        .from('listings')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    }
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    }
  });
}
