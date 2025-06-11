import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('all');
  const navigate = useNavigate();

  const handleSearch = useCallback(() => {
    const searchParams = new URLSearchParams();
    if (searchQuery) {
      searchParams.set('q', searchQuery);
    }
    if (searchLocation !== 'all') {
      searchParams.set('location', searchLocation);
    }
    
    navigate(`/search?${searchParams.toString()}`);
  }, [searchQuery, searchLocation, navigate]);

  return {
    searchQuery,
    setSearchQuery,
    searchLocation,
    setSearchLocation,
    handleSearch
  };
}; 