'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Language, Translations } from '@/types';
import translations from '@/data/translations.json';

export const useLanguage = () => {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize language from localStorage
  useEffect(() => {
    const savedLang = (localStorage.getItem('lang') as Language) || 'en';
    setCurrentLang(savedLang);
    document.documentElement.lang = savedLang;
    setIsLoaded(true);

    // Listen for language changes on other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lang') {
        const newLang = (e.newValue as Language) || 'en';
        setCurrentLang(newLang);
        document.documentElement.lang = newLang;
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const switchLanguage = useCallback((lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    window.dispatchEvent(new StorageEvent('storage', { key: 'lang', newValue: lang }));
  }, []);

  const translate = useCallback(
    (key: string, defaultValue?: string): string => {
      const keys = key.split('.');
      let value: any = translations[currentLang];

      for (const k of keys) {
        value = value?.[k];
      }

      return typeof value === 'string' ? value : defaultValue || key;
    },
    [currentLang]
  );

  const t = useCallback(
    (key: string, defaultValue?: string) => translate(key, defaultValue),
    [translate]
  );

  return {
    currentLang,
    switchLanguage,
    translate: t,
    isLoaded,
  };
};
