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
import { fadeIn, slideInRight } from '@/lib/animations';
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
      setScrolled(offset > 20);
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
      className={`fixed top-0 left-0 right-0 z-50 text-foreground transition-all duration-500 ease-in-out px-4 md:px-6 py-4
        ${scrolled ? 'pt-2 pb-2' : 'pt-4 pb-4'}
      `}
    >
      <div className={`
        mx-auto rounded-2xl transition-all duration-500 border
        ${scrolled
          ? 'glass-card bg-white/80 shadow-lg border-white/50 max-w-7xl'
          : 'bg-transparent border-transparent max-w-[1400px]'
        }
      `}>
        <div className="container mx-auto px-2 md:px-4">

          {/* Main header */}
          <div className="flex flex-col md:flex-row items-center justify-between py-2 gap-2 md:gap-4">
            {/* Logo and burger menu row for mobile */}
            <div className="flex items-center justify-between w-full md:w-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <Logo size={scrolled ? "sm" : "md"} />
              </motion.div>

              {/* Mobile menu button - positioned at the far right */}
              <div className="md:hidden">
                <button
                  className="relative w-8 h-8 flex flex-col justify-center items-center group mobile-menu-button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  <span className={`block h-0.5 w-6 bg-primary transform transition duration-300 ease-in-out ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : 'group-hover:bg-primary/80'}`}></span>
                  <span className={`block h-0.5 w-6 bg-primary transform transition duration-300 ease-in-out my-1 ${mobileMenuOpen ? 'opacity-0' : 'group-hover:bg-primary/80'}`}></span>
                  <span className={`block h-0.5 w-6 bg-primary transform transition duration-300 ease-in-out ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : 'group-hover:bg-primary/80'}`}></span>
                </button>
              </div>
            </div>

            {/* Search bar */}
            <motion.form
              variants={fadeIn}
              onSubmit={handleSubmit}
              className="flex flex-1 max-w-3xl mx-auto relative w-full mt-2 md:mt-0 transition-all duration-300"
            >
              <div className={`relative flex w-full rounded-2xl overflow-hidden transition-all duration-300 ${scrolled ? 'shadow-md border border-gray-100' : 'shadow-xl glass-input'}`}>
                <Input
                  type="text"
                  placeholder={t('search.placeholder')}
                  className={`flex-1 w-full min-w-0 rounded-l-2xl border-0 bg-white/60 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200 backdrop-blur-md h-12`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    // Delay hiding suggestions to allow clicking them
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                />
                <div className="flex items-center px-2 md:px-3 bg-white/40 border-l border-white/50 backdrop-blur-md">
                  <MapPin className="h-4 w-4 text-primary mr-1 md:mr-2 flex-shrink-0" />
                  <select
                    className="border-0 bg-transparent text-gray-800 text-xs md:text-sm focus:outline-none min-w-0 font-medium cursor-pointer"
                    value={searchLocation}
                    onChange={handleLocationChange}
                  >
                    <option value="all">{t('search.locations.all')}</option>
                    <option value="punjab">{t('search.locations.punjab')}</option>
                    <option value="sindh">{t('search.locations.sindh')}</option>
                    <option value="kpk">{t('search.locations.kpk')}</option>
                    <option value="balochistan">{t('search.locations.balochistan')}</option>
                  </select>
                  {searchLocation !== 'all' && (
                    <select
                      className="border-0 bg-transparent text-gray-800 text-xs md:text-sm focus:outline-none ml-1 md:ml-2 border-l border-gray-300 pl-1 md:pl-2 min-w-0 font-medium cursor-pointer"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                    >
                      <option value="all">{t('search.locations.allCities')}</option>
                      {cityOptions[searchLocation as keyof typeof cityOptions]?.map((city) => (
                        <option key={city} value={city.toLowerCase()}>
                          {city}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hover-glow z-10"
                >
                  <Button
                    type="submit"
                    className="h-12 rounded-none rounded-r-2xl bg-primary hover:bg-primary/90 text-white transition-all duration-200 shadow-md hover:shadow-primary/30 px-6"
                  >
                    <Search className="h-5 w-5" />
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
                    className="absolute top-full left-0 right-0 z-[60] mt-2"
                  >
                    <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/50 overflow-hidden">
                      <SearchSuggestions
                        query={searchQuery}
                        onSelect={handleSuggestionSelect}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>

            {/* Action buttons - mobile and desktop */}
            <motion.div
              variants={slideInRight}
              className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-3 absolute md:static top-full right-4 left-4 md:left-auto md:right-auto bg-white/95 md:bg-transparent p-6 md:p-0 rounded-2xl shadow-2xl md:shadow-none z-50 mobile-menu mt-4 md:mt-0 ring-1 ring-black/5 md:ring-0`}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl">
                    <Grid className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-card border-white/50 bg-white/90">
                  <DropdownMenuItem asChild className="focus:bg-primary/10 cursor-pointer">
                    <Link to="/featured" className="w-full font-semibold text-primary flex items-center gap-2">
                      Featured Listings
                    </Link>
                  </DropdownMenuItem>
                  <div className="border-t border-gray-100 my-1"></div>
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.id} asChild className="focus:bg-primary/5 cursor-pointer">
                      <Link to={`/category/${category.slug}`} className="w-full">
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link to="/favorites">
                  <Button variant="ghost" className="text-foreground/80 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200 relative">
                    <Heart className="h-5 w-5" />
                    {favorites.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center animate-zoom-in">
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
                      <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg hover:shadow-secondary/30 transition-all duration-300 rounded-xl font-semibold">
                        <Plus className="h-4 w-4 mr-2" />
                        {t('common.sell')}
                      </Button>
                    </Link>
                  </motion.div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl">
                        <User className="h-5 w-5 mr-2" />
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 glass-card border-white/50 bg-white/90">
                      <DropdownMenuItem asChild className="focus:bg-primary/10 cursor-pointer">
                        <Link to="/my-listings" className="w-full">
                          {t('common.myListings')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="focus:bg-primary/10 cursor-pointer">
                        <Link to="/messages" className="w-full flex items-center">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          My Messages
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="focus:bg-primary/10 cursor-pointer">
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
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/30 transition-all duration-300 rounded-xl">
                      {t('common.signIn')}
                    </Button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
