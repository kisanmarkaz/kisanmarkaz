import React from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/lib/animations';
import ListingCard from '@/components/ListingCard';
import { Loader2, Heart, ShoppingBag, Share2, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Favorites = () => {
  const { data: favorites = [], isLoading } = useFavorites();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-8 mt-32">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Header Section */}
            <motion.div
              variants={fadeIn}
              className="flex flex-col items-center text-center mb-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-6 shadow-lg"
              >
                <Heart className="w-10 h-10 text-green-600" />
              </motion.div>
              <motion.h1
                variants={fadeIn}
                className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800 mb-4"
              >
                {t('favorites.title')}
              </motion.h1>
              <motion.div
                variants={fadeIn}
                className="flex items-center justify-center gap-2 text-lg text-gray-600"
              >
                <Badge variant="secondary" className="px-3 py-1 text-base bg-green-100 text-green-800">
                  {favorites.length} {favorites.length === 1 ? t('favorites.item') : t('favorites.items')}
                </Badge>
              </motion.div>
            </motion.div>

            {favorites.length === 0 ? (
              <motion.div
                variants={fadeIn}
                className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md mx-auto"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Heart className="w-12 h-12 text-gray-400" />
                </motion.div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t('favorites.emptyTitle')}
                </h2>
                <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                  {t('favorites.empty')}
                </p>
                <Link to="/">
                  <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-green-500/25 transition-all duration-200">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {t('favorites.startBrowsing')}
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <>
                {/* Filters and Sort Section */}
                <motion.div
                  variants={fadeIn}
                  className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4 text-gray-500" />
                      <select className="text-sm border-0 bg-gray-50 rounded-md py-2 px-3 focus:ring-2 focus:ring-green-500 text-gray-700">
                        <option value="date">{t('favorites.sortOptions.date')}</option>
                        <option value="price">{t('favorites.sortOptions.price')}</option>
                        <option value="name">{t('favorites.sortOptions.name')}</option>
                      </select>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-green-700 border-green-200 hover:bg-green-50">
                    <Share2 className="w-4 h-4 mr-2" />
                    {t('favorites.shareList')}
                  </Button>
                </motion.div>

                {/* Grid Section */}
                <motion.div
                  variants={staggerContainer}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {favorites.map((favorite, index) => (
                    <motion.div
                      key={favorite.id}
                      variants={fadeIn}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="transform hover:scale-105 transition-transform duration-200"
                    >
                      <ListingCard listing={favorite.listing} />
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favorites; 