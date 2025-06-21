import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
  variant?: 'large' | 'medium';
}

const AD_CONFIGS = {
  large: {
    key: '079a9f013af48f27f600011f61238518',
    width: 728,
    height: 90,
  },
  medium: {
    key: '34d1fef9c9edac7ad3838cd3262efda0',
    width: 468,
    height: 60,
  },
};

const AdBanner: React.FC<AdBannerProps> = ({ className = '', variant = 'large' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const config = AD_CONFIGS[variant];

  useEffect(() => {
    try {
      // Create and inject the first script
      const configScript = document.createElement('script');
      configScript.type = 'text/javascript';
      configScript.innerHTML = `
        atOptions = {
          'key' : '${config.key}',
          'format' : 'iframe',
          'height' : ${config.height},
          'width' : ${config.width},
          'params' : {}
        };
      `;
      
      // Create and inject the second script
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `//www.highperformanceformat.com/${config.key}/invoke.js`;
      
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
  }, [config]);

  return (
    <div className={`w-full flex justify-center py-4 bg-white/5 mb-4 ${className}`}>
      <div 
        ref={containerRef}
        className={`w-[${config.width}px] h-[${config.height}px]`}
      />
    </div>
  );
};

export default AdBanner; 