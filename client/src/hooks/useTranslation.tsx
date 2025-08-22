import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxFiles/store';
import { translations, TranslationKeys, Language } from '../translations';
import moment from 'moment';
import 'moment/locale/es';
import 'moment/locale/fr';

interface TranslationContextType {
  t: TranslationKeys;
  language: Language;
  formatDate: (date: moment.MomentInput, format?: string) => string;
  formatRelativeTime: (date: moment.MomentInput) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const language = useSelector((state: RootState) => state.preferencesReducer.language) as Language;
  const [currentTranslations, setCurrentTranslations] = useState<TranslationKeys>(translations[language]);

  useEffect(() => {
    setCurrentTranslations(translations[language]);
    
    // Set moment locale based on selected language
    switch (language) {
      case 'es':
        moment.locale('es');
        break;
      case 'fr':
        moment.locale('fr');
        break;
      case 'en':
      default:
        moment.locale('en');
        break;
    }
  }, [language]);

  const formatDate = (date: moment.MomentInput, format?: string) => {
    return moment(date).format(format);
  };

  const formatRelativeTime = (date: moment.MomentInput) => {
    return moment(date).fromNow();
  };

  const value = {
    t: currentTranslations,
    language,
    formatDate,
    formatRelativeTime,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

// Helper function to get nested translation values
export const getTranslation = (translations: any, path: string): string => {
  const keys = path.split('.');
  let value = translations;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path; // Return the path if translation not found
    }
  }
  
  return typeof value === 'string' ? value : path;
};