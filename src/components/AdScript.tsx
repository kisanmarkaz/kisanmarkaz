import React, { useEffect } from 'react';

const AdScript = () => {
  useEffect(() => {
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
    document.body.appendChild(atOptionsScript);

    // Create the second script element for the ad
    const adScript = document.createElement('script');
    adScript.type = 'text/javascript';
    adScript.src = '//www.highperformanceformat.com/34d1fef9c9edac7ad3838cd3262efda0/invoke.js';
    document.body.appendChild(adScript);

    // Cleanup function to remove scripts when component unmounts
    return () => {
      document.body.removeChild(atOptionsScript);
      document.body.removeChild(adScript);
    };
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <div className="w-full flex justify-center my-6">
      <div id="ad-container"></div>
    </div>
  );
};

export default AdScript; 