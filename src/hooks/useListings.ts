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
      // Special handling for featured listings to avoid RLS on joined table
      if (filters?.featured) {
        const { data: activeFeatured, error: activeErr } = await supabase
          .from('active_featured_listings')
          .select('listing_id, created_at')
          .order('created_at', { ascending: false });
        if (activeErr) throw activeErr;

        const listingIds = (activeFeatured || []).map((row: any) => row.listing_id);
        if (listingIds.length === 0) return [];

        const orderIndexById = new Map<string, number>(listingIds.map((id, idx) => [id, idx]));

        const { data: featuredData, error: listErr } = await supabase
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
          .in('id', listingIds)
          .eq('status', 'active');
        if (listErr) throw listErr;

        return (featuredData || []).sort((a: any, b: any) => {
          const ai = orderIndexById.get(a.id) ?? 0;
          const bi = orderIndexById.get(b.id) ?? 0;
          return ai - bi;
        });
      }

      // Default non-featured query path
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

      // Fetch listings and active featured IDs in parallel so RLS doesn't hide featured state
      const [listingsRes, activeRes] = await Promise.all([
        query,
        supabase.from('active_featured_listings').select('listing_id')
      ]);

      if (listingsRes.error) throw listingsRes.error;
      if (activeRes.error) throw activeRes.error;

      const data = listingsRes.data || [];
      const activeIds = new Set((activeRes.data || []).map((r: any) => r.listing_id));

      // Ensure items in the active set are marked as featured locally (for badges) and sorted to top
      const normalized = data.map((item: any) => {
        const isActive = activeIds.has(item.id);
        if (isActive) {
          if (!item.featured_listings || item.featured_listings.length === 0) {
            item.featured_listings = [{ id: 'active', status: 'active' }];
          } else {
            // Ensure only active state is considered for downstream badge checks
            item.featured_listings = item.featured_listings.filter((fl: any) => fl.status === 'active');
            if (item.featured_listings.length === 0) {
              item.featured_listings = [{ id: 'active', status: 'active' }];
            }
          }
        } else {
          // If not in the active view, force-clear any joined featured rows
          // to avoid stale badges when table status wasn't expired yet
          item.featured_listings = [];
        }
        return item;
      });

      return normalized.sort((a: any, b: any) => {
        const aIsFeatured = a.featured_listings && a.featured_listings.some((fl: any) => fl.status === 'active');
        const bIsFeatured = b.featured_listings && b.featured_listings.some((fl: any) => fl.status === 'active');
        if (aIsFeatured && !bIsFeatured) return -1;
        if (!aIsFeatured && bIsFeatured) return 1;
        return 0;
      });
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
