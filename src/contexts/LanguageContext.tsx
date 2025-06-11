import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const loadTranslations = async (lang: Language) => {
  try {
    const module = await fetch(`/src/locales/${lang}.json`);
    return await module.json();
  } catch (error) {
    console.error('Error loading translations:', error);
    return {};
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const { updatePreferences } = useAuth();

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem('language') as Language;
    console.log('Saved language from localStorage:', savedLang);
    if (savedLang && (savedLang === 'en' || savedLang === 'ur')) {
      setLanguageState(savedLang);
      loadTranslations(savedLang).then(setTranslations);
    } else {
      loadTranslations('en').then(setTranslations);
    }
  }, []);

  const setLanguage = async (lang: Language) => {
    try {
      console.log('Setting language to:', lang);
      await updatePreferences({ language: lang });
      const newTranslations = await loadTranslations(lang);
      setTranslations(newTranslations);
      setLanguageState(lang);
      localStorage.setItem('language', lang);
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (!value) break;
    }
    
    console.log('Translation lookup:', { key, value, translations });
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 