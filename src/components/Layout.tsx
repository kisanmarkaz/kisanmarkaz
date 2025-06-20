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
        {/* Top Leaderboard Banner */}
        <AdBanner 
          size="728x90"
          adKey="079a9f013af48f27f600011f61238518"
        />
        
        {/* Secondary Banner */}
        <AdBanner 
          size="468x60"
          adKey="34d1fef9c9edac7ad3838cd3262efda0"
          className="mt-4"
        />
        
        <div className="flex">
          {/* Left Sidebar Banner */}
          <div className="hidden lg:block">
            <AdBanner 
              size="160x600"
              adKey="YOUR_160x600_AD_KEY"
              className="sticky top-[120px]"
            />
          </div>

          {/* Main Content */}
          <main className="flex-1 px-4">
            {/* Rectangle Banner above content */}
            <AdBanner 
              size="300x250"
              adKey="YOUR_300x250_AD_KEY"
              className="mb-6 mx-auto"
            />
            
            {children}
            
            {/* Rectangle Banner below content */}
            <AdBanner 
              size="300x250"
              adKey="YOUR_300x250_AD_KEY_2"
              className="mt-6 mx-auto"
            />
          </main>

          {/* Right Sidebar Banner */}
          <div className="hidden lg:block">
            <AdBanner 
              size="160x600"
              adKey="YOUR_160x600_AD_KEY_2"
              className="sticky top-[120px]"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout; 