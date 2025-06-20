import React, { useEffect } from 'react';

interface AdBannerProps {
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ className = '' }) => {
  useEffect(() => {
    // Create and inject the first script
    const script1 = document.createElement('script');
    script1.type = 'text/javascript';
    script1.text = `
      atOptions = {
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
    script2.src = '//www.highperformanceformat.com/079a9f013af48f27f600011f61238518/invoke.js';
    document.body.appendChild(script2);

    // Cleanup function
    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  return (
    <div className={`w-full flex justify-center py-4 bg-white/5 mb-4 ${className}`}>
      <div id="adsterra-banner" className="w-[728px] h-[90px]" />
    </div>
  );
};

export default AdBanner; 