
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useFavorites() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          listing:listings(
            *,
            category:categories(*),
            subcategory:subcategories(*)
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ listingId, isFavorite }: { listingId: string; isFavorite: boolean }) => {
      if (!user) throw new Error('User not authenticated');
      
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            listing_id: listingId
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    }
  });
}
