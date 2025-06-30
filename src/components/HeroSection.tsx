import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Tractor, Wheat, Beef } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { fadeIn, slideUp, staggerContainer, slideInLeft, slideInRight } from '@/lib/animations';
import { Search } from '@/components/Search';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';

const HeroSection = () => {
  const { t } = useLanguage();
  const [categoryIndex, setCategoryIndex] = useState(0);
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: false, amount: 0.1 });
  
  const categories = [
    { name: t('hero.categories.livestock'), icon: Beef },
    { name: t('hero.categories.crops'), icon: Wheat },
    { name: t('hero.categories.equipment'), icon: Tractor }
  ];

  // Rotate through categories more quickly
  useEffect(() => {
    const interval = setInterval(() => {
      setCategoryIndex((prevIndex) => (prevIndex + 1) % categories.length);
    }, 2000); // Reduced from 3000ms to 2000ms for faster rotation
    return () => clearInterval(interval);
  }, [categories.length]);

  // Enhanced parallax scroll effect
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.section 
      ref={heroRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeIn}
      className="bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 text-white py-24 mt-16 relative overflow-hidden backdrop-blur-sm"
    >
      {/* Background animated shapes with parallax effect */}
      <motion.div 
        className="absolute top-0 left-0 w-64 h-64 bg-emerald-400 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2 blur-2xl"
        animate={{ 
          scale: [1, 1.2, 1],
          x: ['-50%', '-40%', '-50%'],
          y: ['-50%', '-40%', '-50%'],
          translateY: scrollY * 0.2,
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400 rounded-full opacity-20 translate-x-1/2 translate-y-1/2 blur-2xl"
        animate={{ 
          scale: [1, 1.3, 1],
          x: ['50%', '40%', '50%'],
          y: ['50%', '40%', '50%'],
          translateY: scrollY * -0.1,
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />

      {/* Decorative pattern overlay with parallax effect */}
      <motion.div 
        className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"
        style={{
          y: scrollY * 0.05
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <ScrollReveal variant="slideUp" threshold={0.2}>
            <motion.h1 
              variants={slideUp}
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-100"
            >
              <span className="block text-7xl mb-2">KisanMarkaz</span>
              <div className="flex items-center justify-center">
                <span className="inline-block">Pakistan's #1</span>{" "}
                <div className="inline-block h-20 overflow-hidden relative flex items-center" style={{ minWidth: "350px", transform: "translateY(2px)" }}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={categoryIndex}
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -40, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="text-yellow-300 font-bold absolute left-0 right-0 flex items-center justify-start pl-3"
                      style={{ transform: "translateY(-1px)" }}
                    >
                      {categories[categoryIndex].name}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.h1>
          </ScrollReveal>
          
          <ScrollReveal variant="fadeIn" delay={0.2} threshold={0.2}>
            <motion.p 
              variants={slideUp}
              className="text-xl mb-10 text-emerald-100"
            >
              {t('hero.description')}
            </motion.p>
          </ScrollReveal>
          
          <motion.div 
            variants={staggerContainer}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            {categories.map((category, index) => {
              const Icon = category.icon;
              const isActive = index === categoryIndex;
              
              return (
                <ScrollReveal 
                  key={category.name} 
                  variant={index === 0 ? "slideInLeft" : index === 1 ? "slideUp" : "slideInRight"}
                  delay={0.1 * index}
                  threshold={0.2}
                >
                  <motion.div 
                    variants={index === 0 ? slideInLeft : index === 1 ? slideUp : slideInRight}
                    whileHover={{ scale: 1.1, y: -5 }}
                    animate={isActive ? { 
                      scale: [1, 1.08, 1],
                      boxShadow: ["0 4px 6px rgba(0,0,0,0.1)", "0 10px 15px rgba(0,0,0,0.2)", "0 4px 6px rgba(0,0,0,0.1)"]
                    } : {}}
                    transition={isActive ? { duration: 1, repeat: Infinity } : {}}
                    className={`flex items-center text-white backdrop-blur-md ${isActive ? 'bg-white/30' : 'bg-white/10'} px-5 py-3 rounded-full shadow-lg hover:shadow-xl border ${isActive ? 'border-yellow-300/50' : 'border-white/20'} hover:border-white/40 transition-all duration-200`}
                  >
                    <motion.div
                      animate={{ rotate: [0, index % 2 === 0 ? 10 : -10, 0] }}
                      transition={{ repeat: Infinity, duration: 3, delay: index * 0.3 }}
                    >
                      <Icon className={`h-8 w-8 mr-2 ${isActive ? 'text-yellow-300 animate-pulse' : 'text-yellow-300 animate-pulse-slow'}`} />
                    </motion.div>
                    <span>{category.name}</span>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </motion.div>

          <ScrollReveal variant="slideUp" delay={0.3} threshold={0.2}>
            <motion.div 
              variants={slideUp}
              className="flex flex-wrap justify-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/search">
                  <Button 
                    size="lg" 
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold shadow-lg hover:shadow-yellow-500/50 transition-all duration-300"
                  >
                    {t('hero.buttons.startBuying')}
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.div>
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/sell">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-white/10 backdrop-blur-md border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-gray-900 shadow-lg hover:shadow-yellow-500/30 transition-all duration-300"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {t('hero.buttons.postAd')}
                    </motion.span>
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal variant="fadeIn" delay={0.4} threshold={0.2}>
            <div className="mt-8">
              <Search />
            </div>
          </ScrollReveal>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
