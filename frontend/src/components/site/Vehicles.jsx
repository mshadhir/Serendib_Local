import { Check, Car, Truck, Bus, MessageCircle } from "lucide-react";
import { VEHICLES, INCLUDED_PER_DAY } from "@/lib/carAndDriver";
import { WHATSAPP_LINK } from "@/lib/siteData";

const ICONS = { sedan: Car, suv: Truck, van: Bus };

export default function Vehicles() {
  return (
    <section
      id="vehicles"
      data-testid="vehicles-section"
      className="relative bg-sand-50 py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-14 max-w-3xl reveal">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4">
            Vehicles &amp; pricing
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight">
            Three vehicles. One all-in daily rate.
          </h2>
          <p className="mt-5 text-[#4B5563] text-base md:text-lg max-w-2xl">
            No hidden fees. Prices include everything in the list below — just multiply by your number of days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" data-testid="vehicle-tiers">
          {VEHICLES.map((v, i) => {
            const Icon = ICONS[v.slug] || Car;
            return (
              <article
                key={v.slug}
                data-testid={`vehicle-tier-${v.slug}`}
                className="relative rounded-2xl border border-sand-200 bg-sand-50 p-8 flex flex-col hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(26,54,45,0.4)] transition-all duration-500 reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
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

        {/* Included per day */}
        <div className="mt-14 rounded-2xl bg-jungle-700 text-sand-50 p-8 md:p-10 reveal">
          <div className="flex flex-col md:flex-row md:items-start gap-10">
            <div className="md:w-1/3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-3">What's in that daily rate</p>
              <h3 className="font-display text-3xl md:text-4xl leading-tight">Everything, actually.</h3>
              <p className="mt-4 text-sand-50/75 text-sm">
                No surprise fuel charges, no driver's-lunch extras, no parking tickets added at the end. One price, all-in.
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
  );
}
