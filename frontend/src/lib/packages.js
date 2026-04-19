// Legacy helpers still referenced by the active funnel.
// - CURRENCIES: used by CurrencyContext + CurrencyToggle for USD/GBP/EUR switcher.
// - ROAD_TRIP_PACKAGE: pseudo-package passed to BookNowModal for the
//   "Fully Handled Road Trip" service card ($150/day, 10% deposit flow).

export const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "GBP", symbol: "£" },
  { code: "EUR", symbol: "€" },
];

export const ROAD_TRIP_PACKAGE = {
  slug: "custom-road-trip",
  title: "Fully Handled Road Trip",
  pricePerDayUSD: 150,
  isCustom: true,
};
