# Serendib Local — Product Requirements

## Vision (V7 — launch-ready full-stack)
Sri Lanka **private car & driver** booking site that doubles as its own CMS:
no fixed packages, no group buses, and every piece of copy, price, route,
review, FAQ or team bio is editable by the owners from `/admin`.

## Architecture
- **Backend**: FastAPI + MongoDB (`motor`) + `emergentintegrations` Stripe
  checkout + Resend email (dormant). CMS lives in `cms` collection keyed by
  collection name. Sitemap + robots served from `/api/sitemap.xml` and
  `/api/robots.txt`.
- **Frontend**: React 19 + React Router v7 + Tailwind + Shadcn UI + Lucide
  icons + `react-helmet-async` for SEO. Three global providers wrap the
  tree: `HelmetProvider` → `ContentProvider` → `LangProvider` → `CurrencyProvider`.
- **Deploy target**: portable. Frontend → Vercel / Netlify, backend →
  Railway / Render. All URLs & creds from `.env`; default values omitted.
- **Routes**: `/`, `/admin`, `/booking-confirmed`, `/privacy`, `/terms`,
  fallback `*` → `NotFound`.

## CMS
14 editable collections (backend `cms_defaults.py`, frontend
`CmsEditor.jsx` with generic list / singleton schema driver):

| Key | Type | Purpose |
| --- | --- | --- |
| `settings` | singleton | brand, contact, WhatsApp, hero (eyebrow/title/sub/image), SEO (title, description, keywords, og image), site_url, Plausible domain, Instagram handle |
| `services` | list | 3 home cards (Airport / Day Tour / Road Trip) — title, desc, price, icon, cta, mode, badge |
| `vehicles` | list | Sedan / SUV / Van — label, seats, dailyUSD, icon, image |
| `locations` | list | 19 trip-builder stops grouped by region |
| `trip_experiences` | list | 14 add-ons on trip-builder step 3 |
| `stay_budgets` | list | Budget / Mid / Upscale / Luxury bands |
| `stay_styles` | list | Homestay, Guesthouse, Boutique, Villa, Eco-lodge, Beach cabana, Tea bungalow, Resort |
| `reviews` | list | Homepage testimonials |
| `faqs` | list | Accordion Q&A |
| `concierge` | list | 6 add-on service cards |
| `sample_routes` | list | 3 showcase itineraries |
| `team` | list | Founders (bio, role, image) |
| `experiences` | list | Instagram-style gallery tiles |
| `trust_items` | list | Badges in the trust bar |

### CMS endpoints
- `GET /api/cms` — all keys in one payload (frontend boot fetch).
- `GET /api/cms/{key}` — single collection/singleton, `{key, value}`.
- `PUT /api/admin/cms/{key}` — body `{items}` for list, `{data}` for
  singleton. Bearer admin token. 401 / 404 / 422 enforced.
- `POST /api/admin/cms/{key}/reset` — restore shipped defaults.
- Auth uses `hmac.compare_digest` against `ADMIN_TOKEN`.

## Bookings flows (unchanged from V6)
- Airport Transfer — `QuickBookModal` mode=airport — full payment upfront.
- Day Tour — `QuickBookModal` mode=dayTour — 10% deposit.
- Road Trip — `BookNowModal` 3-step — 10% deposit.
- Trip Builder — 5-step wizard (Trip basics → Stops → Experiences → Stay → Details) writes to `trip_inquiries`.

## SEO / launch-ready
- `<SEO>` React component (Helmet) on every route: title, description,
  keywords, canonical, OpenGraph, Twitter, and JSON-LD `TravelAgency`
  structured data. Admin + 404 use `noindex,nofollow`.
- `GET /api/sitemap.xml` — generated from CMS (home + anchors + privacy,
  terms + dynamic sample_route slugs).
- `GET /api/robots.txt` + static `/public/robots.txt` fallback.
- Privacy, Terms and NotFound pages live with CMS-driven contact info.

## Admin dashboard
Three top-level tabs — **Leads** · **Bookings** · **Content**.
Content tab renders `CmsEditor` with 14 sub-tabs. Each tab edits either a
list (add / delete / reorder / per-field inputs) or singleton (key-value
form). Save & Reset call the appropriate endpoint.

## Implementation log
### V1 – V6.2 — see CHANGELOG in git history
### V7 — 2026-02-19 (CMS + SEO migration)
- New `/app/backend/cms_defaults.py` (14 default collections).
- New CMS endpoints, startup seeder (idempotent), sitemap.xml, robots.txt.
- New `ContentContext`, `useCMS`, `useSettings` hook.
- New `SEO` component + meta upgrades in `public/index.html`.
- New `CmsEditor` component with 14 schema-driven tabs.
- Swapped Hero, Services, Reviews, FAQ, TripBuilder (locations,
  trip_experiences, stay_budgets, stay_styles, vehicles) to CMS.
- New pages: Privacy, Terms, 404.
- Admin: 3rd tab "Content", SEO `noindex`.
- Hardening: `hmac.compare_digest` on admin, StrictMode-safe fetch,
  sort-by-order fallback when item[0] lacks `order`.

### Verified (iteration_8)
- 17/17 backend pytest: CMS CRUD, 401/404/422, reset, sitemap, robots.
- Frontend e2e: CMS editor renders 14 tabs, singleton form shows real
  values, save/reset round-trip, new routes (/privacy, /terms, 404).
- Regression: QuickBookModal, BookNowModal, TripBuilder wizard, admin
  leads/bookings still intact.

## Prioritised backlog
### P1 (before publish)
- Paste keys (Stripe LIVE, Resend, WhatsApp real number) into `.env`.
- Real team portraits + brand logo.
- Social media OG asset (1200×630).
- Test Stripe LIVE with a small transaction.

### P2 (nice-to-have post-launch)
- Per-key Pydantic schemas for CMS PUT (prevents malformed items).
- Split `server.py` (>800 LOC) into `routers/{cms,bookings,payments,seo}.py`.
- Admin CMS: image upload flow (currently URL fields only).
- Admin CMS: drag-and-drop reordering.
- Admin CMS: preview-before-save.
- Availability calendar for driver/vehicle.
- Email balance-due reminder 45 days before arrival + self-serve 90% flow.
- Google Reviews live badge.

### P3 (optional)
- Rate-limit admin endpoints.
- Newsletter capture + Mailchimp/Resend list.
- Plausible analytics auto-inject from settings.
- Emergent Google-Auth for admin login.
