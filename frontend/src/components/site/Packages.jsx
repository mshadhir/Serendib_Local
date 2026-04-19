import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { PACKAGES } from "@/lib/packages";
import { useCurrency } from "@/context/CurrencyContext";
import PackageFilters from "@/components/site/PackageFilters";
import CurrencyToggle from "@/components/site/CurrencyToggle";

export default function Packages() {
  const [duration, setDuration] = useState("all");
  const [types, setTypes] = useState([]);
  const { format } = useCurrency();

  const toggleType = (id) =>
    setTypes((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  const filtered = useMemo(() => {
    return PACKAGES.filter((p) => {
      if (duration !== "all" && p.durationGroup !== duration) return false;
      if (types.length > 0 && !types.some((t) => p.tags.includes(t))) return false;
      return true;
    });
  }, [duration, types]);

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
              Signature journeys
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight max-w-2xl reveal">
              Four shapes. Infinite variations.
            </h2>
          </div>
          <div className="flex flex-col gap-3 items-start lg:items-end reveal">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#4B5563]">Show prices in</span>
            <CurrencyToggle variant="light" />
          </div>
        </div>

        <PackageFilters
          duration={duration}
          setDuration={setDuration}
          types={types}
          toggleType={toggleType}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" data-testid="packages-grid">
          {filtered.map((p, i) => (
            <Link
              key={p.slug}
              to={`/packages/${p.slug}`}
              data-testid={`package-card-${p.slug}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-jungle-900 reveal block"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <img
                src={p.image}
                alt={p.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

              <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
                <span className="inline-flex items-center rounded-full bg-sand-50/90 backdrop-blur text-jungle-700 text-[11px] tracking-[0.18em] uppercase font-semibold px-3.5 py-1.5">
                  {p.label}
                </span>
                <span className="text-white/80 text-xs tracking-widest uppercase">{p.durationLabel}</span>
              </div>

              <div className="absolute left-0 right-0 bottom-0 p-6 md:p-7 text-white">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {p.tagLabels.map((t) => (
                    <span key={t} className="text-[10px] uppercase tracking-[0.18em] text-white/70 border border-white/25 rounded-full px-2.5 py-1">
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="font-display text-3xl md:text-[2.1rem] leading-tight">{p.title}</h3>
                <p className="mt-2 text-white/75 text-sm leading-relaxed line-clamp-2">{p.blurb}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-clay-500/95">
                    From <span className="text-white font-medium font-display text-lg">{format(p.price)}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-white group-hover:text-clay-500 transition-colors">
                    View itinerary <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* Custom Plan card — always visible */}
          <a
            href="#trip-builder"
            data-testid="package-card-custom"
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-jungle-700 border-2 border-dashed border-sand-50/30 hover:border-clay-500 transition-all reveal flex flex-col justify-between p-7 md:p-8"
            style={{ transitionDelay: `${filtered.length * 80}ms` }}
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none"
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
                Don't see the perfect shape? Pick your interests, days and dates — we'll build it
                from scratch. Same price, same care.
              </p>
              <div className="mt-6 inline-flex items-center gap-1.5 text-sm text-clay-500 group-hover:text-sand-50 transition-colors">
                Start the trip builder <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </a>

          {filtered.length === 0 && (
            <div className="md:col-span-2 lg:col-span-2 rounded-2xl border border-dashed border-sand-200 p-10 text-center text-[#4B5563]">
              <p className="font-display text-2xl text-[#111827]">No journeys match those filters.</p>
              <p className="mt-2 text-sm">Try removing a filter — or{" "}
                <a href="#trip-builder" className="underline underline-offset-4 text-jungle-700">build a custom trip</a>.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
