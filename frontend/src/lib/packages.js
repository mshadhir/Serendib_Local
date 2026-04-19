// Detailed package data with itinerary, included/excluded, multi-currency pricing.
// 3 packages — updated for Car & Driver core product positioning.

export const PACKAGES = [
  {
    slug: "real-sri-lanka",
    label: "Best for first-timers",
    title: "The Real Sri Lanka",
    tagline: "The classic loop, done the local way.",
    days: 7,
    durationLabel: "7 days",
    durationGroup: "6-8",
    tags: ["family", "culture", "couples"],
    tagLabels: ["Family", "Culture", "Couples"],
    price: { USD: 980, GBP: 775, EUR: 895 },
    priceNote: "per person, twin share",
    blurb:
      "Kandy, tea hills, the Ella train, safari and a southern beach — but via village homestays, family kitchens and roads the buses can't fit down.",
    image:
      "https://images.unsplash.com/photo-1574611122955-5baa61496637?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxzcmklMjBsYW5rYSUyMHRyYWlufGVufDB8fHx8MTc3NjQ4NDAwM3ww&ixlib=rb-4.1.0&q=85",
    highlights: [
      "Private driver-guide for the full 7 days",
      "Ella → Nuwara Eliya on the Blue Train (reserved window seat)",
      "Village homestay in a cinnamon-growing family",
      "Udawalawe safari with an off-grid local tracker",
    ],
    itinerary: [
      { day: 1, title: "Welcome to Colombo", desc: "Airport pickup, gentle walking tour of Pettah bazaar, first rice & curry in a local canteen.", meals: "Dinner", stay: "Boutique hotel, Colombo" },
      { day: 2, title: "Sigiriya via Dambulla caves", desc: "Scenic drive north. Climb the Dambulla cave temples at sunset, stay at the foot of Lion Rock.", meals: "Breakfast", stay: "Eco-lodge, Sigiriya" },
      { day: 3, title: "Sigiriya rock & Kandy", desc: "Sunrise climb of Sigiriya, drive via spice gardens to Kandy.", meals: "Breakfast", stay: "Heritage guesthouse, Kandy" },
      { day: 4, title: "Kandy → Hill Country by train", desc: "Board the Blue Train to Nanu Oya. Cloud forests, tea estates, door-hanging photos.", meals: "Breakfast", stay: "Tea bungalow, Nuwara Eliya" },
      { day: 5, title: "Ella's waterfalls & Nine Arches", desc: "Short hike to Ravana Falls, lazy afternoon at Nine Arches Bridge.", meals: "Breakfast", stay: "Ella hideaway" },
      { day: 6, title: "Udawalawe safari & south coast", desc: "Early safari, then drive to Mirissa for a sunset swim.", meals: "Breakfast, Lunch", stay: "Beach villa, Weligama" },
      { day: 7, title: "Galle Fort & flight home", desc: "Morning stroll around Galle Fort's ramparts, slow coffee, transfer to airport.", meals: "Breakfast", stay: "—" },
    ],
    included: [
      "Private air-conditioned vehicle + English-speaking driver-guide",
      "6 nights accommodation at handpicked guesthouses (twin/double room)",
      "Daily breakfast + selected meals",
      "Airport pickup & drop-off",
      "24/7 WhatsApp support",
    ],
    excluded: [
      "International flights",
      "Visa (ETA, ~USD 50 online)",
      "Entry tickets (Sigiriya, Temple of the Tooth, etc.)",
      "Personal expenses & tips",
      "Travel insurance",
    ],
  },
  {
    slug: "hidden-lanka",
    label: "Most Unique",
    title: "Hidden Lanka",
    tagline: "Zero tourist buses. All the real stuff.",
    days: 6,
    durationLabel: "6 days",
    durationGroup: "6-8",
    tags: ["adventure", "solo", "culture"],
    tagLabels: ["Adventure", "Solo-friendly", "Culture"],
    price: { USD: 850, GBP: 675, EUR: 775 },
    priceNote: "per person, twin share",
    blurb:
      "Jaffna, Mannar, village homestays and the wildlife most travellers never hear about. For travellers who want stories, not selfies.",
    image:
      "https://images.unsplash.com/photo-1534545872802-0579930815c2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwzfHxzcmklMjBsYW5rYSUyMGVsZXBoYW50fGVufDB8fHx8MTc3NjQ4Mzk5Nnww&ixlib=rb-4.1.0&q=85",
    highlights: [
      "Tamil homestay in Jaffna — rarely visited by tourists",
      "Wild elephants at Wasgamuwa (no jeep crowds)",
      "Island-hopping off Mannar by local fishing boat",
      "Private boat trip at sunrise (optional add-on)",
    ],
    itinerary: [
      { day: 1, title: "Colombo arrival", desc: "Gentle intro day. Street-food crawl with Kasun through Galle Face.", meals: "Dinner", stay: "Colombo boutique" },
      { day: 2, title: "Drive north to Anuradhapura", desc: "Ancient stupas at golden hour. Cycle among ruins.", meals: "Breakfast", stay: "Anuradhapura eco" },
      { day: 3, title: "Jaffna & Tamil culture", desc: "Drive to the deep north. Visit the Nallur temple, dinner with a Tamil family.", meals: "Breakfast, Dinner", stay: "Jaffna homestay" },
      { day: 4, title: "Mannar island & flamingos", desc: "Boat trip among flamingo flocks, Baobab forest, Adam's Bridge sands.", meals: "Breakfast", stay: "Mannar guest lodge" },
      { day: 5, title: "Wasgamuwa wild elephants", desc: "Safari in the park no one visits — often we're the only jeep there.", meals: "Breakfast", stay: "Forest tent" },
      { day: 6, title: "Back to Colombo & departure", desc: "Slow drive south, last lunch with the team, airport transfer.", meals: "Breakfast", stay: "—" },
    ],
    included: [
      "Private 4WD-capable vehicle + driver-guide",
      "5 nights in a mix of homestays, eco-lodges & tented camps",
      "Daily breakfast + selected meals",
      "Airport pickup & drop-off",
      "24/7 WhatsApp support",
    ],
    excluded: [
      "International flights",
      "Visa (ETA, ~USD 50 online)",
      "Snorkelling / boat trips (optional add-ons)",
      "Personal expenses & tips",
      "Travel insurance",
    ],
  },
  {
    slug: "slow-and-savour",
    label: "Best for Couples",
    title: "Slow & Savour",
    tagline: "Boutique villas, sunsets, Ayurveda.",
    days: 5,
    durationLabel: "5 days",
    durationGroup: "3-5",
    tags: ["couples", "wellness"],
    tagLabels: ["Couples", "Wellness"],
    price: { USD: 780, GBP: 615, EUR: 710 },
    priceNote: "per person, twin share",
    blurb:
      "A quieter, softer Sri Lanka. Hill-country hideaways, private beach villas, one authentic Ayurveda day and sunset dinners on the sand.",
    image:
      "https://images.unsplash.com/photo-1653959747793-c7c3775665f0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHwzfHxzcmklMjBsYW5rYSUyMGJlYWNofGVufDB8fHx8MTc3NjQ4NDAwM3ww&ixlib=rb-4.1.0&q=85",
    highlights: [
      "Boutique tea-estate bungalow (just 4 rooms)",
      "Private Ayurveda consultation (optional)",
      "Beachfront villa with your own plunge pool",
      "Sunset seafood dinner on the sand",
    ],
    itinerary: [
      { day: 1, title: "Arrival & drive to tea hills", desc: "Airport pickup, scenic drive via Kitulgala. Afternoon tea at your tea-estate bungalow.", meals: "Dinner", stay: "Tea bungalow" },
      { day: 2, title: "Tea walk & Ella", desc: "Plantation walk, factory tour, drive to Ella.", meals: "Breakfast, Lunch", stay: "Ella hideaway" },
      { day: 3, title: "Slow Ella + cooking class", desc: "Little Adam's Peak sunrise (optional), cooking class.", meals: "Breakfast, Dinner", stay: "Ella hideaway" },
      { day: 4, title: "Down to the south coast", desc: "Scenic drive. Afternoon snorkel or hammock nap. Sunset seafood BBQ on the sand.", meals: "Breakfast, Dinner", stay: "Beach villa, Weligama" },
      { day: 5, title: "Galle Fort & departure", desc: "Galle Fort breakfast, antique shopping, airport transfer.", meals: "Breakfast", stay: "—" },
    ],
    included: [
      "Private vehicle + driver-guide for all transfers",
      "4 nights in boutique villas, tea bungalow, beach villa",
      "Daily breakfast + selected meals",
      "Airport pickup & drop-off",
      "24/7 WhatsApp support",
    ],
    excluded: [
      "International flights",
      "Visa (ETA, ~USD 50 online)",
      "Spa / Ayurveda treatments (optional)",
      "Personal expenses & tips",
      "Travel insurance",
    ],
  },
];

export const FILTERS = {
  duration: [
    { id: "all", label: "All" },
    { id: "3-5", label: "3–5 Days" },
    { id: "6-8", label: "6–8 Days" },
  ],
  type: [
    { id: "couples", label: "Couples" },
    { id: "family", label: "Family" },
    { id: "adventure", label: "Adventure" },
    { id: "wellness", label: "Wellness" },
  ],
};

export const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "GBP", symbol: "£" },
  { code: "EUR", symbol: "€" },
];

export const getPackageBySlug = (slug) => PACKAGES.find((p) => p.slug === slug);

// Custom "road trip" pseudo-package for the Services "Fully Handled Road Trip" card.
export const ROAD_TRIP_PACKAGE = {
  slug: "custom-road-trip",
  title: "Fully Handled Road Trip",
  pricePerDayUSD: 150,
  isCustom: true,
};
