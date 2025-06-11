import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CursorToggleProps {
  className?: string;
}

const CursorToggle: React.FC<CursorToggleProps> = ({ className = '' }) => {
  // Get initial state from localStorage or default to true
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('customCursorEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Update body class and localStorage when toggle changes
  useEffect(() => {
    if (isEnabled) {
      document.body.classList.add('custom-cursor-active');
    } else {
      document.body.classList.remove('custom-cursor-active');
    }
    
    localStorage.setItem('customCursorEnabled', JSON.stringify(isEnabled));
  }, [isEnabled]);

  return (
    <motion.div 
      className={`flex items-center space-x-2 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Switch 
        id="cursor-mode" 
        checked={isEnabled}
        onCheckedChange={setIsEnabled}
        className="data-[state=checked]:bg-green-500"
      />
      <Label 
        htmlFor="cursor-mode" 
        className="text-sm cursor-pointer hover:text-white transition-colors duration-300"
      >
        {isEnabled ? (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center"
          >
            Custom Cursor: <span className="text-green-400 ml-1 font-semibold">On</span>
          </motion.span>
        ) : (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center"
          >
            Custom Cursor: <span className="text-gray-400 ml-1 font-semibold">Off</span>
          </motion.span>
        )}
      </Label>
    </motion.div>
  );
};

export default CursorToggle;