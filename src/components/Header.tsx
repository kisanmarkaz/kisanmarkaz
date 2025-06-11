import React, { useState, useEffect } from 'react';
import { Search, MapPin, User, Plus, Menu, Heart, MessageCircle, Settings, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/hooks/useSearch';
import SearchSuggestions from './SearchSuggestions';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, slideInLeft, slideInRight, slideUp } from '@/lib/animations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { searchQuery, setSearchQuery, searchLocation, setSearchLocation, handleSearch } = useSearch();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();

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
          className="flex items-center justify-between py-2 text-sm border-b border-green-500"
        >
          <motion.div
            variants={slideInLeft}
            className="flex items-center space-x-4"
          >
            <motion.span
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <MapPin className="h-4 w-4 mr-1" />
              {t('common.country')}
            </motion.span>
          </motion.div>
          <motion.div
            variants={slideInRight}
            className="flex items-center space-x-4"
          >
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link to="/chat" className="flex items-center hover:text-green-200 transition-colors duration-200">
                <MessageCircle className="h-4 w-4 mr-1" />
                {t('common.chat')}
              </Link>
            </motion.div>
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
                <Link to="/login" className="flex items-center hover:text-green-200 transition-colors duration-200">
                  <User className="h-4 w-4 mr-1" />
                  {t('common.login')}
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="text-2xl font-bold text-white">
              {t('common.appName')}
            </Link>
          </motion.div>

          {/* Search bar */}
          <motion.form
            variants={fadeIn}
            onSubmit={handleSubmit}
            className="flex-1 max-w-2xl mx-8 relative"
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
                  onChange={(e) => setSearchLocation(e.target.value)}
                >
                  <option value="all" className="text-gray-800">{t('search.locations.all')}</option>
                  <option value="Punjab" className="text-gray-800">{t('search.locations.punjab')}</option>
                  <option value="Sindh" className="text-gray-800">{t('search.locations.sindh')}</option>
                  <option value="KPK" className="text-gray-800">{t('search.locations.kpk')}</option>
                  <option value="Balochistan" className="text-gray-800">{t('search.locations.balochistan')}</option>
                </select>
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

          {/* Action buttons */}
          <motion.div
            variants={slideInRight}
            className="flex items-center space-x-4"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link to="/favorites">
                <Button variant="ghost" className="text-white hover:text-green-200 transition-colors duration-200">
                  <Heart className="h-5 w-5" />
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
