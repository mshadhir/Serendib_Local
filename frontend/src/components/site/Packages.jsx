import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, CreditCard } from "lucide-react";
import { PACKAGES } from "@/lib/packages";
import { useCurrency } from "@/context/CurrencyContext";
import CurrencyToggle from "@/components/site/CurrencyToggle";
import BookNowModal from "@/components/site/BookNowModal";
import TrustInline from "@/components/site/TrustInline";

export default function Packages() {
  const { format } = useCurrency();
  const [bookPkg, setBookPkg] = useState(null);

  return (
    <section
      id="packages"
      data-testid="packages-section"
      className="relative bg-sand-100 py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4 reveal">
              Signature packages
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight max-w-2xl reveal">
              Three hand-built journeys. Bookable today.
            </h2>
          </div>
          <div className="flex flex-col gap-3 items-start lg:items-end reveal">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#4B5563]">Show prices in</span>
            <CurrencyToggle variant="light" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" data-testid="packages-grid">
          {PACKAGES.map((p, i) => (
            <article
              key={p.slug}
              data-testid={`package-card-${p.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-sand-50 border border-sand-200 flex flex-col reveal hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(26,54,45,0.35)] transition-all duration-500"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <Link to={`/packages/${p.slug}`} className="relative aspect-[4/3] bg-jungle-900 block">
                <img
                  src={p.image}
                  alt={p.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <span className="inline-flex items-center rounded-full bg-sand-50/95 backdrop-blur text-jungle-700 text-[11px] tracking-[0.18em] uppercase font-semibold px-3.5 py-1.5">
                    {p.label}
                  </span>
                  <span className="text-white/85 text-xs tracking-widest uppercase">{p.durationLabel}</span>
                </div>
              </Link>

              <div className="p-7 flex flex-col flex-1">
                <h3 className="font-display text-[1.75rem] leading-tight text-[#111827]">{p.title}</h3>
                <p className="mt-2 text-[#4B5563] text-sm leading-relaxed line-clamp-3">{p.blurb}</p>

                <div className="mt-5 flex items-baseline gap-2 border-t border-sand-200 pt-4">
                  <span className="text-xs text-[#4B5563]">From</span>
                  <span className="font-display text-3xl text-jungle-700">{format(p.price)}</span>
                  <span className="text-xs text-[#4B5563]">per person</span>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setBookPkg(p)}
                    data-testid={`package-book-${p.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-clay-500 hover:bg-clay-600 text-white px-6 py-3 text-sm font-medium transition-all"
                  >
                    <CreditCard className="h-4 w-4" /> Book Now
                  </button>
                  <Link
                    to={`/packages/${p.slug}`}
                    data-testid={`package-view-${p.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm text-jungle-700 hover:text-clay-500 transition-colors"
                  >
                    View itinerary <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="mt-4">
                  <TrustInline variant="light" />
                </div>
              </div>
            </article>
          ))}

          {/* Custom Plan card */}
          <a
            href="#trip-builder"
            data-testid="package-card-custom"
            className="group relative rounded-2xl overflow-hidden bg-jungle-700 border-2 border-dashed border-sand-50/30 hover:border-clay-500 transition-all reveal flex flex-col justify-between p-7 md:p-8 min-h-[420px]"
            style={{ transitionDelay: `${PACKAGES.length * 80}ms` }}
          >
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 20%, #C05A45 0, transparent 35%), radial-gradient(circle at 80% 90%, #F9F6F0 0, transparent 40%)",
              }}
            />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-clay-500 text-sand-50 text-[11px] tracking-[0.18em] uppercase font-semibold px-3.5 py-1.5">
                <Sparkles className="h-3 w-3" />
                Build your own
              </span>
            </div>
            <div className="relative text-sand-50">
              <h3 className="font-display text-4xl md:text-5xl leading-[0.95] tracking-tight">
                Design <span className="italic">your own</span> journey.
              </h3>
              <p className="mt-4 text-sand-50/80 text-[15px] leading-relaxed max-w-sm">
                Don't see the perfect shape? Pick your interests, days and dates — we'll build it from scratch. Same price, same care.
              </p>
              <div className="mt-6 inline-flex items-center gap-1.5 text-sm text-clay-500 group-hover:text-sand-50 transition-colors">
                Start the trip builder <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </a>
        </div>
      </div>

      <BookNowModal open={!!bookPkg} onOpenChange={(v) => !v && setBookPkg(null)} pkg={bookPkg} />
    </section>
  );
}
