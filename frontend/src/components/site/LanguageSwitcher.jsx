import { useState } from "react";
import { Globe, Check } from "lucide-react";
import { useLang } from "@/context/LangContext";

export default function LanguageSwitcher({ variant = "light" }) {
  const { lang, setLang, langs } = useLang();
  const [open, setOpen] = useState(false);
  const isDark = variant === "dark";

  const current = langs.find((l) => l.code === lang) || langs[0];

  return (
    <div className="relative" data-testid="language-switcher">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        data-testid="language-switcher-btn"
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition-all border ${
          isDark
            ? "border-white/25 text-white/90 hover:text-white hover:border-white/70"
            : "border-sand-200 text-[#111827] hover:border-jungle-700"
        }`}
      >
        <Globe className="h-3.5 w-3.5" />
        {current.label}
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 w-40 rounded-xl border border-sand-200 bg-sand-50 shadow-[0_24px_60px_-30px_rgba(26,54,45,0.45)] p-1 z-50"
          data-testid="language-switcher-menu"
        >
          {langs.map((l) => (
            <button
              key={l.code}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setLang(l.code);
                setOpen(false);
              }}
              data-testid={`language-option-${l.code}`}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                lang === l.code
                  ? "bg-jungle-700 text-sand-50"
                  : "text-[#111827] hover:bg-sand-100"
              }`}
            >
              <span>{l.name}</span>
              {lang === l.code && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
