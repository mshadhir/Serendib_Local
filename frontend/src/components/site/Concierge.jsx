import { Hotel, Utensils, Camera, Languages, ShieldAlert, CircleDollarSign } from "lucide-react";
import { CONCIERGE_SERVICES } from "@/lib/carAndDriver";

const ICONS = { Hotel, Utensils, Camera, Languages, ShieldAlert, CircleDollarSign };

export default function Concierge() {
  return (
    <section
      id="concierge"
      data-testid="concierge-section"
      className="relative bg-sand-50 py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-14 max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4 reveal">
            More than a driver
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight reveal">
            Your driver is also your…
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="concierge-grid">
          {CONCIERGE_SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon] || Hotel;
            return (
              <div
                key={s.title}
                data-testid={`concierge-card-${i}`}
                className="rounded-2xl border border-sand-200 bg-sand-50 p-7 hover:-translate-y-1 hover:shadow-[0_20px_45px_-28px_rgba(26,54,45,0.35)] transition-all duration-500 reveal"
                style={{ transitionDelay: `${(i % 3) * 80}ms` }}
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
  );
}
