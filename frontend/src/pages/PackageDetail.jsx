import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Plus, MapPin, Calendar, Users, Star, MessageCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getPackageBySlug } from "@/lib/packages";
import { useCurrency } from "@/context/CurrencyContext";
import CurrencyToggle from "@/components/site/CurrencyToggle";
import FloatingWhatsapp from "@/components/site/FloatingWhatsapp";
import Footer from "@/components/site/Footer";
import { WHATSAPP_LINK } from "@/lib/siteData";

export default function PackageDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const pkg = getPackageBySlug(slug);
  const { format } = useCurrency();
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setShowStickyCta(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  if (!pkg) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-sand-50 px-6 text-center">
        <div>
          <h1 className="font-display text-4xl text-[#111827]">Package not found</h1>
          <button
            onClick={() => navigate("/")}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-jungle-700 text-sand-50 px-6 py-3 text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Back home
          </button>
        </div>
      </main>
    );
  }

  const bookMessage = `Hi! I'd love to book the "${pkg.title}" (${pkg.durationLabel}) — can you send me the next steps?`;

  return (
    <main className="relative bg-sand-50 text-[#111827]" data-testid="package-detail-page">
      {/* Hero */}
      <section className="relative min-h-[80svh] md:min-h-[90svh] overflow-hidden bg-jungle-900">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="absolute inset-0 h-full w-full object-cover will-change-transform animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/80" />

        {/* Top bar */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-8 flex items-center justify-between">
          <Link
            to="/"
            data-testid="back-to-home"
            className="inline-flex items-center gap-2 text-sand-50/90 hover:text-sand-50 text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all journeys
          </Link>
          <CurrencyToggle variant="dark" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-20 min-h-[60svh] flex flex-col justify-end">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center rounded-full bg-sand-50/90 text-jungle-700 text-[11px] tracking-[0.18em] uppercase font-semibold px-3.5 py-1.5">
              {pkg.label}
            </span>
            {pkg.tagLabels.map((t) => (
              <span key={t} className="inline-flex items-center rounded-full border border-white/30 text-sand-50/90 text-[11px] tracking-[0.18em] uppercase px-3 py-1.5">
                {t}
              </span>
            ))}
          </div>
          <h1 className="font-display text-white text-5xl sm:text-6xl lg:text-[5.5rem] leading-[0.95] tracking-tight max-w-4xl">
            {pkg.title}
          </h1>
          <p className="mt-5 max-w-2xl text-white/85 text-lg md:text-xl italic font-display">
            {pkg.tagline}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-sand-50/80 text-sm">
            <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 text-clay-500" /> {pkg.durationLabel}</span>
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-clay-500" /> Across Sri Lanka</span>
            <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-clay-500" /> Private · your pace</span>
            <span className="inline-flex items-center gap-2"><Star className="h-4 w-4 text-clay-500 fill-clay-500" /> 5.0 rated</span>
          </div>

          <div className="mt-10 flex flex-wrap items-end gap-8">
            <div>
              <div className="text-[11px] tracking-[0.2em] uppercase text-sand-50/60">From</div>
              <div className="font-display text-white text-4xl md:text-5xl leading-none mt-1">
                {format(pkg.price)}
              </div>
              <div className="text-xs text-sand-50/60 mt-1">{pkg.priceNote}</div>
            </div>
            <a
              href={WHATSAPP_LINK(bookMessage)}
              target="_blank"
              rel="noreferrer"
              data-testid="hero-book-this"
              className="inline-flex items-center gap-2 rounded-full bg-clay-500 hover:bg-clay-600 text-white px-7 py-4 text-sm font-medium transition-all"
            >
              <MessageCircle className="h-4 w-4" /> Book this trip
            </a>
            <Link
              to="/#trip-builder"
              className="inline-flex items-center rounded-full border border-white/30 hover:border-white text-white/90 px-7 py-4 text-sm font-medium transition-all"
            >
              Customise it
            </Link>
          </div>
        </div>
      </section>

      {/* Intro + highlights */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-14">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4">
              The journey
            </p>
            <h2 className="font-display text-3xl md:text-4xl leading-[1.08] tracking-tight max-w-2xl">
              {pkg.blurb}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-sand-200 bg-sand-100 p-7">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay-500 mb-5">
                Highlights
              </div>
              <ul className="space-y-4">
                {pkg.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-[#111827] text-[15px]">
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-jungle-700 text-clay-500 flex-none">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Day-by-Day Accordion */}
      <section id="itinerary" className="bg-sand-100 py-20 md:py-24">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-3">
                Day by day
              </p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight">
                What happens, hour by hour.
              </h2>
            </div>
            <p className="text-[#4B5563] text-sm max-w-xs">
              Click any day to expand. Everything is flexible — this is a starting shape.
            </p>
          </div>

          <Accordion type="single" collapsible defaultValue="day-1" className="space-y-3" data-testid="itinerary-accordion">
            {pkg.itinerary.map((d) => (
              <AccordionItem
                key={d.day}
                value={`day-${d.day}`}
                data-testid={`itinerary-day-${d.day}`}
                className="rounded-2xl border border-sand-200 bg-sand-50 px-6 data-[state=open]:bg-sand-50 data-[state=open]:shadow-[0_22px_50px_-30px_rgba(26,54,45,0.35)]"
              >
                <AccordionTrigger className="py-5 hover:no-underline [&>svg]:text-clay-500">
                  <div className="flex items-center gap-5 text-left">
                    <span className="font-display text-3xl md:text-4xl text-clay-500 leading-none w-14 shrink-0">
                      {String(d.day).padStart(2, "0")}
                    </span>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.22em] text-[#4B5563]">Day {d.day}</div>
                      <div className="font-display text-xl md:text-2xl text-[#111827] leading-tight mt-0.5">{d.title}</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-[4.5rem] pb-6 pr-2">
                  <p className="text-[#4B5563] text-[15px] leading-relaxed">{d.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-100 border border-sand-200 px-3 py-1.5 text-[#4B5563]">
                      <span className="h-1.5 w-1.5 rounded-full bg-clay-500" /> Meals: {d.meals}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-100 border border-sand-200 px-3 py-1.5 text-[#4B5563]">
                      <span className="h-1.5 w-1.5 rounded-full bg-jungle-700" /> Stay: {d.stay}
                    </span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 md:py-24 bg-sand-50">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-3">
              What's included
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight max-w-2xl">
              Transparent, down to the last rupee.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8" data-testid="whats-included">
            <div className="rounded-2xl bg-jungle-700 text-sand-50 p-7 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-clay-500 text-sand-50">
                  <Check className="h-5 w-5" strokeWidth={2.5} />
                </span>
                <h3 className="font-display text-2xl">What's included</h3>
              </div>
              <ul className="space-y-3.5">
                {pkg.included.map((i) => (
                  <li key={i} className="flex items-start gap-3 text-sand-50/90 text-[15px]">
                    <Check className="h-4 w-4 text-clay-500 mt-1 flex-none" strokeWidth={2.5} />
                    {i}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-sand-100 border border-sand-200 p-7 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-clay-500/15 text-clay-500">
                  <Plus className="h-5 w-5" strokeWidth={2.5} />
                </span>
                <h3 className="font-display text-2xl">Extras (optional)</h3>
              </div>
              <ul className="space-y-3.5">
                {pkg.excluded.map((i) => (
                  <li key={i} className="flex items-start gap-3 text-[#4B5563] text-[15px]">
                    <Plus className="h-4 w-4 text-clay-500 mt-1 flex-none" strokeWidth={2.5} />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-jungle-700 text-sand-50 py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4">Ready when you are</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight">
            Make {pkg.title} your own.
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-sand-50/75">
            Message us on WhatsApp — tell us your dates, we'll check availability, tweak the
            itinerary, and send you a quote within 2 hours.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={WHATSAPP_LINK(bookMessage)}
              target="_blank"
              rel="noreferrer"
              data-testid="bottom-book-this"
              className="inline-flex items-center gap-2 rounded-full bg-clay-500 hover:bg-clay-600 text-white px-7 py-4 text-sm font-medium transition-all"
            >
              <MessageCircle className="h-4 w-4" /> Book this trip
            </a>
            <Link
              to="/#trip-builder"
              className="inline-flex items-center rounded-full border border-sand-50/40 hover:border-sand-50 text-sand-50 px-7 py-4 text-sm font-medium transition-all"
            >
              Customise it →
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Sticky Book This */}
      {showStickyCta && (
        <div
          data-testid="sticky-book-this"
          className="fixed bottom-0 inset-x-0 z-40 border-t border-sand-200 bg-sand-50/95 backdrop-blur-md px-6 py-3.5 md:py-4 animate-fade-up"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#4B5563]">{pkg.durationLabel} · from</div>
              <div className="font-display text-2xl md:text-3xl text-[#111827] leading-tight truncate">
                {format(pkg.price)} <span className="text-sm text-[#4B5563] font-sans not-italic">{pkg.priceNote}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:block"><CurrencyToggle variant="light" /></div>
              <a
                href={WHATSAPP_LINK(bookMessage)}
                target="_blank"
                rel="noreferrer"
                data-testid="sticky-book-btn"
                className="inline-flex items-center gap-2 rounded-full bg-clay-500 hover:bg-clay-600 text-white px-6 py-3 text-sm font-medium transition-all"
              >
                <MessageCircle className="h-4 w-4" /> Book this
              </a>
            </div>
          </div>
        </div>
      )}

      <FloatingWhatsapp />
    </main>
  );
}
