"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    chat: "Chat",
    evm: "EVM Practice",
    booth: "Booth Locator",
    timeline: "Timeline",
    factcheck: "Fact Check",
    login: "Login with Google",
    logout: "Logout",
  },
  hi: {
    chat: "चैट",
    evm: "ईवीएम अभ्यास",
    booth: "बूथ लोकेटर",
    timeline: "समय रेखा",
    factcheck: "तथ्य जांच",
    login: "गूगल के साथ लॉगिन करें",
    logout: "लॉगआउट",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bb_language") as Language;
      if (saved && translations[saved]) {
        setLanguage(saved);
      }
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("bb_language", lang);
    }
  };

  const t = (key: string) => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};
