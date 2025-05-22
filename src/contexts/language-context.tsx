// src/contexts/language-context.tsx
"use client";
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import en from '@/locales/en.json';
import es from '@/locales/es.json';

type Language = "en" | "es";
export type Translations = typeof en; // Assuming 'en' has all keys, or define a shared type

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Translations;
  t: (key: keyof Translations, subKey?: keyof Translations[keyof Translations] ) => string;
}

const translationsMap = { en, es };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es"); // Default to Spanish

  useEffect(() => {
    const storedLang = localStorage.getItem("physio-insights-lang") as Language | null;
    if (storedLang && (storedLang === "en" || storedLang === "es")) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    if (translationsMap[lang]) {
      localStorage.setItem("physio-insights-lang", lang);
      setLanguageState(lang);
    }
  };

  const currentTranslations = translationsMap[language] || translationsMap.es;

  const t = (key: keyof Translations, subKey?: keyof Translations[keyof Translations]): string => {
    const mainTranslation = currentTranslations[key];
    if (subKey && typeof mainTranslation === 'object' && mainTranslation !== null) {
      return (mainTranslation as any)[subKey] || `${String(key)}.${String(subKey)}`;
    }
    if (typeof mainTranslation === 'string') {
      return mainTranslation;
    }
    return String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations: currentTranslations, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
