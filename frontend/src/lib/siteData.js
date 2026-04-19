// Central copy + media for Serendib Local marketing site.

export const BRAND = {
  name: "Serendib Local",
  tagline: "Sri Lanka, the way locals live it.",
  email: "hello@serendiblocal.com",
  whatsappNumber: "+94771234567", // placeholder - swap with real number
  whatsappDisplay: "+94 77 123 4567",
  location: "Colombo, Sri Lanka",
};

export const WHATSAPP_LINK = (text) =>
  `https://wa.me/${BRAND.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    text || "Hi Serendib Local! I'm dreaming of a trip to Sri Lanka."
  )}`;

export const NAV_LINKS = [
  { label: "Why Us", href: "#why-us" },
  { label: "Packages", href: "#packages" },
  { label: "Experiences", href: "#experiences" },
  { label: "Team", href: "#team" },
  { label: "Plan My Trip", href: "#trip-builder" },
];

export const HERO = {
  eyebrow: "SLTDA Licensed · 5★ on TripAdvisor · Private Tours since 2019",
  title: "Sri Lanka, the way locals live it.",
  sub: "Private, slow-paced journeys designed by people who actually live here — skip the tourist traps, meet the island the way your cousin would show it to you.",
  image:
    "https://images.unsplash.com/photo-1621358670052-d34a786a9385?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwyfHxzcmklMjBsYW5rYSUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3NzY0ODM5OTZ8MA&ixlib=rb-4.1.0&q=85",
};

export const TRUST_ITEMS = [
  { label: "SLTDA Licensed Operator", icon: "ShieldCheck" },
  { label: "5-Star Rated on TripAdvisor", icon: "Star" },
  { label: "Private Car, Always", icon: "Car" },
  { label: "100% Local & Independent", icon: "Leaf" },
];

export const WHY_US = {
  image:
    "https://images.unsplash.com/photo-1742281095650-dd3c50c08772?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMGZvb2R8ZW58MHx8fHwxNzc2NDg0MDAzfDA&ixlib=rb-4.1.0&q=85",
  pillars: [
    {
      title: "Real food, real homes",
      body: "Home-cooked rice & curry, family kitchens and secret kottu spots only tuk-tuk drivers know.",
    },
    {
      title: "Off the beaten path",
      body: "We skip the postcard queues. Hidden waterfalls, farmer villages and monk-only viewpoints.",
    },
    {
      title: "Private car, no group tours",
      body: "Your own driver-guide, flexible itinerary, no 6am wake-up calls to herd strangers.",
    },
    {
      title: "Your money stays local",
      body: "We work directly with small guesthouses, independent drivers and family-run cooks. No middlemen.",
    },
  ],
};

export const PACKAGES = [
  {
    label: "Most Popular",
    title: "The Real Sri Lanka",
    days: "10 days",
    from: "USD 1,290",
    blurb:
      "The classic loop done the local way — Kandy, tea hills, Ella train, safari, southern beach.",
    image:
      "https://images.unsplash.com/photo-1574611122955-5baa61496637?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxzcmklMjBsYW5rYSUyMHRyYWlufGVufDB8fHx8MTc3NjQ4NDAwM3ww&ixlib=rb-4.1.0&q=85",
  },
  {
    label: "Most Unique",
    title: "Hidden Lanka",
    days: "12 days",
    from: "USD 1,590",
    blurb:
      "Zero tourist buses. Jaffna, Mannar, Knuckles, village homestays and wildlife you haven't heard of.",
    image:
      "https://images.unsplash.com/photo-1534545872802-0579930815c2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwzfHxzcmklMjBsYW5rYSUyMGVsZXBoYW50fGVufDB8fHx8MTc3NjQ4Mzk5Nnww&ixlib=rb-4.1.0&q=85",
  },
  {
    label: "Best for Couples",
    title: "Slow & Savour",
    days: "8 days",
    from: "USD 1,180",
    blurb:
      "Boutique villas, sunset dinners on the sand, Ayurveda, hill-country hideaways. Pure romance.",
    image:
      "https://images.unsplash.com/photo-1653959747793-c7c3775665f0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHwzfHxzcmklMjBsYW5rYSUyMGJlYWNofGVufDB8fHx8MTc3NjQ4NDAwM3ww&ixlib=rb-4.1.0&q=85",
  },
];

