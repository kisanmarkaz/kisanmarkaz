import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Tractor, Wheat, Beef, Wrench } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { fadeIn, slideUp, staggerContainer, slideInLeft, slideInRight } from '@/lib/animations';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';

const HeroSection = () => {
  const { t } = useLanguage();
  const [categoryIndex, setCategoryIndex] = useState(0);
  const heroRef = useRef(null);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const categories = [
    { name: t('hero.categories.livestock'), icon: Beef },
    { name: t('hero.categories.crops'), icon: Wheat },
    { name: t('hero.categories.equipment'), icon: Tractor },
    { name: t('hero.categories.services'), icon: Wrench }
  ];

  // Rotate through categories
  useEffect(() => {
    const interval = setInterval(() => {
      setCategoryIndex((prevIndex) => (prevIndex + 1) % categories.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [categories.length]);

  return (
    <motion.section
      ref={heroRef}
      initial="visible" // Always visible initially
      animate="visible"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20"
      style={{
        background: 'linear-gradient(135deg, hsl(160, 50%, 98%) 0%, hsl(150, 30%, 95%) 100%)'
      }}
    >
      {/* Abstract Background Elements */}
      <motion.div
        className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-3xl"
        style={{ y: y1 }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] bg-secondary/10 rounded-full blur-3xl"
        style={{ y: y2 }}
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center"
        >
          {/* Main Headline */}
          <motion.div variants={slideUp} className="mb-6 relative">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 animate-pulse-soft">
              #1 Marketplace for Farmers
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none text-foreground">
              <span className="block mb-2">The Future of</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-secondary relative">
                Agriculture
                {/* Underline decoration */}
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-secondary opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
          </motion.div>

          {/* Animated Subtext/Categories */}
          <motion.div variants={slideUp} className="h-16 md:h-20 mb-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-2xl md:text-3xl text-muted-foreground font-light flex items-center gap-3"
              >
                Buy & Sell
                <span className="font-semibold text-primary flex items-center gap-2 bg-white/50 px-4 py-2 rounded-2xl shadow-sm border border-white/60 backdrop-blur-sm">
                  {React.createElement(categories[categoryIndex].icon, { className: "w-6 h-6 md:w-8 md:h-8" })}
                  {categories[categoryIndex].name}
                </span>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.p
            variants={slideUp}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {t('hero.description')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={slideUp}
            className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/search">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 text-lg rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-xl hover:shadow-primary/25 transition-all duration-300"
                >
                  {t('hero.buttons.startBuying')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/sell">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-14 px-8 text-lg rounded-2xl border-2 border-input bg-white/50 hover:bg-white hover:border-primary/50 text-foreground shadow-sm transition-all duration-300"
                >
                  <Plus className="mr-2 h-5 w-5 text-secondary-foreground" />
                  {t('hero.buttons.postAd')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Category Pills - Decorative */}
          <div className="absolute top-1/2 left-0 w-full h-full pointer-events-none -z-10 hidden lg:block opacity-60">
            {categories.map((cat, i) => {
              const xPos = i % 2 === 0 ? '10%' : '85%';
              const yPos = `${20 + (i * 20)}%`;
              return (
                <motion.div
                  key={i}
                  className="absolute glass-card px-4 py-3 flex items-center gap-3 text-sm font-medium text-foreground/80"
                  style={{ left: xPos, top: yPos }}
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5
                  }}
                >
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    {React.createElement(cat.icon, { size: 16 })}
                  </div>
                  {cat.name}
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

// Helper Icon Component
function Plus({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="M12 5v14" /></svg>
  )
}

export default HeroSection;
