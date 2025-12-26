import React from 'react';
import { Link } from 'react-router-dom';
import { Beef, Wheat, Tractor, Home, Truck, Wrench, Droplets, TreePine } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { motion, useInView } from 'framer-motion';
import { staggerContainer, scaleUp } from '@/lib/animations';

const iconMap = {
  'Beef': Beef,
  'Wheat': Wheat,
  'Tractor': Tractor,
  'Home': Home,
  'Truck': Truck,
  'Wrench': Wrench,
  'Droplets': Droplets,
  'TreePine': TreePine
};

const CategoryGrid = () => {
  const { data: categories, isLoading } = useCategories();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-transparent to-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Browse Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/50 rounded-2xl p-6 border border-white/40 animate-pulse h-32">
                <div className="flex items-center h-full gap-4">
                  <div className="w-12 h-12 bg-gray-200/50 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200/50 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200/50 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative overflow-hidden" ref={ref}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Browse Categories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Explore our wide range of agricultural categories and find exactly what you need.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories?.map((category, index) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Droplets;
            return (
              <motion.div
                key={category.id}
                variants={scaleUp}
                custom={index}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Link
                  to={`/category/${category.slug}`}
                  className="group block h-full glass-card bg-white/60 hover:bg-white/90 border-white/50 p-6 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500" />

                  <div className="relative flex items-center gap-5">
                    <motion.div
                      className="bg-white p-3.5 rounded-2xl shadow-sm group-hover:shadow-md transition-all duration-300 ring-1 ring-black/5"
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    >
                      <IconComponent className="h-7 w-7 text-primary group-hover:text-secondary transition-colors duration-300" />
                    </motion.div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200 flex items-center gap-2">
                        {category.name}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary text-sm transform translate-x-1 group-hover:translate-x-0 duration-300">→</span>
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 font-medium">
                        {category.subcategories?.length || 0} subcategories
                      </p>
                    </div>
                  </div>

                  {category.description && (
                    <p className="mt-4 text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      {category.description}
                    </p>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryGrid;
