import React from 'react';
import Header from './Header';
import Footer from './Footer';
import AdBanner from './AdBanner';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 pt-[120px]">
        <AdBanner variant="large" className="mb-8" />
        <main>
          {children}
        </main>
      </div>
      <AdBanner variant="large" className="mt-8" />
      <Footer />
    </div>
  );
};

export default Layout; 