
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Translations, LANGUAGES } from '@/types/translations';
import { englishTranslations } from '@/translations/en';
import { spanishTranslations } from '@/translations/es';

// Context interface
interface LanguageContextType {
  language: Language;
  translations: Translations;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data mapping
const translationData: Record<Language, Translations> = {
  en: englishTranslations,
  es: spanishTranslations,
};

// Initialize LanguageProvider props
interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

// Create the provider component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  defaultLanguage = 'en',
}) => {
  // Try to get saved language from localStorage or use browser's language
  const getBrowserLanguage = (): Language => {
    const browserLang = navigator.language.split('-')[0];
    return (browserLang === 'es' ? 'es' : 'en') as Language;
  };

  const getSavedLanguage = (): Language => {
    const saved = localStorage.getItem('language');
    return (saved === 'es' || saved === 'en' ? saved : getBrowserLanguage()) as Language;
  };

  const [language, setLanguageState] = useState<Language>(getSavedLanguage());
  const [translations, setTranslations] = useState<Translations>(translationData[language]);

  // Update translations when language changes
  useEffect(() => {
    setTranslations(translationData[language]);
    localStorage.setItem('language', language);
  }, [language]);

  // Set language function
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations;
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return typeof result === 'string' ? result : key;
  };

  // Provide the context value
  const value = {
    language,
    translations,
    setLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export { LANGUAGES };

