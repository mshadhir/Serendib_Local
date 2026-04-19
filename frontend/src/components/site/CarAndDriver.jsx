import { Link } from "react-router-dom";
import { Plane, Map, MessageCircle, HeartHandshake, ArrowUpRight } from "lucide-react";
import { PILLARS, VEHICLES, CAR_AND_DRIVER_HERO } from "@/lib/carAndDriver";
import { WHATSAPP_LINK } from "@/lib/siteData";

const ICONS = { Plane, Map, MessageCircle, HeartHandshake };

export default function CarAndDriver() {
  return (
    <section
      id="car-and-driver"
      data-testid="car-and-driver-section"
      className="relative bg-sand-50 py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-start">
        {/* Left image column */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 reveal">
          <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-jungle-900 shadow-[0_30px_80px_-40px_rgba(26,54,45,0.4)]">
            <img
              src={CAR_AND_DRIVER_HERO.image}
              alt="Sri Lanka winding road"
              className="h-full w-full object-cover transition-transform duration-[1800ms] hover:scale-[1.04]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-jungle-900/70 via-transparent to-transparent" />
            <div className="absolute left-5 bottom-5 right-5 text-sand-50">
              <div className="text-[11px] uppercase tracking-[0.22em] text-clay-500 mb-2">From USD 65/day</div>
              <div className="font-display text-3xl md:text-4xl leading-tight">
                A private car, a trusted driver, and the whole island.
              </div>
            </div>
          </div>

          {/* Compact pricing tiers */}
          <div className="mt-6 rounded-2xl border border-sand-200 bg-sand-50 p-6">
            <div className="text-[11px] uppercase tracking-[0.22em] text-clay-500 mb-4">From per day</div>
            <div className="space-y-3">
              {VEHICLES.map((v) => (
                <div
                  key={v.slug}
                  data-testid={`car-tier-preview-${v.slug}`}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <div className="text-[#111827] font-medium">{v.name}</div>
                    <div className="text-[#4B5563] text-xs">{v.seats}</div>
                  </div>
                  <div className="font-display text-2xl text-jungle-700">${v.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right pillars column */}
        <div className="lg:col-span-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-5 reveal">
            {CAR_AND_DRIVER_HERO.eyebrow}
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight max-w-2xl reveal">
            {CAR_AND_DRIVER_HERO.title}
            <span className="block italic text-jungle-700">We'll handle the rest.</span>
          </h2>
          <p className="mt-6 max-w-xl text-[#4B5563] text-base md:text-lg leading-relaxed reveal">
            {CAR_AND_DRIVER_HERO.sub}
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-8">
            {PILLARS.map((p, i) => {
              const Icon = ICONS[p.icon] || Plane;
              return (
                <div key={p.title} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-jungle-700 text-clay-500">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-5 font-display text-2xl text-[#111827] leading-tight">{p.title}</h3>
                  <p className="mt-3 text-[#4B5563] text-[15px] leading-relaxed">{p.body}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex flex-wrap gap-4 reveal">
            <Link
              to="/car-and-driver"
              data-testid="car-and-driver-learn-more"
              className="inline-flex items-center gap-2 rounded-full bg-jungle-700 hover:bg-jungle-800 text-sand-50 px-7 py-4 text-sm font-medium transition-all"
            >
              See full details <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a
              href={WHATSAPP_LINK("Hi! I'd like a private car + driver in Sri Lanka — can you tell me more?")}
              target="_blank"
              rel="noreferrer"
              data-testid="car-and-driver-whatsapp"
              className="inline-flex items-center gap-2 rounded-full border border-jungle-700 text-jungle-700 hover:bg-jungle-700 hover:text-sand-50 px-7 py-4 text-sm font-medium transition-all"
            >
              <MessageCircle className="h-4 w-4" /> Get a quote on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
