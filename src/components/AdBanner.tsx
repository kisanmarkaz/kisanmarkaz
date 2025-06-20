import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
  size: '728x90' | '468x60' | '160x300' | '320x50' | '300x250' | '160x600';
  adKey: string;
}

const AD_SIZES = {
  '728x90': { width: 728, height: 90 },
  '468x60': { width: 468, height: 60 },
  '160x300': { width: 160, height: 300 },
  '320x50': { width: 320, height: 50 },
  '300x250': { width: 300, height: 250 },
  '160x600': { width: 160, height: 600 },
} as const;

const AdBanner: React.FC<AdBannerProps> = ({ className = '', size, adKey }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = AD_SIZES[size];

  useEffect(() => {
    console.log(`AdBanner ${size}: Starting to inject scripts...`);

    try {
      // Create the first script element
      const configScript = document.createElement('script');
      configScript.type = 'text/javascript';
      configScript.innerHTML = `
        atOptions = {
          'key' : '${adKey}',
          'format' : 'iframe',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      `;
      
      // Create the second script element
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
      
      // Add event listeners for debugging
      invokeScript.onload = () => console.log(`AdBanner ${size}: Invoke script loaded successfully`);
      invokeScript.onerror = (error) => console.error(`AdBanner ${size}: Error loading invoke script:`, error);
      
      // Append scripts to the container div
      if (containerRef.current) {
        console.log(`AdBanner ${size}: Container found, injecting scripts...`);
        containerRef.current.appendChild(configScript);
        containerRef.current.appendChild(invokeScript);
      } else {
        console.error(`AdBanner ${size}: Container ref not found`);
      }
    } catch (error) {
      console.error(`AdBanner ${size}: Error setting up ad:`, error);
    }

    return () => {
      console.log(`AdBanner ${size}: Cleaning up...`);
      if (containerRef.current) {
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
      }
    };
  }, [size, adKey, width, height]);

  return (
    <div className={`w-full flex justify-center py-4 bg-white/5 mb-4 ${className}`}>
      <div 
        ref={containerRef}
        className={`w-[${width}px] h-[${height}px]`}
        style={{ width: width, height: height }}
      />
    </div>
  );
};

export default AdBanner; 