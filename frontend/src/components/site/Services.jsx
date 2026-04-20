import { useState } from "react";
import { Plane, MapPin, Sparkles, MessageCircle, CreditCard } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/siteData";
import { ROAD_TRIP_PACKAGE } from "@/lib/packages";
import BookNowModal from "@/components/site/BookNowModal";
import QuickBookModal from "@/components/site/QuickBookModal";
import TrustInline from "@/components/site/TrustInline";
import { useCMS } from "@/context/ContentContext";

const ICON_MAP = { Plane, MapPin, Sparkles };

const FALLBACK_SERVICES = [
  {
    slug: "airport-transfer", icon: "Plane", title: "Airport Transfer",
    desc: "Stress-free pickup or drop-off from Bandaranaike International Airport.",
    price: "From $35", cta: "quickbook", mode: "airport",
  },
  {
    slug: "day-tour", icon: "MapPin", title: "Private Day Tour",
    desc: "Pick any destination — Sigiriya, Kandy, Galle, Ella.",
    price: "From $85 per day", cta: "quickbook", mode: "dayTour",
  },
  {
    slug: "road-trip", icon: "Sparkles", title: "Fully Handled Road Trip",
    desc: "Car, driver, AND accommodation all sorted by us.",
    price: "From $150 per day, all inclusive", cta: "book", badge: "Most Popular",
  },
];

export default function Services() {
  const [bookOpen, setBookOpen] = useState(false);
  const [quickMode, setQuickMode] = useState(null); // 'airport' | 'dayTour' | null
  const cmsServices = useCMS("services");
  const SERVICES = cmsServices?.length ? cmsServices : FALLBACK_SERVICES;

  return (
    <section id="services" data-testid="services-section" className="relative bg-sand-50 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-14 max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4 reveal">
            Three ways to ride with us
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight reveal">
            Quick transfer. Full road trip. Or anything in between.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" data-testid="services-grid">
          {SERVICES.map((s, i) => {
            const Icon = ICON_MAP[s.icon] || Sparkles;
            const isPopular = s.slug === "road-trip" || s.popular;
            const handleClick = () => {
              if (s.cta === "quickbook") setQuickMode(s.mode);
              else setBookOpen(true);
            };
            return (
              <article
                key={s.slug}
                data-testid={`service-card-${s.slug}`}
                className={`relative rounded-2xl p-7 md:p-8 flex flex-col reveal transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(26,54,45,0.4)] ${
                  isPopular
                    ? "bg-jungle-700 text-sand-50 border border-jungle-600"
                    : "bg-sand-50 text-[#111827] border border-sand-200"
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {s.badge && (
                  <span className="absolute -top-3 left-7 inline-flex items-center rounded-full bg-[#25D366] text-white text-[11px] tracking-[0.18em] uppercase font-semibold px-3.5 py-1.5">
                    {s.badge}
                  </span>
                )}
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${isPopular ? "bg-clay-500 text-sand-50" : "bg-jungle-700 text-clay-500"}`}>
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h3 className={`mt-6 font-display text-[1.75rem] md:text-3xl leading-tight ${isPopular ? "text-sand-50" : "text-[#111827]"}`}>
                  {s.title}
                </h3>
                <p className={`mt-3 text-[15px] leading-relaxed flex-1 ${isPopular ? "text-sand-50/80" : "text-[#4B5563]"}`}>
                  {s.desc}
                </p>
                <div className="mt-6">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-clay-500">Price</div>
                  <div className={`font-display text-2xl mt-1 ${isPopular ? "text-sand-50" : "text-[#111827]"}`}>{s.price}</div>
                </div>

                <button
                  onClick={handleClick}
                  data-testid={`service-cta-${s.slug}`}
                  className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all ${
                    isPopular
                      ? "bg-clay-500 hover:bg-clay-600 text-white"
                      : "bg-jungle-700 hover:bg-jungle-800 text-sand-50"
                  }`}
                >
                  <CreditCard className="h-4 w-4" /> Book Now
                </button>

                <a
                  href={`https://wa.me/${String(process.env.REACT_APP_WHATSAPP_NUMBER || "94716797971").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi! Can you send me a custom quote for ${s.title}?`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-3 inline-flex items-center justify-center gap-1.5 text-xs underline underline-offset-4 ${isPopular ? "text-sand-50/75 hover:text-sand-50" : "text-[#4B5563] hover:text-jungle-700"}`}
                >
                  <MessageCircle className="h-3 w-3" /> or ask for a custom quote
                </a>

                <div className="mt-4">
                  <TrustInline variant={isPopular ? "dark" : "light"} />
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <BookNowModal open={bookOpen} onOpenChange={setBookOpen} pkg={{ ...ROAD_TRIP_PACKAGE }} />
      <QuickBookModal
        open={!!quickMode}
        onOpenChange={(v) => !v && setQuickMode(null)}
        mode={quickMode || "airport"}
      />
    </section>
  );
}
