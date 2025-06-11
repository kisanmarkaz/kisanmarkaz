import React from 'react';
import { Search, Tag, Grid3X3 } from 'lucide-react';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';

interface SearchSuggestionsProps {
  query: string;
  onSelect: (suggestion: string) => void;
  className?: string;
}

const SearchSuggestions = ({ query, onSelect, className = '' }: SearchSuggestionsProps) => {
  const { data: suggestions, isLoading } = useSearchSuggestions(query);

  if (!query || query.length < 2 || !suggestions || (
    suggestions.titles.length === 0 && 
    suggestions.categories.length === 0 && 
    suggestions.subcategories.length === 0
  )) {
    return null;
  }

  return (
    <div className={`absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 ${className}`}>
      {suggestions.titles.length > 0 && (
        <div className="p-2">
          <div className="flex items-center text-xs text-gray-500 px-2 mb-1">
            <Search className="h-3 w-3 mr-1" />
            Listings
          </div>
          {suggestions.titles.map((title, index) => (
            <button
              key={index}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm"
              onClick={() => onSelect(title)}
            >
              {title}
            </button>
          ))}
        </div>
      )}

      {suggestions.categories.length > 0 && (
        <div className="p-2 border-t">
          <div className="flex items-center text-xs text-gray-500 px-2 mb-1">
            <Grid3X3 className="h-3 w-3 mr-1" />
            Categories
          </div>
          {suggestions.categories.map((category, index) => (
            <button
              key={index}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm"
              onClick={() => onSelect(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {suggestions.subcategories.length > 0 && (
        <div className="p-2 border-t">
          <div className="flex items-center text-xs text-gray-500 px-2 mb-1">
            <Tag className="h-3 w-3 mr-1" />
            Subcategories
          </div>
          {suggestions.subcategories.map((subcategory, index) => (
            <button
              key={index}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm"
              onClick={() => onSelect(subcategory)}
            >
              {subcategory}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions; 