# Serendib Local: Google search launch

## Objective and limits

Build visibility for travellers who need the private transport this business can actually arrange. Start with service and itinerary searches; the broad phrase “Sri Lanka tourism” is not a useful sole target for a new car-and-driver business. The mapping below is an editorial search-intent plan, not measured keyword volumes, ranking positions or a promise of results.

Google does not guarantee inclusion or a number-one position. Useful content and crawlable pages support discovery; results take time and need measurement after launch. [Google SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).

## Pages and intent

| Page | Primary topic | What the traveller can decide |
| --- | --- | --- |
| `/` | Sri Lanka private car and driver | Whether the offer fits the trip |
| `/sri-lanka-private-driver` | Hire a private driver in Sri Lanka | Hire type, vehicle, luggage and booking questions |
| `/colombo-airport-transfers` | Colombo airport transfers / CMB | What to provide for a destination-specific quote |
| `/sri-lanka-driver-cost` | Sri Lanka private driver cost | Whole-vehicle rates, trip examples, inclusions and extras |
| `/routes` | Sri Lanka itineraries by private car | Which of the three routes fits |
| `/routes/south-coast-slowly` | 5 day Sri Lanka south coast itinerary | Galle/Mirissa stops and transport estimate |
| `/routes/culture-and-tea-country` | 7 day Sri Lanka itinerary | Sigiriya/Kandy/Nuwara Eliya plan |
| `/routes/island-at-your-pace` | 10 day Sri Lanka itinerary | Culture, hills, Ella and coast |
| `/sri-lanka-itinerary-guide` | 5 vs 7 vs 10 days in Sri Lanka | Pace, overnight bases and airport-day trade-offs |
| `/about` | Serendib Local | What the new business offers and how it confirms arrangements |

The new pages are useful service explanations, not near-identical town landing pages. No new experiences, historical expertise, reviews, awards, office locations or fleet ownership were invented.

## Implemented

- Shared page-specific titles, descriptions, canonicals and social metadata for the real application and review copy. Descriptions remain editable through source; driver-cost metadata follows the current configured rate.
- Clear page headings, visible breadcrumbs and internal links connecting services, prices, routes and the enquiry form.
- Server-rendered Organization, WebSite, WebPage/CollectionPage, BreadcrumbList and relevant Service/ItemList JSON-LD. Organization identity is intentionally minimal until real contact/location facts are approved. There are no review stars, fabricated addresses or guaranteed price offers in the markup.
- One sitemap containing the 10 canonical, indexable content pages. It omits forms, legal pages, owner login and unknown routes. No invented modification timestamps, priorities or change frequencies.
- Permanent redirects for recognised trailing-slash and `index.html` duplicates; public HTML served through alternate hostnames redirects to the configured origin once indexing is enabled. Query parameters do not change canonicals. Missing articles return 404 instead of redirecting all missing content to a generic page.
- Private previews and owner/form/legal/404 pages remain `noindex`. Production robots rules allow assets and keep API paths out; authentication protects actual enquiry data.
- Responsive local image candidates, a high-priority hero image, reserved dimensions, lazy route-card images and a preload for the local heading font. The 640px hero is about 99 KB and the 1200px hero about 317 KB versus the original 798 KB; the browser chooses a candidate for its viewport. This is not a measured Google Core Web Vitals score.
- Optional `SEARCH_CONSOLE_VERIFICATION` environment value, using the exact token Google provides. It appears on the independent application's homepage only, not in the private review.

Structured data must match visible content and does not guarantee a particular search appearance. [Organization guidance](https://developers.google.com/search/docs/appearance/structured-data/organization), [breadcrumb guidance](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb). Canonical URLs and sitemap URLs use the same configured domain. [Canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## Required to become visible on Google

The deployed Sites URL is still an owner-private review with enquiry submissions disabled. Google cannot crawl that protected version. SEO changes do not remove this restriction or connect a business domain automatically.

1. Confirm the business domain, actual services, costs and monitored contact details, then deploy the full Node application using `docs/HOSTING.md`. Confirm enquiries work and the site can be reached publicly over HTTPS without a sign-in gate.
2. Set `APP_ORIGIN` to that exact HTTPS domain and set `INDEXING_ENABLED=true`. Redirect other public domain variants through the host to it. Verify homepage/service pages return 200 with an indexable robots directive, one canonical and visible content. Admin and enquiry records must stay protected.
3. Add the domain to the business's own Google Search Console account. A Domain property uses Google's DNS TXT verification; a URL-prefix property can use the generated meta-token setting. Keep the real verification record/token; never invent one. [Verify ownership](https://support.google.com/webmasters/answer/9008080).
4. Submit the final-domain `/sitemap.xml`. Use URL Inspection on the homepage, driver service, transfer page, cost guide and route pages. Check the live view and request indexing for the key pages. Submission does not guarantee indexing.
5. Run Google's Rich Results Test on the live pages and PageSpeed Insights on mobile and desktop. Fix reported crawl, schema or performance problems. Inspect Search Console indexing and Core Web Vitals reports as real data becomes available. [Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start), [page experience](https://developers.google.com/search/docs/appearance/page-experience).

No Search Console property was created, DNS changed, indexing request submitted, public access enabled or ranking result measured in this work. The user must supply/authorize the real domain and relevant account access for those steps.

## Local business presence and trust

First establish eligibility for a Google Business Profile: an online-only brand is not enough. Use the genuine business name, real operating location or eligible service area, correct contact number and appropriate category. Do not use a virtual office or add keywords to the business name. A profile has not been created here. [Google Business Profile guidelines](https://support.google.com/business/answer/3038177).

When actual journeys are completed, ask customers for honest feedback and permission before using their stories or photographs. Publish real vehicle/driver information once verified. Keep business details consistent across legitimate partner listings. Relevant relationships and useful trip information can earn links; do not buy ranking links, manufacture reviews or create city pages for services you cannot provide. Google's local results consider relevance, distance and prominence, so a single universal first position cannot be purchased or promised. [Local ranking guidance](https://support.google.com/business/answer/7091).

## First 90 days after public launch

| Period | Work | Evidence to review |
| --- | --- | --- |
| Weeks 1–2 | Verify the domain, sitemap, indexability and enquiry delivery; correct crawl issues | Search Console page indexing and live URL Inspection |
| Weeks 3–6 | Review the searches reaching each service page; answer actual pre-booking questions; add verified original trip/vehicle information | Search impressions, clicks, click-through rate and real enquiries |
| Weeks 7–12 | Improve pages with relevant impressions but weak response; develop one useful guide from recurring customer questions; pursue genuine partner references | Query/page trends over comparable 28-day periods, target countries, mobile usability and enquiries |

Track service and itinerary queries separately from brand searches. Record confirmed enquiries/bookings alongside search traffic. Average position varies by query, device, location and time and is not a stable universal rank. Do not judge success from one personal Google search or an SEO score alone. This is a manual plan; no scheduled reporting automation has been enabled.

## Verification

The test suite checks unique metadata, substantive page content, canonical/social/schema consistency, visible breadcrumb labels, sitemap coverage/exclusions, indexing controls, optional verification-token handling, safe structured-data encoding, permanent redirects, internal links and responsive asset availability, alongside the original enquiry/security tests. Live Google indexing, rankings, Rich Results Test and real-user Core Web Vitals cannot be verified against the owner-private review.