export const EXPERIENCES = [
  {
    title: "Rice & curry with a village family",
    caption: "Eat with your hands. 12 little dishes. Smiling aunty in charge.",
    image:
      "https://images.unsplash.com/photo-1619714604882-db1396d4a718?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwyfHxzcmklMjBsYW5rYSUyMGZvb2R8ZW58MHx8fHwxNzc2NDg0MDAzfDA&ixlib=rb-4.1.0&q=85",
  },
  {
    title: "Learn to drive a tuk-tuk",
    caption: "A secret back road, our driver Lal, and a lot of laughter.",
    image:
      "https://images.unsplash.com/photo-1656314938753-04e10ebcbbc4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwzfHxzcmklMjBsYW5rYSUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3NzY0ODM5OTZ8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    title: "Pluck tea leaves at sunrise",
    caption: "Walk the bushes with a Tamil tea-picker family in Haputale.",
    image:
      "https://images.unsplash.com/photo-1656314943432-b00ec3f6dbce?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHw0fHxzcmklMjBsYW5rYSUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3NzY0ODM5OTZ8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    title: "Door hanging on the Blue Train",
    caption: "Ella → Nuwara Eliya, through cloud forests. Windows wide open.",
    image:
      "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMHRyYWlufGVufDB8fHx8MTc3NjQ4NDAwM3ww&ixlib=rb-4.1.0&q=85",
  },
  {
    title: "Sunrise at an empty 2,000-year stupa",
    caption: "Before the buses arrive. Just monks, mist and a slow bell.",
    image:
      "https://images.unsplash.com/photo-1663471984093-5925e87e72d5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzB8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMGN1bHR1cmV8ZW58MHx8fHwxNzc2NDgzOTk2fDA&ixlib=rb-4.1.0&q=85",
  },
  {
    title: "Fisherman's beach at golden hour",
    caption: "Help haul the net in, eat what you catch, swim till dark.",
    image:
      "https://images.unsplash.com/photo-1653959699604-1eb000740b57?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHwyfHxzcmklMjBsYW5rYSUyMGJlYWNofGVufDB8fHx8MTc3NjQ4NDAwM3ww&ixlib=rb-4.1.0&q=85",
  },
  {
    title: "Elephants at Udawalawe, off the track",
    caption: "Our guide knows the matriarch's name. Seriously.",
    image:
      "https://images.unsplash.com/photo-1719807633728-7ff13f7f2b61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMGVsZXBoYW50fGVufDB8fHx8MTc3NjQ4Mzk5Nnww&ixlib=rb-4.1.0&q=85",
  },
  {
    title: "Cook with a market spice-lady",
    caption: "Market run at 6am, crush curry leaves, eat lunch in her kitchen.",
    image:
      "https://images.unsplash.com/photo-1561827978-45f07fa822fe?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzB8MHwxfHNlYXJjaHwyfHxzcmklMjBsYW5rYSUyMGN1bHR1cmV8ZW58MHx8fHwxNzc2NDgzOTk2fDA&ixlib=rb-4.1.0&q=85",
  },
];

export const TEAM = [
  {
    name: "Kasun Perera",
    role: "Founder & Lead Guide",
    bio: "Born in the hill country, 12 years guiding. Speaks Sinhala, Tamil, English, enough German to make you laugh. His aunty cooks the best crab curry on the south coast.",
    image:
      "https://images.unsplash.com/photo-1762709412743-3395ed866302?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwyfHxzb3V0aCUyMGFzaWFuJTIwbWFuJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzc2NDg0MDAzfDA&ixlib=rb-4.1.0&q=85",
  },
  {
    name: "Tharushi Silva",
    role: "Experience Curator",
    bio: "Former food writer, turned slow-travel obsessive. Plans every itinerary with one question: would I take my mum here? If no — it's cut.",
    image:
      "https://images.unsplash.com/photo-1751660769801-43c0b1161c85?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHwyfHxzcmklMjBsYW5rYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NzY0ODM5OTZ8MA&ixlib=rb-4.1.0&q=85",
  },
];

export const REVIEWS = [
  {
    quote:
      "Kasun built us an itinerary that felt like it was made by a friend, not a travel agent. We never once felt like tourists — we came home with phone numbers, not souvenirs.",
    name: "Emma & Oliver",
    origin: "London, UK · Couple · 12 days",
    rating: 5,
  },
  {
    quote:
      "Als Alleinreisende war ich skeptisch. Tharushi hat alles perfekt geplant — safe, entspannt, richtig lokal. Das Essen allein war die Reise wert.",
    name: "Lena K.",
    origin: "Berlin, Germany · Solo · 9 days",
    rating: 5,
  },
  {
    quote:
      "Best travel decision I've ever made. I saw villages most travellers drive straight past. The team actually answers WhatsApp at 2am when your plane is delayed.",
    name: "Chloe M.",
    origin: "Melbourne, Australia · Solo · 14 days",
    rating: 5,
  },
];

export const INTERESTS = [
  "Culture & History",
  "Food & Local Life",
  "Wildlife & Safari",
  "Beach & Relaxation",
  "Wellness & Ayurveda",
  "Off the Beaten Path",
  "Photography",
  "Hiking & Nature",
];

export const BLOG = [
  {
    tag: "Planning",
    title: "Best time to visit Sri Lanka (month-by-month, honest guide)",
    excerpt:
      "Yes, there are two monsoons. No, they won't ruin your trip. Here's exactly what to expect in every region, every month.",
    read: "8 min read",
    image:
      "https://images.unsplash.com/photo-1511529048424-b3adbbb2ef04?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHw0fHxzcmklMjBsYW5rYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NzY0ODM5OTZ8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    tag: "Wildlife",
    title: "Sri Lanka vs Kenya safari — a local's blunt comparison",
    excerpt:
      "Leopards, elephants, whales — all in one island. Here's where to go, when to avoid the crowds, and what no blog will tell you.",
    read: "11 min read",
    image:
      "https://images.unsplash.com/photo-1730432997123-76a755eb8941?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwyfHxzcmklMjBsYW5rYSUyMGVsZXBoYW50fGVufDB8fHx8MTc3NjQ4Mzk5Nnww&ixlib=rb-4.1.0&q=85",
  },
  {
    tag: "Hidden",
    title: "Beyond Mirissa: 7 beaches you've never heard of",
    excerpt:
      "The south coast is gorgeous but overrun. Here are seven empty coves where you'll share the sand with fishermen, not influencers.",
    read: "7 min read",
    image:
      "https://images.unsplash.com/photo-1704797389166-c7dac99fc633?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHw0fHxzcmklMjBsYW5rYSUyMHRyYWlufGVufDB8fHx8MTc3NjQ4NDAwM3ww&ixlib=rb-4.1.0&q=85",
  },
];

export const TRUST_BADGES = [
  "SLTDA Licensed",
  "TripAdvisor Certified",
  "Sustainable Travel Partner",
  "Google-Verified Reviews",
];
