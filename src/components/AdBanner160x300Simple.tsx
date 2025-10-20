import React from 'react';

interface AdBanner160x300SimpleProps {
  className?: string;
  sticky?: boolean;
}

const AdBanner160x300Simple: React.FC<AdBanner160x300SimpleProps> = ({ className = '', sticky = false }) => {
  return (
    <div 
      className={`${sticky ? 'sticky top-24' : ''} ${className}`}
      style={{ width: '160px', minHeight: '300px' }}
    >
      <div 
        className="bg-gray-50 border-2 border-green-500 rounded-lg p-2"
        style={{ width: '160px', minHeight: '300px' }}
      >
        {/* Ad Configuration Script */}
        <script 
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              atOptions = {
                'key' : 'db847b37b281d539aeebd50df2cd2f1a',
                'format' : 'iframe',
                'height' : 300,
                'width' : 160,
                'params' : {}
              };
            `
          }}
        />
        {/* Ad Invoke Script */}
        <script 
          type="text/javascript" 
          src="//www.highperformanceformat.com/db847b37b281d539aeebd50df2cd2f1a/invoke.js"
        />
      </div>
    </div>
  );
};

export default AdBanner160x300Simple;
