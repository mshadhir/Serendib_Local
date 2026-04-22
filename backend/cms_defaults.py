"""
Default CMS seed data. On first server startup any missing collection key is
populated with the defaults below so the frontend renders out-of-the-box.
Admins overwrite these via PUT /api/admin/cms/{key}.

All image fields are URLs — admins paste Unsplash / Cloudinary / custom CDN URLs.
"""

CMS_DEFAULTS = {
    # ---------- Singleton: site settings (brand, contact, hero, SEO) ----------
    "settings": {
        "brand_name": "Serendib Local",
        "tagline": "Your Private Driver. Your Sri Lanka.",
        "email": "hello@serendiblocal.com",
        "whatsapp_number": "+94716797971",
        "location": "Badulla, Sri Lanka",
        "currency_default": "USD",
        "hero_eyebrow": "5★ on TripAdvisor · Private Tours since 2019",
        "hero_title": "Your Private Driver. Your Sri Lanka.",
        "hero_sub": (
            "No fixed packages. No group buses. Just you, a local driver who grew up here, "
            "and a private car that goes wherever you want — at your pace."
        ),
        "hero_image": (
            "https://images.unsplash.com/photo-1621358670052-d34a786a9385?crop=entropy&cs=srgb&fm=jpg"
            "&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwyfHxzcmklMjBsYW5rYSUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3NzY0ODM5OTZ8MA&ixlib=rb-4.1.0&q=85"
        ),
        "seo_title": "Serendib Local — Private Car & Driver in Sri Lanka",
        "seo_description": (
            "Licensed private car & driver service across Sri Lanka. Airport transfers, "
            "private day tours and fully-handled road trips with a local guide from Badulla. "
            "No group buses. No middlemen. WhatsApp us to design your route."
        ),
        "seo_keywords": "Sri Lanka private driver, car and driver Sri Lanka, Sigiriya tour, Ella tour, Kandy driver, licensed tour operator, Badulla",
        "seo_og_image": (
            "https://images.unsplash.com/photo-1621358670052-d34a786a9385?crop=entropy&cs=srgb&fm=jpg"
            "&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwyfHxzcmklMjBsYW5rYSUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3NzY0ODM5OTZ8MA&ixlib=rb-4.1.0&q=85"
        ),
        "site_url": "https://serendiblocal.com",
        "instagram_handle": "@serendiblocal",
        "analytics_plausible_domain": "",
    },

    # ---------- Services (3 cards on home) ----------
    "services": [
        {
            "slug": "airport-transfer", "icon": "Plane",
            "title": "Airport Transfer",
            "desc": "Stress-free pickup or drop-off from Bandaranaike International Airport. Meet-and-greet, help with luggage, comfortable air-conditioned car.",
            "price": "From $35", "cta": "quickbook", "mode": "airport", "badge": "",
            "popular": False, "order": 1,
        },
        {
            "slug": "day-tour", "icon": "MapPin",
            "title": "Private Day Tour",
            "desc": "Pick any destination — Sigiriya, Kandy, Galle, Ella. We drive, we guide, we stop whenever you want. Accommodation not included.",
            "price": "From $85 per day", "cta": "quickbook", "mode": "dayTour", "badge": "",
            "popular": False, "order": 2,
        },
        {
            "slug": "road-trip", "icon": "Sparkles",
            "title": "Fully Handled Road Trip",
            "desc": "Car, driver, AND accommodation all sorted by us. You tell us how many days and what you want to see — we handle everything. Just show up and enjoy Sri Lanka.",
            "price": "From $150 per day, all inclusive", "cta": "book", "mode": "",
            "badge": "Most Popular", "popular": True, "order": 3,
        },
    ],

    # ---------- Vehicles (Vehicles section + trip-builder rates) ----------
    "vehicles": [
        {"id": "sedan", "label": "Sedan",      "seats": "1–3 pax", "dailyUSD": 85,  "icon": "Car",   "order": 1,
         "image": "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800"},
        {"id": "suv",   "label": "SUV",        "seats": "1–5 pax", "dailyUSD": 110, "icon": "Truck", "order": 2,
         "image": "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"},
        {"id": "van",   "label": "Family Van", "seats": "1–8 pax", "dailyUSD": 140, "icon": "Bus",   "order": 3,
         "image": "https://images.unsplash.com/photo-1609520505218-7421df17d5ad?w=800"},
    ],

    # ---------- Trip-Builder content ----------
    "locations": [
        {"slug": "colombo",      "name": "Colombo",      "region": "Capital",           "note": "Airport + city",             "emoji": "🏙️"},
        {"slug": "negombo",      "name": "Negombo",      "region": "West Coast",        "note": "Close to CMB airport",       "emoji": "🐟"},
        {"slug": "sigiriya",     "name": "Sigiriya",     "region": "Cultural Triangle", "note": "Lion Rock + cave temples",   "emoji": "🗻"},
        {"slug": "dambulla",     "name": "Dambulla",     "region": "Cultural Triangle", "note": "Cave temples + market",      "emoji": "🛕"},
        {"slug": "polonnaruwa",  "name": "Polonnaruwa",  "region": "Cultural Triangle", "note": "Ancient ruins by bike",      "emoji": "🚲"},
        {"slug": "kandy",        "name": "Kandy",        "region": "Hill Country",      "note": "Temple of the Tooth",        "emoji": "🦁"},
        {"slug": "nuwara-eliya", "name": "Nuwara Eliya", "region": "Hill Country",      "note": "Tea country + Blue Train",   "emoji": "🍃"},
        {"slug": "ella",         "name": "Ella",         "region": "Hill Country",      "note": "Nine-Arches + hikes",        "emoji": "🌉"},
        {"slug": "haputale",     "name": "Haputale",     "region": "Hill Country",      "note": "Lipton's Seat sunrise",      "emoji": "⛰️"},
        {"slug": "yala",         "name": "Yala",         "region": "South Coast",       "note": "Leopards + safari",          "emoji": "🐆"},
        {"slug": "udawalawe",    "name": "Udawalawe",    "region": "South Coast",       "note": "Elephants guaranteed",       "emoji": "🐘"},
        {"slug": "mirissa",      "name": "Mirissa",      "region": "South Coast",       "note": "Surf + stilt fishermen",     "emoji": "🏄"},
        {"slug": "galle",        "name": "Galle Fort",   "region": "South Coast",       "note": "Old Dutch ramparts",         "emoji": "🏰"},
        {"slug": "unawatuna",    "name": "Unawatuna",    "region": "South Coast",       "note": "Calm-bay beach",             "emoji": "🏖️"},
        {"slug": "arugam-bay",   "name": "Arugam Bay",   "region": "East Coast",        "note": "World-class point break",    "emoji": "🌊"},
        {"slug": "trincomalee",  "name": "Trincomalee",  "region": "East Coast",        "note": "Whales + pristine beaches",  "emoji": "🐋"},
        {"slug": "jaffna",       "name": "Jaffna",       "region": "North",             "note": "Tamil culture + kool",       "emoji": "🛺"},
        {"slug": "anuradhapura", "name": "Anuradhapura", "region": "Cultural Triangle", "note": "2,000-year-old stupas",      "emoji": "🕉️"},
        {"slug": "knuckles",     "name": "Knuckles",     "region": "Hill Country",      "note": "Wild trekking + waterfalls", "emoji": "🥾"},
    ],

    "trip_experiences": [
        {"slug": "rice-curry",     "label": "Home-cooked rice & curry",            "emoji": "🍛"},
        {"slug": "safari",         "label": "Leopard / elephant safari",           "emoji": "🐆"},
        {"slug": "blue-train",     "label": "Blue-train ride through tea",         "emoji": "🚂"},
        {"slug": "cooking-class",  "label": "Cooking class with a local aunty",    "emoji": "👩‍🍳"},
        {"slug": "tuk-tuk",        "label": "Drive your own tuk-tuk",              "emoji": "🛺"},
        {"slug": "ayurveda",       "label": "Ayurveda massage / spa",              "emoji": "💆"},
        {"slug": "surf-lesson",    "label": "Surf lesson in Arugam or Weligama",   "emoji": "🏄‍♂️"},
        {"slug": "whale-watching", "label": "Whale watching (Mirissa / Trinco)",   "emoji": "🐋"},
        {"slug": "hike",           "label": "Sunrise hike (Ella Rock / Little Adam's)", "emoji": "🌄"},
        {"slug": "tea-pick",       "label": "Pick tea with a Tamil family",        "emoji": "🍵"},
        {"slug": "temple",         "label": "Temple visit with a monk guide",      "emoji": "🛕"},
        {"slug": "street-food",    "label": "Street-food night tour",              "emoji": "🥟"},
        {"slug": "beach-bbq",      "label": "Beach fish BBQ at sunset",            "emoji": "🔥"},
        {"slug": "market",         "label": "Early-morning market run",            "emoji": "🧺"},
    ],

    "stay_budgets": [
        {"id": "budget",  "label": "Budget",     "range": "$25–60",   "note": "Homestays · family guesthouses", "order": 1},
        {"id": "mid",     "label": "Mid-range",  "range": "$60–120",  "note": "Boutique guesthouses · 3★ hotels", "order": 2},
        {"id": "upscale", "label": "Upscale",    "range": "$120–250", "note": "Boutique villas · 4★ hotels", "order": 3},
        {"id": "luxury",  "label": "Luxury",     "range": "$250+",    "note": "5★ resorts · private villas", "order": 4},
    ],

    "stay_styles": [
        {"id": "homestay",     "label": "Homestay"},
        {"id": "guesthouse",   "label": "Guesthouse"},
        {"id": "boutique",     "label": "Boutique hotel"},
        {"id": "villa",        "label": "Private villa"},
        {"id": "eco-lodge",    "label": "Eco-lodge"},
        {"id": "beach-cabana", "label": "Beach cabana"},
        {"id": "tea-bungalow", "label": "Tea-country bungalow"},
        {"id": "resort",       "label": "Resort"},
    ],

    # ---------- Reviews ----------
    "reviews": [
        {
            "quote": "Kasun built us an itinerary that felt like it was made by a friend, not a travel agent. We never once felt like tourists — we came home with phone numbers, not souvenirs.",
            "name": "Emma & Oliver", "origin": "London, UK · Couple · 12 days", "rating": 5, "order": 1,
        },
        {
            "quote": "Als Alleinreisende war ich skeptisch. Tharushi hat alles perfekt geplant — safe, entspannt, richtig lokal. Das Essen allein war die Reise wert.",
            "name": "Lena K.", "origin": "Berlin, Germany · Solo · 9 days", "rating": 5, "order": 2,
        },
        {
            "quote": "Best travel decision I've ever made. I saw villages most travellers drive straight past. The team actually answers WhatsApp at 2am when your plane is delayed.",
            "name": "Chloe M.", "origin": "Melbourne, Australia · Solo · 14 days", "rating": 5, "order": 3,
        },
    ],

    # ---------- FAQ ----------
    "faqs": [
        {"q": "What's the best time to visit Sri Lanka?",
         "a": "December to March is peak on the south/west coast and hill country — sunny, dry, a bit crowded. April–August is when the east coast (Arugam Bay, Trinco) shines and the south coast sees occasional rain. We can drive in any season and will route you around active monsoon pockets.",
         "order": 1},
        {"q": "Is Sri Lanka safe for solo female travellers?",
         "a": "Yes. The country is friendly and the roads are well-travelled. Our female guests consistently tell us they felt safer here than in most European cities. Your driver is your point of contact 24/7, and we're always one WhatsApp message away.",
         "order": 2},
        {"q": "Do I need a visa?",
         "a": "Most nationalities need an ETA (Electronic Travel Authorisation). It costs about USD 50 and you apply online in 10 minutes at eta.gov.lk. We can share the direct link once you book.",
         "order": 3},
        {"q": "Can I customise the route once we've started?",
         "a": "Absolutely — the whole point of private car & driver is flexibility. Want to skip a town and add a day at the beach? Just tell your driver the night before. Price is adjusted at the end, no paperwork.",
         "order": 4},
        {"q": "What's your cancellation policy?",
         "a": "Deposit is fully refundable up to 30 days before arrival. Between 30 and 14 days it's 50% refundable. Inside 14 days, the deposit is non-refundable but we'll credit it toward a future trip if you reschedule.",
         "order": 5},
        {"q": "How much should I budget beyond the driver?",
         "a": "Rule of thumb (per person, per day): Budget $60–80 (guesthouses + rice-&-curry), Mid $100–150 (boutique guesthouses + restaurants), Upscale $200–300 (4★ hotels + fine dining). Entry tickets (Sigiriya, safari, etc.) add $10–40/day.",
         "order": 6},
    ],

    # ---------- Concierge (6 add-on services) ----------
    "concierge": [
        {"icon": "Utensils",    "title": "Home-cooked meals",     "desc": "Rice & curry at village houses, kottu from the best street spots. You eat what your driver eats."},
        {"icon": "Bed",         "title": "Accommodation booking", "desc": "From $25 homestays to $500 tea-bungalows. Short-listed to match your budget — no mark-up, we forward you the rate."},
        {"icon": "Ticket",      "title": "Entry tickets & permits","desc": "Sigiriya, safari, temple donations — we pre-book so you skip the queue and handle cash."},
        {"icon": "Train",       "title": "Blue-train seat reservations","desc": "Ella → Nuwara Eliya is notoriously hard to book. We reserve your window seat 30 days in advance."},
        {"icon": "Activity",    "title": "Experiences along the route","desc": "Cooking class, tuk-tuk driving lesson, tea-picking with a Tamil family — arranged for the day you want."},
        {"icon": "ShieldCheck", "title": "Travel insurance & SIM","desc": "We'll point you to the right insurance and hand you a Dialog SIM at the airport so you're online from minute one."},
    ],

    # ---------- Sample Routes (3 showcase itineraries) ----------
    "sample_routes": [
        {"slug": "classic-loop",
         "title": "The Classic Loop",
         "days": "7 days",
         "stops": "Colombo → Sigiriya → Kandy → Ella → Yala → Galle → Colombo",
         "blurb": "The greatest-hits loop, done the local way. Cave temples, Lion Rock, the Blue Train, leopards, Dutch forts and a beach cool-down.",
         "price": "From $1,050", "order": 1,
         "image": "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=1200"},
        {"slug": "hidden-lanka",
         "title": "Hidden Lanka",
         "days": "10 days",
         "stops": "Colombo → Anuradhapura → Jaffna → Trincomalee → Knuckles → Ella → Mirissa",
         "blurb": "Zero tourist buses. Sacred stupas, Tamil Jaffna, whale-filled Trinco bays, cloud-forest trekking in the Knuckles and an empty cove on the south.",
         "price": "From $1,500", "order": 2,
         "image": "https://images.unsplash.com/photo-1534545872802-0579930815c2?w=1200"},
        {"slug": "slow-south",
         "title": "Slow South",
         "days": "5 days",
         "stops": "Colombo → Udawalawe → Yala → Galle → Mirissa",
         "blurb": "Wildlife, Dutch architecture, stilt fishermen and long lunches. Perfect for couples short on time, long on appetite.",
         "price": "From $720", "order": 3,
         "image": "https://images.unsplash.com/photo-1653959747793-c7c3775665f0?w=1200"},
    ],

    # ---------- Team ----------
    "team": [
        {"name": "Kasun Perera", "role": "Co-founder · Lead Driver",
         "bio": "Grew up on a tea estate ten minutes outside Badulla. Learned to drive on the switchbacks to Ella before he could legally vote. Speaks Sinhala, Tamil, English and enough German to make his guests laugh.",
         "image": "https://images.unsplash.com/photo-1762709412743-3395ed866302?w=800",
         "order": 1},
        {"name": "Tharushi Silva", "role": "Co-founder · Trip Planner",
         "bio": "Kasun's neighbour since primary school in Badulla. Used to write for a Colombo food magazine, then quit to plan trips the way she plans her own: slow mornings, long lunches, no bus tours.",
         "image": "https://images.unsplash.com/photo-1751660769801-43c0b1161c85?w=800",
         "order": 2},
    ],

    # ---------- Experiences showcase (Instagram-style gallery) ----------
    "experiences": [
        {"title": "Rice & curry with a village family", "caption": "Eat with your hands. 12 little dishes. Smiling aunty in charge.",
         "image": "https://images.unsplash.com/photo-1619714604882-db1396d4a718?w=800"},
        {"title": "Learn to drive a tuk-tuk", "caption": "A secret back road, our driver Lal, and a lot of laughter.",
         "image": "https://images.unsplash.com/photo-1656314938753-04e10ebcbbc4?w=800"},
        {"title": "Pluck tea leaves at sunrise", "caption": "Walk the bushes with a Tamil tea-picker family in Haputale.",
         "image": "https://images.unsplash.com/photo-1656314943432-b00ec3f6dbce?w=800"},
        {"title": "Door hanging on the Blue Train", "caption": "Ella → Nuwara Eliya, through cloud forests. Windows wide open.",
         "image": "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=800"},
        {"title": "Sunrise at an empty 2,000-year stupa", "caption": "Before the buses arrive. Just monks, mist and a slow bell.",
         "image": "https://images.unsplash.com/photo-1663471984093-5925e87e72d5?w=800"},
        {"title": "Elephants at Udawalawe, off the track", "caption": "Our guide knows the matriarch's name. Seriously.",
         "image": "https://images.unsplash.com/photo-1719807633728-7ff13f7f2b61?w=800"},
    ],

    # ---------- Team section copy (singleton — narrative + sidebar basics) ----------
    "team_section": {
        "eyebrow": "Meet the team",
        "heading": "Friends from Badulla. One very well-loved car.",
        "paragraph_1": (
            "We're a small team of childhood friends from Badulla, a small town tucked into "
            "the tea hills of Sri Lanka's Uva province. We rode the same Ella-to-Kandy train "
            "on weekends to visit cousins, and spent every school holiday exploring a new "
            "corner of the island — usually crammed into a dad's old Nissan with too many aunties."
        ),
        "paragraph_2": (
            "By the time we finished school we'd basically driven the whole country: up to "
            "Jaffna for kool, down to Mirissa for stilt fishermen, east to Arugam Bay the "
            "week before surf season, west for crab in Negombo. What started as a habit "
            "became the thing we loved most — showing friends-of-friends around, picking "
            "them up from the airport at 3am, taking the long way home past the best kottu "
            "shop nobody tells tourists about."
        ),
        "paragraph_3": (
            "So three years ago we decided to just do it properly. We bought a comfortable "
            "car, got our tour licences, built this little site, and started driving "
            "travellers the way we drive our own friends: no rushed schedules, no group "
            "buses, no commission-taking detours to gem shops. Just us, one air-conditioned "
            "car, and whatever corner of Sri Lanka you want to see next."
        ),
        "paragraph_4": (
            "If you book with us, you're not hiring a company. You're asking a Badulla-born "
            "friend to drive you around his country — and he's pretty happy to."
        ),
        "basic_1": "Born & raised in Badulla, hill country",
        "basic_2": "3+ years driving private guests across the island",
        "basic_3": "Every corner of Sri Lanka — driven, eaten, slept in",
        "footer_note": (
            "Every booking goes directly to us — not a reseller. You'll chat with one of us "
            "on WhatsApp, and one of us will be the person picking you up."
        ),
    },

    # ---------- Blog posts ----------
    "blog_posts": [
        {
            "slug": "best-time-to-visit-sri-lanka",
            "title": "The honest, month-by-month guide to the best time to visit Sri Lanka",
            "excerpt": "Two monsoons, two coasts, and one big myth. Here's exactly what to expect every month — and why \"shoulder season\" might be your best-kept secret.",
            "cover_image": "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=1600",
            "author": "Kasun",
            "published_at": "2026-01-18",
            "read_minutes": 8,
            "tag": "Planning",
            "featured": True,
            "order": 1,
            "body": (
                "Sri Lanka has two monsoons, and almost every travel blog on earth handles "
                "this badly. Here's the short version: when the south-west is wet, the "
                "north-east is dry. When the north-east is wet, the south-west is sunny. "
                "There's always somewhere dry.\n\n"
                "**December to March** is peak on the south coast, the west coast and the "
                "hill country. Bright sun, dry roads, high-season prices. Book early.\n\n"
                "**April** is our favourite shoulder month — still dry everywhere, fewer "
                "tourists, Sinhala/Tamil New Year vibe in every village.\n\n"
                "**May to August** is when the east coast — Arugam Bay, Trincomalee, Nilaveli — "
                "comes alive. World-class surf, empty beaches, warm water. The south gets "
                "occasional rain but rarely ruins a day.\n\n"
                "**October–November** is the second shoulder: short showers in the afternoon, "
                "everything blooms green, and hotel rates are the lowest they get all year.\n\n"
                "Our honest advice? Don't plan around the weather. Plan around the coast "
                "you want. We'll route you so you stay ahead of the rain."
            ),
        },
        {
            "slug": "car-and-driver-vs-renting",
            "title": "Renting a car in Sri Lanka? Read this before you book.",
            "excerpt": "Left-hand driving, kamikaze buses, 2-hour police stops for foreigners. Here's why 94% of our guests say hiring a driver was the best decision they made.",
            "cover_image": "https://images.unsplash.com/photo-1534545872802-0579930815c2?w=1600",
            "author": "Tharushi",
            "published_at": "2026-01-05",
            "read_minutes": 6,
            "tag": "Getting around",
            "featured": True,
            "order": 2,
            "body": (
                "People ask us all the time whether they should just rent a car and drive "
                "themselves. The short answer is: almost certainly no. Here's why.\n\n"
                "First, the legal bit. Sri Lanka requires a temporary Sri Lankan driver's "
                "licence on top of your international permit — you apply in person in Colombo, "
                "it takes half a day, and they still sometimes reject you for reasons nobody "
                "can explain.\n\n"
                "Second, the road itself. We drive on the left. Trucks and buses drive "
                "wherever the hell they want. Goats, tuk-tuks, elephants and funeral "
                "processions share the road. Average rural driving speed is 35 km/h. A "
                "5-hour trip on Google Maps is 7 hours in real life.\n\n"
                "Third, the actually-useful stuff. Your driver is your on-the-ground "
                "translator, fixer, restaurant-finder, parking attendant, temple guide and "
                "3am-emergency backup. He'll get you the local price on safari tickets, "
                "know where the petrol shortage is that week, and spot the roti cart you "
                "would have driven straight past.\n\n"
                "We're biased, obviously. But the maths is simple: a driver costs you "
                "$85–140 a day including fuel. Self-driving costs you the same in car rental "
                "+ fuel + the three extra hours a day you'll spend lost."
            ),
        },
        {
            "slug": "beyond-mirissa-south-coast-secrets",
            "title": "Beyond Mirissa: 7 south-coast coves we only share with friends",
            "excerpt": "Mirissa is beautiful but overrun. Here are seven quieter beaches where the only soundtrack is the stilt fishermen — and a honest review of each.",
            "cover_image": "https://images.unsplash.com/photo-1653959747793-c7c3775665f0?w=1600",
            "author": "Kasun",
            "published_at": "2025-12-14",
            "read_minutes": 7,
            "tag": "Hidden",
            "featured": True,
            "order": 3,
            "body": (
                "Mirissa is the TikTok beach. It's gorgeous, but it's also where every "
                "group bus on the south coast drops its guests at 11am. If you want the "
                "Sri Lanka we grew up with, here are seven alternatives.\n\n"
                "**Hiriketiya** — horseshoe cove, reliable surf, best smoothie bowls on "
                "the coast. Busy but still intimate. Go early.\n\n"
                "**Dickwella** — five minutes down the road, long empty beach, calm water. "
                "Perfect for families. Ask your driver about the blowhole nearby.\n\n"
                "**Talalla** — where our friends who moved to the south live. No parties. "
                "Long sunsets. A few boutique homestays and nothing else.\n\n"
                "**Kabalana** — point break that the pro surfers keep quiet about. 20 min "
                "from Weligama. Dawn only.\n\n"
                "**Madiha** — Weligama's overlooked cousin. Wide golden beach, cheap "
                "guesthouses, a cricket pitch on the sand every Sunday.\n\n"
                "**Kogala** — the last stilt fishermen still working this stretch. Pay "
                "them for a photo (they earn more posing than fishing now).\n\n"
                "**Unawatuna's eastern end** — everyone piles into Unawatuna bay. Walk 500m "
                "east along the rocks and you have your own cove. Bring snorkels.\n\n"
                "Tell your driver which of these you want to see and he'll work them into "
                "the route. No buses, no crowds."
            ),
        },
    ],

    # ---------- Trust bar ----------
    "trust_items": [
        {"label": "Licensed Tour Operator",         "icon": "ShieldCheck", "order": 1},
        {"label": "5-Star Rated on TripAdvisor",   "icon": "Star",        "order": 2},
        {"label": "Private Car, Always",           "icon": "Car",         "order": 3},
        {"label": "100% Local & Independent",      "icon": "Leaf",        "order": 4},
    ],
}

# Keys stored as list-of-items (PUT replaces whole array).
LIST_COLLECTIONS = {
    "services", "vehicles", "locations", "trip_experiences",
    "stay_budgets", "stay_styles", "reviews", "faqs",
    "concierge", "sample_routes", "team", "experiences", "trust_items",
    "blog_posts",
}

# Keys stored as singleton docs (PUT replaces the object).
SINGLETON_COLLECTIONS = {"settings", "team_section"}

ALL_KEYS = LIST_COLLECTIONS | SINGLETON_COLLECTIONS
