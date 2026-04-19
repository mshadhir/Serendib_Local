# Serendib Local — Product Requirements

## Original positioning (V6)
Sri Lanka **private car & driver** service. No fixed packages, no group buses — a flexible chauffeur-driven product where travellers plan their own trip and ride with a vetted local driver who handles everything along the way.

## Architecture
- **Backend**: FastAPI + MongoDB + `emergentintegrations.payments.stripe.checkout` + Resend (dormant).
- **Frontend**: React 19 + React Router v7 + Tailwind + Shadcn UI (Dialog, Accordion, Sonner) + Lucide icons.
- Context: `CurrencyProvider` (USD/GBP/EUR, localStorage) + `LangProvider` (EN/DE/FR).
- Fonts: Libre Baskerville (display) + Outfit (body).
- Palette: sand, jungle green, clay accent.

## User personas
- Solo/couple flying into CMB, wanting a private car and flexible plan.
- Families wanting an all-handled road trip with airport pickup.
- Digital nomads / short-stay travellers who want airport transfer + day tours only.

## Core flow (V6 clean rebuild)
Navbar → Hero ("Your Private Driver. Your Sri Lanka.") → TrustBar → **Services (3 cards: Airport $35 / Day Tour $85-day / Fully Handled Road Trip $150-day w/ Book Now)** → HowItWorks (4 steps) → Vehicles & pricing (Sedan/SUV/Van) → Instant Price widget → Concierge (6 cards) → Sample Routes (3) → Experiences → Team → Reviews → Why Book Direct → Trip Builder → FAQ → Instagram → Footer.

Routes live: `/`, `/admin`, `/booking-confirmed`.
Routes removed in V6: `/packages/:slug`, `/deposit/:slug`, `/car-and-driver` (content merged into home).

## Backend endpoints
- Public: `POST /api/trip-inquiries`, `POST /api/bookings/create-checkout`, `GET /api/bookings/status/{session_id}`, `POST /api/webhook/stripe`, legacy `POST /api/payments/checkout` + `GET /api/payments/status/{id}`.
- Admin (Bearer `ADMIN_TOKEN`): `POST /api/admin/login`, `GET /api/admin/leads`, `GET /api/admin/bookings`, `PATCH /api/admin/bookings/{id}`.

## Bookings data model (MongoDB `bookings`)
`booking_id, session_id, package_slug, package_name, arrival_date, departure_date, num_days, num_travellers, price_per_person, total_price, deposit_amount (10%), balance_due, guest_name, guest_email, guest_whatsapp, guest_country, special_requests, stripe_payment_id, payment_status, status (pending|deposit_paid|trip_confirmed|in_progress|completed|cancelled), emails_sent, created_at, updated_at`.

## Implemented
### V1 – V5 (see git log)
- Hero/TrustBar/WhyUs/Packages/Experiences/Team/Reviews/TripBuilder/Blog/Footer.
- Stripe deposit page (`/deposit/:slug`) + admin dashboard + EN/DE/FR + Instagram embed + Car & Driver dedicated page with Instant Price widget.

### V6 — 2026-02 (Redesign: focus on Car & Driver)
- Removed: Packages section, Custom Plan card, Blog, WhyUs lifestyle section, `/packages/:slug`, `/deposit/:slug`, `/car-and-driver` dedicated page.
- New section components: `HowItWorks`, `Vehicles`, `Concierge`, `SampleRoutes`, `InstantPriceBlock`.
- Services grid now the primary offer (Airport / Day Tour / Road Trip); Road Trip uses the existing 3-step Book Now modal → Stripe Checkout.
- Booking emails (admin + guest) fire on first "paid" transition via Resend (dormant until `RESEND_API_KEY` set).
- Admin dashboard: Leads + Bookings tabs with status dropdown.
- Simplified nav: Services · Vehicles · Routes · Reviews · FAQ (+ EN/DE/FR translations).

## Testing
- iteration_1/2/3/4/5.json — all iterations passed. V6 iteration_5: 30+ frontend features + 16/16 backend tests green.
- Test credentials: `/app/memory/test_credentials.md`.

## Prioritised backlog
### P1
- Paste real `RESEND_API_KEY` → emails go live (admin + guest).
- Verify `serendiblocal.com` DNS in Resend.
- Swap placeholder daily rates / WhatsApp number / team photos.
- Switch `STRIPE_API_KEY` to real live key before launch.

### P2
- Admin dashboard: date-range filter, lead → booking link, notes field.
- Send balance-due reminder email 45 days before arrival.
- Self-serve balance payment (90%) flow.

### P3
- Availability calendar for drivers/vehicles.
- Google Reviews live badge.
- CMS for routes/concierge content.
