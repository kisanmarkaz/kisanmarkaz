import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Define city options for each province
const cityOptions = {
  punjab: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot'],
  sindh: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Mirpur Khas'],
  kpk: ['Peshawar', 'Mardan', 'Abbottabad', 'Mingora', 'Kohat'],
  balochistan: ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Chaman'],
};

export const Search: React.FC = () => {
  const { t } = useLanguage();
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedCity('all'); // Reset city when province changes
  };

  return (
    <motion.div 
      className="flex flex-col sm:flex-row gap-2 glass p-1 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={t('search.placeholder')}
          className="w-full pl-10 glass-input bg-white/30 text-white placeholder-white/70 border-white/20"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <SearchIcon className="h-4 w-4 text-white/70" />
        </div>
      </div>
      
      <Select value={selectedProvince} onValueChange={handleProvinceChange}>
        <SelectTrigger className="w-full sm:w-[200px] glass-input bg-white/30 text-white border-white/20">
          <SelectValue placeholder={t('search.locations.all')} />
        </SelectTrigger>
        <SelectContent className="glass-card bg-white/90 backdrop-blur-md">
          <SelectItem value="all">{t('search.locations.all')}</SelectItem>
          <SelectItem value="punjab">{t('search.locations.punjab')}</SelectItem>
          <SelectItem value="sindh">{t('search.locations.sindh')}</SelectItem>
          <SelectItem value="kpk">{t('search.locations.kpk')}</SelectItem>
          <SelectItem value="balochistan">{t('search.locations.balochistan')}</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={selectedCity} 
        onValueChange={setSelectedCity}
        disabled={selectedProvince === 'all'}
      >
        <SelectTrigger className="w-full sm:w-[200px] glass-input bg-white/30 text-white border-white/20">
          <SelectValue placeholder={t('search.locations.selectCity')} />
        </SelectTrigger>
        <SelectContent className="glass-card bg-white/90 backdrop-blur-md">
          <SelectItem value="all">{t('search.locations.allCities')}</SelectItem>
          {selectedProvince !== 'all' && cityOptions[selectedProvince as keyof typeof cityOptions].map((city) => (
            <SelectItem key={city} value={city.toLowerCase()}>{city}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button 
          type="submit" 
          className="glass-button bg-white/20 text-white hover:bg-white/30 border border-white/30 hover-glow"
        >
          <motion.div
            animate={{ rotate: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <SearchIcon className="h-4 w-4" />
          </motion.div>
        </Button>
      </motion.div>
    </motion.div>
  );
}; 