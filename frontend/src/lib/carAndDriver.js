// Car & Driver service data — flexible DIY-with-chauffeur product.

export const CAR_AND_DRIVER_HERO = {
  eyebrow: "Your private driver across Sri Lanka",
  title: "You plan. We drive.",
  sub: "Airport pickup to airport drop-off — a vetted local driver-guide, a comfortable private vehicle, and 24/7 support so you can explore the island entirely at your own pace.",
  image:
    "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMHRyYWlufGVufDB8fHx8MTc3NjQ4NDAwM3ww&ixlib=rb-4.1.0&q=85",
};

export const PILLARS = [
  {
    icon: "Plane",
    title: "Airport-to-airport, door-to-door",
    body:
      "We pick you up at Bandaranaike Airport the moment you land — and stay with you until you're back at departures. No taxis, no haggling, no missed trains.",
  },
  {
    icon: "Map",
    title: "Go anywhere, change your mind twice",
    body:
      "No fixed route. Wake up, tell your driver where you want to go — safari today, beach tomorrow, secret temple on the way. It's your trip.",
  },
  {
    icon: "MessageCircle",
    title: "24/7 support on the road",
    body:
      "Restaurant full? Hotel overbooked? ATM eaten your card? One WhatsApp message to us and we sort it. Before you even finish your coffee.",
  },
  {
    icon: "HeartHandshake",
    title: "Locals who actually care",
    body:
      "All our drivers speak fluent English, know every back road, and are paid fairly (not tip-dependent). They're guides, friends, translators, and occasional cooks.",
  },
];

export const VEHICLES = [
  {
    slug: "sedan",
    label: "Most chosen",
    name: "Standard Sedan",
    seats: "2–3 guests",
    luggage: "3 suitcases",
    price: 65,
    perks: ["A/C", "USB charging", "Bluetooth audio", "Phone holder"],
    note: "Perfect for couples or solo travellers.",
  },
  {
    slug: "suv",
    label: "Most comfortable",
    name: "SUV",
    seats: "4–5 guests",
    luggage: "5 suitcases",
    price: 85,
    perks: ["Extra legroom", "A/C", "USB charging", "Child-seat available"],
    note: "Ideal for small families or groups of friends.",
  },
  {
    slug: "van",
    label: "Groups & families",
    name: "Family Van",
    seats: "6–8 guests",
    luggage: "8 suitcases",
    price: 110,
    perks: ["Individual A/C", "Reclining seats", "Overhead storage", "Dual charging"],
    note: "The roomy option for big families or extended friend groups.",
  },
];

export const INCLUDED_PER_DAY = [
  "Fluent English-speaking driver-guide",
  "Fuel, highway tolls, parking",
  "Driver's food & accommodation",
  "Up to 250 km per day (plenty for any route)",
  "Complimentary bottled water (chilled, always)",
  "SIM card setup on day one",
  "Airport pickup + drop-off anywhere in Sri Lanka",
  "24/7 WhatsApp concierge support",
];

export const CONCIERGE_SERVICES = [
  { icon: "Hotel", title: "Hotel scouting & booking", body: "We'll find and book hotels / villas / homestays that match your taste and budget — often cheaper than Booking.com." },
  { icon: "Utensils", title: "Restaurant & food recs", body: "From best rice & curry to the fanciest rooftop in Colombo. Your driver books tables on the fly." },
  { icon: "Camera", title: "Activities & tickets", body: "Safari jeeps, cooking classes, whale watching, cultural shows — we book everything at local prices." },
  { icon: "Languages", title: "Translation & bargaining", body: "Monks, market vendors, tuk-tuk drivers — your guide handles it all in Sinhala, Tamil, or English." },
  { icon: "ShieldAlert", title: "Anything goes wrong — we fix it", body: "Flat tyre, lost passport, sudden fever. One WhatsApp message; we're already on it." },
  { icon: "CircleDollarSign", title: "Money stuff", body: "We'll flag which ATMs work with foreign cards, where to change cash safely, and stop overcharging at sites." },
];

export const SAMPLE_ROUTES = [
  {
    title: "The First-Timer Loop",
    days: "10 days",
    image:
      "https://images.unsplash.com/photo-1574611122955-5baa61496637?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxzcmklMjBsYW5rYSUyMHRyYWlufGVufDB8fHx8MTc3NjQ4NDAwM3ww&ixlib=rb-4.1.0&q=85",
    stops: ["Negombo", "Sigiriya", "Kandy", "Ella", "Udawalawe", "Mirissa", "Galle"],
  },
  {
    title: "The Surfer & Foodie",
    days: "7 days",
    image:
      "https://images.unsplash.com/photo-1653959699604-1eb000740b57?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHwyfHxzcmklMjBsYW5rYSUyMGJlYWNofGVufDB8fHx8MTc3NjQ4NDAwM3ww&ixlib=rb-4.1.0&q=85",
    stops: ["Colombo", "Weligama", "Ahangama", "Dickwella", "Galle"],
  },
  {
    title: "The Slow North",
    days: "9 days",
    image:
      "https://images.unsplash.com/photo-1534545872802-0579930815c2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwzfHxzcmklMjBsYW5rYSUyMGVsZXBoYW50fGVufDB8fHx8MTc3NjQ4Mzk5Nnww&ixlib=rb-4.1.0&q=85",
    stops: ["Negombo", "Anuradhapura", "Jaffna", "Mannar", "Wilpattu", "Kandy"],
  },
];

export const CAR_FAQ = [
  {
    q: "So I just tell the driver where to go each morning?",
    a: "Exactly. We'll help you plan a rough outline before you fly (so hotels are booked), but day-to-day you decide. Want to stay an extra night in Ella? Just say the word.",
  },
  {
    q: "How does payment work?",
    a: "A small 10% deposit to lock your dates. The remaining balance is due 14 days before arrival. Prices are in USD and flat per day — no hidden extras, ever.",
  },
  {
    q: "Is the driver paid separately? Do I need to tip?",
    a: "Everything is included in the daily rate — driver's wage, meals, accommodation. Tipping at the end is a lovely gesture (USD 5–10/day is generous) but never expected.",
  },
  {
    q: "Are hotels included?",
    a: "Your hotels are separate — you book whatever suits your taste. We're happy to suggest properties at every budget and book them for you at local rates, which is usually cheaper than Booking.com.",
  },
  {
    q: "What if I need to change the plan mid-trip?",
    a: "That's literally the point of this service. One message on WhatsApp and we rework the route, rebook the next hotel, find a new driver-friendly viewpoint. Zero fees.",
  },
];
