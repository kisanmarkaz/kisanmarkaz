import React, { useEffect, useState } from 'react';

interface AdBannerProps {
  className?: string;
}

declare global {
  interface Window {
    atOptions: any;
  }
}

const AdBanner: React.FC<AdBannerProps> = ({ className = '' }) => {
  const [adError, setAdError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Create and inject the first script
      const script1 = document.createElement('script');
      script1.type = 'text/javascript';
      script1.text = `
        window.atOptions = {
          'key' : '079a9f013af48f27f600011f61238518',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;
      document.head.appendChild(script1);
      console.log('Adsterra config script loaded');

      // Create and inject the second script
      const script2 = document.createElement('script');
      script2.type = 'text/javascript';
      script2.src = '//www.highperformanceformat.com/079a9f013af48f27f600011f61238518/invoke.js';
      script2.onload = () => {
        console.log('Adsterra invoke script loaded successfully');
      };
      script2.onerror = (error) => {
        console.error('Error loading Adsterra script:', error);
        setAdError('Failed to load ad script');
      };
      document.head.appendChild(script2);

      // Cleanup function to remove scripts when component unmounts
      return () => {
        try {
          document.head.removeChild(script1);
          document.head.removeChild(script2);
        } catch (error) {
          console.error('Error cleaning up ad scripts:', error);
        }
      };
    } catch (error) {
      console.error('Error setting up ad scripts:', error);
      setAdError('Failed to initialize ad');
    }
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <div className={`w-full flex justify-center py-4 bg-white/5 mb-4 ${className}`}>
      <div id="adsterra-banner" className="w-[728px] h-[90px]">
        {adError && (
          <div className="w-full h-full flex items-center justify-center text-red-500 text-sm">
            {adError}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdBanner; 