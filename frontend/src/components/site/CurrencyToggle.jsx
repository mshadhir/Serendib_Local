import { CURRENCIES } from "@/lib/packages";
import { useCurrency } from "@/context/CurrencyContext";

export default function CurrencyToggle({ variant = "dark" }) {
  const { currency, setCurrency } = useCurrency();
  const isDark = variant === "dark";

  return (
    <div
      data-testid="currency-toggle"
      className={`inline-flex items-center gap-0.5 rounded-full p-1 ${
        isDark ? "bg-jungle-700/80 border border-jungle-600" : "bg-sand-50 border border-sand-200"
      }`}
    >
      {CURRENCIES.map((c) => {
        const active = c.code === currency;
        return (
          <button
            key={c.code}
            type="button"
            onClick={() => setCurrency(c.code)}
            data-testid={`currency-${c.code.toLowerCase()}`}
            className={`rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition-all ${
              active
                ? isDark
                  ? "bg-clay-500 text-sand-50"
                  : "bg-jungle-700 text-sand-50"
                : isDark
                ? "text-sand-50/70 hover:text-sand-50"
                : "text-[#4B5563] hover:text-jungle-700"
            }`}
          >
            {c.code}
          </button>
        );
      })}
    </div>
  );
}
