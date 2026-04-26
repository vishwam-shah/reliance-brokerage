'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Language, Translations } from '@/types';
import translations from '@/data/translations.json';
import { setLanguage as setGoogleLanguage, getCurrentLanguage as getGoogleLanguage } from '@/lib/translate';

export const useLanguage = () => {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize: prefer Google Translate cookie state, fall back to localStorage
  useEffect(() => {
    const googleLang = getGoogleLanguage();
    const savedLang = (localStorage.getItem('rb_lang') as Language) || (localStorage.getItem('lang') as Language) || googleLang || 'en';
    setCurrentLang(savedLang);
    document.documentElement.lang = savedLang === 'zh' ? 'zh-CN' : 'en';
    setIsLoaded(true);
  }, []);

  // Switching language: drives Google Translate via cookie + reload
  const switchLanguage = useCallback((lang: Language) => {
    localStorage.setItem('lang', lang);
    setGoogleLanguage(lang);
    // setGoogleLanguage triggers window.location.reload()
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
