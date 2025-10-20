import React, { useEffect, useRef } from 'react';

interface AdBanner160x300Props {
  className?: string;
  sticky?: boolean;
}

const AdBanner160x300: React.FC<AdBanner160x300Props> = ({ className = '', sticky = false }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const scriptIdRef = useRef<string>(`ad-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const container = adContainerRef.current;
    if (!container) return;

    const scriptId = scriptIdRef.current;

    // Set global atOptions before loading the script
    (window as any).atOptions = {
      'key': 'db847b37b281d539aeebd50df2cd2f1a',
      'format': 'iframe',
      'height': 300,
      'width': 160,
      'params': {}
    };

    // Create the invoke script
    const invokeScript = document.createElement('script');
    invokeScript.id = scriptId;
    invokeScript.type = 'text/javascript';
    invokeScript.src = '//www.highperformanceformat.com/db847b37b281d539aeebd50df2cd2f1a/invoke.js';
    invokeScript.async = true;

    // Append script to container
    container.appendChild(invokeScript);

    // Cleanup function
    return () => {
      const scriptElement = document.getElementById(scriptId);
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, []);

  return (
    <div 
      className={`${sticky ? 'sticky top-24' : ''} ${className}`}
      style={{ width: '160px', minHeight: '300px' }}
    >
      <div 
        ref={adContainerRef}
        className="bg-gray-50 border border-gray-200 rounded-lg p-2"
        style={{ width: '160px', minHeight: '300px' }}
      />
    </div>
  );
};

export default AdBanner160x300;
