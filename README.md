# Serendib Local

Independent Sri Lanka travel website, rebuilt from the original draft.

[Open the private review](https://serendib-local-preview.ausgpt-11.chatgpt.site) — browse the design, practical routes and proposed prices. Sign in with the owning ChatGPT account if prompted. This static review does not send enquiries or enable owner login.

The complete application runs separately with Node 24, React/Vite and SQLite. It provides server-rendered pages, a validated enquiry form, a protected owner dashboard and consistent configurable prices. No Emergent service, integration package or tracking script is needed.

## Start

```sh
npm ci
npm run build
npm run admin:password
npm start
```

Open `http://localhost:3000`. Owner dashboard: `/admin`. Run `npm run check` for the build and integration checks.

## Launch documents

- [Railway deployment and existing-domain migration](docs/RAILWAY.md): selected hosting provider, persistent storage, test deployment and switching serendiblocal.lk from the previous draft.
- [Google SEO and search launch](docs/SEO-LAUNCH.md): implemented changes, target searches, Search Console and ongoing measurement.
- [Independent hosting and migration](docs/HOSTING.md): Render, Docker/VPS, domain, email and backups.
- [Prices and service scope](docs/PRICING-AND-SCOPE.md): competitor sources, proposed rates, inclusions and costs to confirm.
- [Launch decisions and verification](docs/LAUNCH.md): remaining business facts and live checks.
- [Image and font sources](docs/ASSETS.md).

The proposed sedan/SUV/minivan rates are USD 59/77/86 per vehicle per day. They target approximately 9–10% below one published competitor benchmark, subject to cost and availability approval. This is not a lowest-price guarantee. Airport transfers are quoted for the exact journey.

The original draft is retained in Git history. The new branch removes fabricated reviews, unverified experience claims, unsafe browser-priced checkout and publicly accessible enquiry endpoints. No existing customer data or domain settings have been changed.
