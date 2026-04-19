import { createContext, useContext, useState, useEffect } from "react";
import { CURRENCIES } from "@/lib/packages";

const CurrencyContext = createContext({
  currency: "USD",
  setCurrency: () => {},
  format: (amounts) => "",
});

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sl_currency") || "USD";
    }
    return "USD";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sl_currency", currency);
    }
  }, [currency]);

  const format = (priceObj) => {
    if (!priceObj) return "";
    const symbol = CURRENCIES.find((c) => c.code === currency)?.symbol || "$";
    const value = priceObj[currency] ?? priceObj.USD;
    return `${symbol}${value.toLocaleString("en-US")}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
