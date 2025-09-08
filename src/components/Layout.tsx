import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from './Header';
import Footer from './Footer';
import AdBanner from './AdBanner';
import ScrollReveal from './ScrollReveal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

  React.useEffect(() => {
    const prefersDark = (user?.user_metadata as any)?.preferences?.darkMode === true;
    const root = document.documentElement;
    if (prefersDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [user?.id, user?.user_metadata]);

  // Function to recursively wrap direct children with ScrollReveal
  const wrapChildrenWithScrollReveal = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child, index) => {
      // Skip if child is not a valid element
      if (!React.isValidElement(child)) return child;
      
      // Determine animation variant based on index pattern for visual variety
      let variant: 'fadeIn' | 'slideUp' | 'slideInLeft' | 'slideInRight' = 'slideUp';
      if (index % 4 === 0) variant = 'fadeIn';
      else if (index % 4 === 1) variant = 'slideUp';
      else if (index % 4 === 2) variant = 'slideInLeft';
      else if (index % 4 === 3) variant = 'slideInRight';
      
      // Calculate staggered delay
      const delay = 0.1 + (index * 0.05);
      
      // If the child has children, recursively wrap them too
      if (child.props && child.props.children) {
        return (
          <ScrollReveal key={index} variant={variant} delay={delay} threshold={0.15}>
            {React.cloneElement(child, {
              ...child.props,
              children: wrapChildrenWithScrollReveal(child.props.children)
            })}
          </ScrollReveal>
        );
      }
      
      // Wrap the child with ScrollReveal
      return (
        <ScrollReveal key={index} variant={variant} delay={delay} threshold={0.15}>
          {child}
        </ScrollReveal>
      );
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 pt-[120px]">
        <main>
          {children}
        </main>
      </div>
      <ScrollReveal variant="fadeIn">
        <AdBanner variant="large" className="mt-8" />
      </ScrollReveal>
      <ScrollReveal variant="slideUp">
        <Footer />
      </ScrollReveal>
    </div>
  );
};

export default Layout;