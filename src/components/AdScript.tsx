import React, { useEffect, useRef } from 'react';

const AdScript = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing ad containers and scripts
    containerRef.current.innerHTML = '';

    // Create container div for the ad
    const adContainer = document.createElement('div');
    adContainer.id = '_34d1fef9c9edac7ad3838cd3262efda0';
    containerRef.current.appendChild(adContainer);

    // Create the first script element for options
    const atOptionsScript = document.createElement('script');
    atOptionsScript.type = 'text/javascript';
    atOptionsScript.text = `
      atOptions = {
        'key' : '34d1fef9c9edac7ad3838cd3262efda0',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    `;
    containerRef.current.appendChild(atOptionsScript);

    // Create the second script element for the ad
    const adScript = document.createElement('script');
    adScript.type = 'text/javascript';
    adScript.async = true;
    adScript.src = '//www.highperformanceformat.com/34d1fef9c9edac7ad3838cd3262efda0/invoke.js';
    containerRef.current.appendChild(adScript);

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <div className="w-full flex justify-center my-6">
      <div ref={containerRef} className="w-[468px] h-[60px]" />
    </div>
  );
};

export default AdScript; 