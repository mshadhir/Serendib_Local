import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { DICT, LANGS } from "@/lib/i18n";

const LangContext = createContext({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
  langs: LANGS,
});

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("sl_lang") || "en";
    return "en";
  });

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("sl_lang", lang);
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key) => {
      const table = DICT[lang] || DICT.en;
      return table[key] ?? DICT.en[key] ?? key;
    },
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, setLang, t, langs: LANGS }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
