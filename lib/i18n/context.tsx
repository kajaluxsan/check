"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import de, { type Translations } from "./de";
import en from "./en";
import fr from "./fr";
import it from "./it";

export type Locale = "de" | "en" | "fr" | "it";

const LOCALES: Record<Locale, Translations> = { de, en, fr, it };

interface I18nContext {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
}

const Ctx = createContext<I18nContext>({
  locale: "de",
  setLocale: () => {},
  t: de,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("de");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved && LOCALES[saved]) {
      setLocaleState(saved);
    }
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  }

  return (
    <Ctx.Provider value={{ locale, setLocale, t: LOCALES[locale] }}>
      {children}
    </Ctx.Provider>
  );
}

export function useT() {
  return useContext(Ctx);
}
