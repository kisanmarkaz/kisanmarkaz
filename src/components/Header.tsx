import React, { useState, useEffect } from 'react';
import { Search, MapPin, User, Plus, Menu, Heart, MessageCircle, Settings, ChevronDown, Wrench, Grid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/hooks/useSearch';
import SearchSuggestions from './SearchSuggestions';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, slideInLeft, slideInRight, slideUp } from '@/lib/animations';
import { useFavorites } from '@/hooks/useFavorites';
import { useCategories } from '@/hooks/useCategories';
import Logo from './Logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define city options for each province
const cityOptions = {
  punjab: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot'],
  sindh: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Mirpur Khas'],
  kpk: ['Peshawar', 'Mardan', 'Abbottabad', 'Mingora', 'Kohat'],
  balochistan: ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Chaman'],
};

const Header = () => {
  const { searchQuery, setSearchQuery, searchLocation, setSearchLocation, searchCity, setSearchCity, handleSearch } = useSearch();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();
  const { data: favorites = [] } = useFavorites();
  const { data: categories = [] } = useCategories();

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Add click outside listener for mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
    setShowSuggestions(false);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch();
    setShowSuggestions(false);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchLocation(value);
    setSearchCity('all'); // Reset city when location changes
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className={`fixed top-0 left-0 right-0 z-50 text-white transition-all duration-300 ${scrolled ? 'glass-dark bg-green-600/80 shadow-xl' : 'glass bg-green-600/90 shadow-lg'
        }`}
    >
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <motion.div
          variants={slideUp}
          className="flex items-center justify-end py-2 text-sm border-b border-green-500"
        >
          <motion.div
            variants={slideInRight}
            className="flex items-center space-x-4"
          >
            {user ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link to="/settings" className="flex items-center hover:text-green-200 transition-colors duration-200">
                    <Settings className="h-4 w-4 mr-1" />
                    {t('common.settings')}
                  </Link>
                </motion.div>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link to="/auth" className="flex items-center hover:text-green-200 transition-colors duration-200">
                  <User className="h-4 w-4 mr-1" />
                  {t('common.login')}
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4 gap-2 md:gap-4">
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Logo size="md" />
            </motion.div>
          </div>
          
          {/* Mobile menu button - positioned at the far right */}
          <div className="md:hidden ml-auto order-last">
            <button
              className="relative w-8 h-8 flex flex-col justify-center items-center group mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block h-0.5 w-6 bg-white transform transition duration-300 ease-in-out ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : 'group-hover:bg-green-200'}`}></span>
              <span className={`block h-0.5 w-6 bg-white transform transition duration-300 ease-in-out my-1 ${mobileMenuOpen ? 'opacity-0' : 'group-hover:bg-green-200'}`}></span>
              <span className={`block h-0.5 w-6 bg-white transform transition duration-300 ease-in-out ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : 'group-hover:bg-green-200'}`}></span>
            </button>
          </div>

          {/* Search bar */}
          <motion.form
            variants={fadeIn}
            onSubmit={handleSubmit}
            className="flex flex-1 max-w-2xl mx-0 md:mx-8 relative order-3 md:order-none w-full md:w-auto mt-4 md:mt-0"
          >
            <div className="relative flex shadow-xl rounded-lg overflow-hidden glass-input">
              <Input
                type="text"
                placeholder={t('search.placeholder')}
                className="flex-1 rounded-l-lg border-0 bg-white/30 text-white placeholder-white/70 focus:ring-2 focus:ring-yellow-500/50 focus:bg-white/20 transition-all duration-200 backdrop-blur-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  // Delay hiding suggestions to allow clicking them
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
              />
              <div className="flex items-center px-3 bg-white/20 border-l border-white/30 backdrop-blur-md">
                <MapPin className="h-4 w-4 text-white mr-2" />
                <select
                  className="border-0 bg-transparent text-white text-sm focus:outline-none"
                  value={searchLocation}
                  onChange={handleLocationChange}
                >
                  <option value="all" className="text-gray-800">{t('search.locations.all')}</option>
                  <option value="punjab" className="text-gray-800">{t('search.locations.punjab')}</option>
                  <option value="sindh" className="text-gray-800">{t('search.locations.sindh')}</option>
                  <option value="kpk" className="text-gray-800">{t('search.locations.kpk')}</option>
                  <option value="balochistan" className="text-gray-800">{t('search.locations.balochistan')}</option>
                </select>
                {searchLocation !== 'all' && (
                  <select
                    className="border-0 bg-transparent text-white text-sm focus:outline-none ml-2 border-l border-white/30 pl-2"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                  >
                    <option value="all" className="text-gray-800">{t('search.locations.allCities')}</option>
                    {cityOptions[searchLocation as keyof typeof cityOptions]?.map((city) => (
                      <option key={city} value={city.toLowerCase()} className="text-gray-800">
                        {city}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hover-glow"
              >
                <Button
                  type="submit"
                  className="rounded-l-none bg-yellow-500 hover:bg-yellow-600 text-gray-900 transition-all duration-200 shadow-lg hover:shadow-yellow-500/50"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>

            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <SearchSuggestions
                    query={searchQuery}
                    onSelect={handleSuggestionSelect}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>

          {/* Action buttons - mobile and desktop */}
          <motion.div
            variants={slideInRight}
className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 absolute md:static top-16 right-0 bg-green-600/90 md:bg-transparent p-4 md:p-0 rounded-lg shadow-lg md:shadow-none z-50 mobile-menu`}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:text-green-200">
                  <Grid className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link to={`/category/${category.slug}`} className="w-full">
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link to="/favorites">
                <Button variant="ghost" className="text-white hover:text-green-200 transition-colors duration-200 relative">
                  <Heart className="h-5 w-5" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-yellow-500 text-xs text-gray-900 rounded-full w-4 h-4 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </Button>
              </Link>
            </motion.div>
            {user ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/sell">
                    <Button className="glass-button bg-yellow-500/90 hover:bg-yellow-500 text-gray-900 shadow-lg hover:shadow-yellow-500/50 transition-all duration-300">
                      <Plus className="h-4 w-4 mr-2 animate-pulse-slow" />
                      {t('common.sell')}
                    </Button>
                  </Link>
                </motion.div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:text-green-200">
                      <User className="h-5 w-5 mr-2" />
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/my-listings" className="w-full">
                        {t('common.myListings')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/messages" className="w-full flex items-center">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        My Messages
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="w-full">
                        {t('common.settings')}
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/auth">
                  <Button className="glass-button bg-yellow-500/90 hover:bg-yellow-500 text-gray-900 shadow-lg hover:shadow-yellow-500/50 transition-all duration-300">
                    {t('common.signIn')}
                  </Button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
