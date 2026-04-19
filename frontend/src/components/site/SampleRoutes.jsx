import { ArrowUpRight } from "lucide-react";
import { SAMPLE_ROUTES } from "@/lib/carAndDriver";
import { WHATSAPP_LINK } from "@/lib/siteData";

export default function SampleRoutes() {
  return (
    <section
      id="routes"
      data-testid="sample-routes-section"
      className="relative bg-sand-100 py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-14 max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4 reveal">
            Need inspiration?
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight reveal">
            Three routes our guests keep picking.
          </h2>
          <p className="mt-5 text-[#4B5563] text-base md:text-lg max-w-2xl reveal">
            Use them as a starting point — then swap, add, remove as you go. Your driver adjusts in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" data-testid="sample-routes-grid">
          {SAMPLE_ROUTES.map((r, i) => (
            <article
              key={r.title}
              data-testid={`sample-route-${i}`}
              className="group rounded-2xl overflow-hidden border border-sand-200 bg-sand-50 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(26,54,45,0.35)] transition-all duration-500 reveal"
              style={{ transitionDelay: `${i * 80}ms` }}
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
                <p className="mt-3 text-[#4B5563] text-xs leading-relaxed">{r.stops.join(" → ")}</p>
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
  );
}
