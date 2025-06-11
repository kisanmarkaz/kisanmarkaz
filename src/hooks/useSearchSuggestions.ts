import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SearchSuggestions {
  titles: string[];
  categories: string[];
  subcategories: string[];
}

export function useSearchSuggestions(query: string) {
  return useQuery<SearchSuggestions>({
    queryKey: ['search-suggestions', query],
    queryFn: async () => {
      if (!query || query.length < 2) return {
        titles: [],
        categories: [],
        subcategories: []
      };

      // Get suggestions from titles
      const { data: titleSuggestions } = await supabase
        .from('listings')
        .select('title')
        .ilike('title', `%${query}%`)
        .limit(5);

      // Get suggestions from categories
      const { data: categorySuggestions } = await supabase
        .from('categories')
        .select('name')
        .ilike('name', `%${query}%`)
        .limit(3);

      // Get suggestions from subcategories
      const { data: subcategorySuggestions } = await supabase
        .from('subcategories')
        .select('name')
        .ilike('name', `%${query}%`)
        .limit(3);

      return {
        titles: titleSuggestions?.map(item => item.title) || [],
        categories: categorySuggestions?.map(item => item.name) || [],
        subcategories: subcategorySuggestions?.map(item => item.name) || []
      };
    },
    enabled: query.length >= 2,
  });
} 