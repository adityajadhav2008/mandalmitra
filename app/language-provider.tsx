"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type Language =
  | "English"
  | "Marathi"
  | "Hindi";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext =
  createContext<LanguageContextType | null>(null);

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguageState] =
    useState<Language>("English");

  useEffect(() => {
    const saved =
      localStorage.getItem("mandalLanguage");

    if (
      saved === "English" ||
      saved === "Marathi" ||
      saved === "Hindi"
    ) {
      setLanguageState(saved);
    }
  }, []);

  function setLanguage(language: Language) {
    setLanguageState(language);

    localStorage.setItem(
      "mandalLanguage",
      language
    );
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context =
    useContext(LanguageContext);

  if (context === null) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}