import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Tractor, Wheat, Beef } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { fadeIn, slideUp, staggerContainer, slideInLeft, slideInRight } from '@/lib/animations';
import { Search } from '@/components/Search';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="bg-gradient-to-r from-green-700 to-green-600 text-white py-24 mt-16 relative overflow-hidden backdrop-blur-sm"
    >
      {/* Background animated shapes */}
      <motion.div 
        className="absolute top-0 left-0 w-64 h-64 bg-green-500 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"
        animate={{ 
          scale: [1, 1.2, 1],
          x: ['-50%', '-40%', '-50%'],
          y: ['-50%', '-40%', '-50%'],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400 rounded-full opacity-10 translate-x-1/2 translate-y-1/2"
        animate={{ 
          scale: [1, 1.3, 1],
          x: ['50%', '40%', '50%'],
          y: ['50%', '40%', '50%'],
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1 
            variants={slideUp}
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p 
            variants={slideUp}
            className="text-xl mb-10 text-green-100"
          >
            {t('hero.description')}
          </motion.p>
          
          <motion.div 
            variants={staggerContainer}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            <motion.div 
              variants={slideInLeft}
              whileHover={{ scale: 1.1, y: -5 }}
              className="flex items-center text-green-100 glass px-5 py-3 rounded-full shadow-lg hover:shadow-xl border border-white/20 hover-glow"
            >
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <Beef className="h-8 w-8 mr-2 text-yellow-300 animate-pulse-slow" />
              </motion.div>
              <span>{t('hero.categories.livestock')}</span>
            </motion.div>
            <motion.div 
              variants={slideUp}
              whileHover={{ scale: 1.1, y: -5 }}
              className="flex items-center text-green-100 glass px-5 py-3 rounded-full shadow-lg hover:shadow-xl border border-white/20 hover-glow"
            >
              <motion.div
                animate={{ rotate: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 0.3 }}
              >
                <Wheat className="h-8 w-8 mr-2 text-yellow-300 animate-pulse-slow" />
              </motion.div>
              <span>{t('hero.categories.crops')}</span>
            </motion.div>
            <motion.div 
              variants={slideInRight}
              whileHover={{ scale: 1.1, y: -5 }}
              className="flex items-center text-green-100 glass px-5 py-3 rounded-full shadow-lg hover:shadow-xl border border-white/20 hover-glow"
            >
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 0.6 }}
              >
                <Tractor className="h-8 w-8 mr-2 text-yellow-300 animate-pulse-slow" />
              </motion.div>
              <span>{t('hero.categories.equipment')}</span>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={slideUp}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="glass-button bg-yellow-500/90 hover:bg-yellow-500 text-gray-900 font-semibold shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 border border-yellow-400/50"
              >
                {t('hero.buttons.startBuying')}
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="glass-button border-white/70 text-white hover:bg-white/20 shadow-lg hover:shadow-white/30 transition-all duration-300"
              >
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {t('hero.buttons.postAd')}
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>

          <div className="mt-8">
            <Search />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
