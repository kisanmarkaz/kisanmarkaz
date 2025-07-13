import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('all');
  const [searchCity, setSearchCity] = useState('all');
  const navigate = useNavigate();

  const handleSearch = useCallback(() => {
    const searchParams = new URLSearchParams();
    if (searchQuery) {
      searchParams.set('q', searchQuery);
    }
    if (searchLocation !== 'all') {
      searchParams.set('location', searchLocation);
      if (searchCity !== 'all') {
        searchParams.set('city', searchCity);
      }
    }
    
    navigate(`/search?${searchParams.toString()}`);
  }, [searchQuery, searchLocation, searchCity, navigate]);

  return {
    searchQuery,
    setSearchQuery,
    searchLocation,
    setSearchLocation,
    searchCity,
    setSearchCity,
    handleSearch
  };
}; 