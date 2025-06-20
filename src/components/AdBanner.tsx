import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('AdBanner: Starting to inject scripts...');

    try {
      // First, create a container div for the ad
      const adContainer = document.createElement('div');
      
      // Create the first script element
      const configScript = document.createElement('script');
      configScript.type = 'text/javascript';
      configScript.innerHTML = `
        atOptions = {
          'key' : '079a9f013af48f27f600011f61238518',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;
      
      // Create the second script element
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = '//www.highperformanceformat.com/079a9f013af48f27f600011f61238518/invoke.js';
      
      // Add event listeners for debugging
      invokeScript.onload = () => console.log('AdBanner: Invoke script loaded successfully');
      invokeScript.onerror = (error) => console.error('AdBanner: Error loading invoke script:', error);
      
      // Append scripts to the container div
      if (containerRef.current) {
        console.log('AdBanner: Container found, injecting scripts...');
        containerRef.current.appendChild(configScript);
        containerRef.current.appendChild(invokeScript);
      } else {
        console.error('AdBanner: Container ref not found');
      }
    } catch (error) {
      console.error('AdBanner: Error setting up ad:', error);
    }

    return () => {
      console.log('AdBanner: Cleaning up...');
      if (containerRef.current) {
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
      }
    };
  }, []);

  return (
    <div className={`w-full flex justify-center py-4 bg-white/5 mb-4 ${className}`}>
      <div 
        ref={containerRef}
        className="w-[728px] h-[90px]"
      />
    </div>
  );
};

export default AdBanner; 