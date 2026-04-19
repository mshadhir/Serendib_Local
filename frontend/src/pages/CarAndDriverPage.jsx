import { Link } from "react-router-dom";
import {
  ArrowLeft, Plane, Map, MessageCircle, HeartHandshake, Check, Hotel, Utensils, Camera,
  Languages, ShieldAlert, CircleDollarSign, Car as CarIcon, Truck, Bus, ArrowUpRight, Sparkles, ShieldCheck,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import FloatingWhatsapp from "@/components/site/FloatingWhatsapp";
import {
  CAR_AND_DRIVER_HERO, PILLARS, VEHICLES, INCLUDED_PER_DAY,
  CONCIERGE_SERVICES, SAMPLE_ROUTES, CAR_FAQ,
} from "@/lib/carAndDriver";
import { WHATSAPP_LINK } from "@/lib/siteData";

const PILLAR_ICONS = { Plane, Map, MessageCircle, HeartHandshake };
const CONCIERGE_ICONS = { Hotel, Utensils, Camera, Languages, ShieldAlert, CircleDollarSign };
const VEHICLE_ICONS = { sedan: CarIcon, suv: Truck, van: Bus };

export default function CarAndDriverPage() {
  return (
    <main className="relative bg-sand-50 text-[#111827]" data-testid="car-and-driver-page">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[80svh] md:min-h-[85svh] overflow-hidden bg-jungle-900">
        <img
          src={CAR_AND_DRIVER_HERO.image}
          alt="Sri Lanka private car journey"
          className="absolute inset-0 h-full w-full object-cover will-change-transform animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/80" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-8">
          <Link
            to="/"
            data-testid="car-page-back"
            className="inline-flex items-center gap-2 text-sand-50/90 hover:text-sand-50 text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-20 min-h-[60svh] flex flex-col justify-end">
          <p className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.28em] text-clay-500 mb-5">
            {CAR_AND_DRIVER_HERO.eyebrow}
          </p>
          <h1 className="font-display text-white text-5xl sm:text-6xl lg:text-[5.75rem] leading-[0.95] tracking-tight max-w-4xl">
            {CAR_AND_DRIVER_HERO.title}
            <span className="block italic text-sand-50/85">We'll handle the rest.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-white/85 text-lg">
            {CAR_AND_DRIVER_HERO.sub}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-sand-50/80 text-sm">
            <span className="inline-flex items-center gap-2"><Plane className="h-4 w-4 text-clay-500" /> Airport ↔ airport</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-clay-500" /> SLTDA-vetted drivers</span>
            <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-clay-500" /> From USD 65/day, all-in</span>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={WHATSAPP_LINK("Hi! I'd like a private car + driver in Sri Lanka. Can you send me a quote?")}
              target="_blank"
              rel="noreferrer"
              data-testid="car-hero-whatsapp"
              className="inline-flex items-center gap-2 rounded-full bg-clay-500 hover:bg-clay-600 text-white px-7 py-4 text-sm font-medium transition-all"
            >
              <MessageCircle className="h-4 w-4" /> Get a quote on WhatsApp
            </a>
            <a
              href="#vehicles"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 hover:border-white text-white/95 px-7 py-4 text-sm font-medium backdrop-blur-sm transition-all"
            >
              See vehicles & prices
            </a>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-14 max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4">Why this works</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight">
              A driver who's half-guide, half-friend — and 100% on your side.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {PILLARS.map((p) => {
              const Icon = PILLAR_ICONS[p.icon] || Plane;
              return (
                <div
                  key={p.title}
                  className="rounded-2xl border border-sand-200 bg-sand-50 p-7 hover:-translate-y-1 hover:shadow-[0_22px_50px_-30px_rgba(26,54,45,0.35)] transition-all duration-500"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-jungle-700 text-clay-500">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-5 font-display text-2xl text-[#111827] leading-tight">{p.title}</h3>
                  <p className="mt-3 text-[#4B5563] text-[15px] leading-relaxed">{p.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vehicles + pricing */}
      <section id="vehicles" className="bg-sand-100 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-14 max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4">Vehicles &amp; prices</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight">
              Three vehicles, one all-in daily rate.
            </h2>
            <p className="mt-5 text-[#4B5563] text-base md:text-lg max-w-2xl">
              No hidden fees. Prices include everything in the list below — just multiply by your number of days.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8" data-testid="vehicle-tiers">
            {VEHICLES.map((v) => {
              const Icon = VEHICLE_ICONS[v.slug] || CarIcon;
              return (
                <article
                  key={v.slug}
                  data-testid={`vehicle-tier-${v.slug}`}
                  className="relative rounded-2xl border border-sand-200 bg-sand-50 p-8 flex flex-col hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(26,54,45,0.4)] transition-all duration-500"
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-jungle-700 text-clay-500">
                      <Icon className="h-6 w-6" strokeWidth={1.5} />
                    </span>
                    <span className="inline-flex items-center rounded-full bg-sand-100 border border-sand-200 text-jungle-700 text-[10px] tracking-[0.18em] uppercase font-semibold px-2.5 py-1">
                      {v.label}
                    </span>
                  </div>
                  <h3 className="font-display text-3xl text-[#111827] leading-tight">{v.name}</h3>
                  <p className="mt-2 text-[#4B5563] text-sm">{v.seats} · {v.luggage}</p>
                  <div className="mt-6 flex items-end gap-1.5">
                    <span className="font-display text-5xl text-[#111827] leading-none">${v.price}</span>
                    <span className="text-[#4B5563] text-sm mb-1">/day</span>
                  </div>
                  <p className="mt-4 text-[#4B5563] text-sm">{v.note}</p>
                  <ul className="mt-6 space-y-2.5 text-sm">
                    {v.perks.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-[#111827]">
                        <Check className="h-4 w-4 text-clay-500 mt-0.5 flex-none" strokeWidth={2.5} /> {p}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={WHATSAPP_LINK(`Hi! I'd like a quote for the ${v.name} (${v.seats}) — private car & driver service.`)}
                    target="_blank"
                    rel="noreferrer"
                    data-testid={`vehicle-enquire-${v.slug}`}
                    className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-jungle-700 hover:bg-jungle-800 text-sand-50 px-6 py-3 text-sm font-medium transition-all"
                  >
                    <MessageCircle className="h-4 w-4" /> Enquire about {v.name}
                  </a>
                </article>
              );
            })}
          </div>

          {/* What's included per day */}
          <div className="mt-14 rounded-2xl bg-jungle-700 text-sand-50 p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-start gap-10">
              <div className="md:w-1/3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-3">What's in that daily rate</p>
                <h3 className="font-display text-3xl md:text-4xl leading-tight">Everything, actually.</h3>
                <p className="mt-4 text-sand-50/75 text-sm">
                  No surprise fuel charges, no driver's lunch extras, no parking tickets added at the end. One price, all-in.
                </p>
              </div>
              <ul className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INCLUDED_PER_DAY.map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sand-50/90 text-[15px]">
                    <Check className="h-4 w-4 text-clay-500 mt-1 flex-none" strokeWidth={2.5} /> {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Concierge services */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-14 max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4">More than a driver</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight">
              Your driver is also your…
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="concierge-grid">
            {CONCIERGE_SERVICES.map((s) => {
              const Icon = CONCIERGE_ICONS[s.icon] || Hotel;
              return (
                <div
                  key={s.title}
                  className="rounded-2xl border border-sand-200 bg-sand-50 p-7 hover:-translate-y-1 hover:shadow-[0_20px_45px_-28px_rgba(26,54,45,0.35)] transition-all duration-500"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-clay-500/15 text-clay-500">
                    <Icon className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <h3 className="mt-5 font-display text-xl md:text-[1.4rem] text-[#111827] leading-tight">{s.title}</h3>
                  <p className="mt-3 text-[#4B5563] text-sm leading-relaxed">{s.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sample routes */}
      <section className="bg-sand-100 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4">Need inspiration?</p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight">
                Three routes our guests keep picking.
              </h2>
              <p className="mt-5 text-[#4B5563] text-base max-w-xl">
                Use them as a starting point — then swap, add, remove as you go. Your driver adjusts in real time.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-testid="sample-routes">
            {SAMPLE_ROUTES.map((r, i) => (
              <article
                key={r.title}
                data-testid={`sample-route-${i}`}
                className="group rounded-2xl overflow-hidden border border-sand-200 bg-sand-50 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(26,54,45,0.35)] transition-all duration-500"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-jungle-900">
                  <img
                    src={r.image}
                    alt={r.title}
                    className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center rounded-full bg-sand-50/90 text-jungle-700 text-[10px] tracking-[0.18em] uppercase font-semibold px-2.5 py-1.5">
                      {r.days}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl text-[#111827] leading-tight">{r.title}</h3>
                  <p className="mt-3 text-[#4B5563] text-xs leading-relaxed">
                    {r.stops.join(" → ")}
                  </p>
                  <a
                    href={WHATSAPP_LINK(`Hi! I like the "${r.title}" (${r.days}) route — can you quote me?`)}
                    target="_blank"
                    rel="noreferrer"
                    data-testid={`sample-route-cta-${i}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm text-jungle-700 group-hover:text-clay-500 transition-colors"
                  >
                    Ask for this route <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4">Honest answers</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight">
              Car &amp; driver, specifically.
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3" data-testid="car-faq-accordion">
            {CAR_FAQ.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`car-faq-${i}`}
                data-testid={`car-faq-item-${i}`}
                className="rounded-2xl border border-sand-200 bg-sand-50 px-6 data-[state=open]:bg-sand-100"
              >
                <AccordionTrigger className="py-5 text-left font-display text-lg md:text-xl leading-tight text-[#111827] hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#4B5563] text-[15px] leading-relaxed pb-6 pr-2">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-jungle-800 text-sand-50 py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4">Ready to go?</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight">
            Tell us your dates.
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-sand-50/75">
            We'll put you in touch with the right driver, the right vehicle, and a rough route you can rework as you go.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={WHATSAPP_LINK("Hi! I'd like to book a private car + driver in Sri Lanka. My dates are…")}
              target="_blank"
              rel="noreferrer"
              data-testid="car-bottom-whatsapp"
              className="inline-flex items-center gap-2 rounded-full bg-clay-500 hover:bg-clay-600 text-white px-7 py-4 text-sm font-medium transition-all"
            >
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>
            <Link
              to="/#trip-builder"
              className="inline-flex items-center rounded-full border border-sand-50/40 hover:border-sand-50 text-sand-50 px-7 py-4 text-sm font-medium transition-all"
            >
              Fill the trip builder →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsapp />
    </main>
  );
}
