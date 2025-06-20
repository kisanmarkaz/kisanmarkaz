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
  const [isLoading, setIsLoading] = useState(true);
  const [adError, setAdError] = useState<string | null>(null);

  useEffect(() => {
    const loadAd = async () => {
      try {
        // Remove any existing ad scripts first
        const existingScripts = document.querySelectorAll('script[data-adsterra]');
        existingScripts.forEach(script => script.remove());

        // Create and inject the first script
        const script1 = document.createElement('script');
        script1.type = 'text/javascript';
        script1.setAttribute('data-adsterra', 'config');
        script1.text = `
          window.atOptions = {
            'key' : '079a9f013af48f27f600011f61238518',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        `;
        document.body.appendChild(script1);

        // Create and inject the second script
        const script2 = document.createElement('script');
        script2.type = 'text/javascript';
        script2.setAttribute('data-adsterra', 'invoke');
        script2.src = 'https://www.highperformanceformat.com/079a9f013af48f27f600011f61238518/invoke.js';
        
        // Create a promise to handle script loading
        await new Promise((resolve, reject) => {
          script2.onload = resolve;
          script2.onerror = reject;
          document.body.appendChild(script2);
        });

        setIsLoading(false);
        console.log('Adsterra scripts loaded successfully');
      } catch (error) {
        console.error('Error loading Adsterra scripts:', error);
        setAdError('Ad failed to load. Please disable ad blocker if enabled.');
        setIsLoading(false);
      }
    };

    loadAd();

    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll('script[data-adsterra]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  return (
    <div className={`w-full flex justify-center py-4 bg-white/5 mb-4 ${className}`}>
      <div id="adsterra-banner" className="w-[728px] h-[90px] relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-sm text-gray-500">Loading ad...</span>
          </div>
        )}
        {adError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-sm text-red-500">{adError}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdBanner; 