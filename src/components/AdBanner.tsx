import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      // Create and inject the first script
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
      
      // Create and inject the second script
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = '//www.highperformanceformat.com/079a9f013af48f27f600011f61238518/invoke.js';
      
      // Append scripts to the container div
      if (containerRef.current) {
        containerRef.current.appendChild(configScript);
        containerRef.current.appendChild(invokeScript);
      }
    } catch (error) {
      console.error('Error setting up ad:', error);
    }

    return () => {
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