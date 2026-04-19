# Serendib Local — Product Requirements

## Original problem statement
Build a full user-friendly tourism website for a new Sri Lanka private-tour business. Sections: transparent→frosted Navbar with persistent WhatsApp CTA, cinematic Hero with slow zoom, Trust Bar, Why Us pillars, Packages (Most Popular/Most Unique/Best for Couples), Experiences grid (8 moments), Meet the Team (2 profiles), Reviews (UK couple / German solo / Australian female), Custom Trip Builder firing WhatsApp/email, Blog (3 SEO articles), Footer, animated Floating WhatsApp button.

V2 additions: package filter bar, day-by-day accordion, What's Included checklist, sticky "Book This" CTA on detail page, Why Book Direct section, FAQ, USD/GBP/EUR currency toggle, and a Custom Plan option.

## Architecture
- **Backend**: FastAPI + MongoDB (single write endpoint for leads).
- **Frontend**: React 19 + React Router v7, Tailwind CSS, Shadcn UI (Accordion, Sonner), Lucide icons. Currency state via Context + localStorage.
- **Fonts**: Libre Baskerville (display serif) + Outfit (body sans).
- **Palette**: sand (#F9F6F0), jungle greens (#1A362D / #142A23), clay accent (#C05A45).

## User personas
1. UK/Aus/Euro couple (mid-30s) planning a 10-day private trip — wants trust signals + itinerary transparency.
2. Solo female traveller — wants safety + direct WhatsApp contact.
3. Last-minute layover traveller — needs short-stay options (3–5 days).

## Core requirements (static)
- Always-visible WhatsApp CTA (top-right + floating bottom-right).
- No booking system at launch — leads route to WhatsApp + MongoDB.
- Editorial, cinematic, non-generic design (avoids purple gradients, Inter/Roboto).

## Implemented — 2026-02 (V1 + V2)
### V1
- Navbar (transparent → frosted on scroll).
- Hero with Ken Burns zoom, eyebrow credibility, 3 CTAs.
- Trust Bar (4 items) / Why Us (4 pillars) / Packages (3 cards).
- Experiences (8-tile dark-green grid) / Team (2 cards) / Reviews (3).
- Trip Builder form → `POST /api/trip-inquiries` + WhatsApp deep-link.
- Blog (3 SEO articles), Footer, Floating WhatsApp w/ pulse ring.
- Backend: `GET /api/`, `POST /api/trip-inquiries`, `GET /api/trip-inquiries`, status endpoints.

### V2
- `/app/frontend/src/lib/packages.js` — 4 packages with full itineraries, multi-currency pricing, included/excluded.
- Route `/packages/:slug` → `PackageDetail.jsx` (hero + itinerary accordion + What's Included grid + sticky Book This CTA + bottom CTA).
- Package filter bar (duration single-select + style multi-select).
- `CurrencyContext` (USD/GBP/EUR, persisted).
- "Why Book Direct" section (25% commission callout).
- FAQ section (6 items, Shadcn accordion).
- "Design your own journey" Custom Plan card.
- Font upgrade: Libre Baskerville + Outfit.

### V3 — 2026-02 (P2 items)
- **Admin dashboard** at `/admin`:
  - Backend: `POST /api/admin/login` + `GET /api/admin/leads` (Bearer auth via `ADMIN_TOKEN` env var).
  - Frontend: password screen → stats cards (total / last-7-days / avg-days / top-interest) + searchable leads table + CSV export + logout.
  - Admin password in `/app/memory/test_credentials.md`.
- **EN / DE / FR language switcher**:
  - `LangContext` + `useLang()` + `t(key)`, persisted via `localStorage.sl_lang`.
  - `/app/frontend/src/lib/i18n.js` — ~50-key dictionary for EN/DE/FR.
  - Globe dropdown in Navbar (desktop + mobile).
  - Translated surfaces: Nav, Hero, TripBuilder, FAQ, Footer, FloatingWhatsapp, Instagram section. Package itineraries + blog stay EN (noted for client).
- **Instagram embed**: new 8-tile grid section above Footer linking to @serendiblocal. **MOCKED** — uses static images from EXPERIENCES data; swap to Instagram Graph API when credentials are available.

## Testing
- iteration_1.json — V2: 17/17 features passed.
- iteration_2.json — V3: 26 new features + V2 regressions, backend 23 pytest cases passed.
- Test credentials: `/app/memory/test_credentials.md` (admin password).

## Prioritised backlog
### P1
- Real WhatsApp number + client-provided team photos & bios.
- Swap Instagram mock for real Instagram Graph API once client supplies credentials.
- Email forwarding (Resend/SendGrid) of new trip inquiries to `hello@serendiblocal.com`.
- Replace placeholder blog cards with actual MDX articles for SEO.
- Live exchange-rate fetch (currently hard-coded per-package figures).
- Translate package itineraries + blog into DE/FR (currently EN only).

### P2
- CMS for packages / blog (so non-devs can edit content).
- Admin dashboard: lead status pipeline (new / replied / booked / lost), notes.
- Gallery page (dedicated).

### P3
- Availability calendar + per-date pricing.
- Stripe/Razorpay deposit payments.
- Google Reviews & TripAdvisor API embed for live counts.
