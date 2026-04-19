import { Star, Quote } from "lucide-react";
import { REVIEWS } from "@/lib/siteData";
import { useCMS } from "@/context/ContentContext";

export default function Reviews() {
  const cmsReviews = useCMS("reviews");
  const items = cmsReviews?.length ? cmsReviews : REVIEWS;
  return (
    <section
      id="reviews"
      data-testid="reviews-section"
      className="relative bg-sand-100 py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4 reveal">
              Stories from the road
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight reveal">
              Real guests. Real trips. <span className="italic">We never edit these.</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 reveal">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-clay-500 text-clay-500" />
              ))}
            </div>
            <span className="text-sm text-[#4B5563]">
              4.98 average · 120+ verified reviews
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {items.map((r, i) => (
            <article
              key={r.name}
              data-testid={`review-card-${i}`}
              className="relative bg-sand-50 border border-sand-200 rounded-2xl p-8 md:p-9 flex flex-col hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(26,54,45,0.4)] transition-all duration-500 reveal"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <Quote className="h-8 w-8 text-clay-500 mb-6" strokeWidth={1.4} />
              <p className="font-display text-[1.35rem] md:text-2xl leading-[1.35] text-[#111827] flex-1">
                "{r.quote}"
              </p>
              <div className="mt-8 pt-6 border-t border-sand-200">
                <div className="flex mb-2">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-clay-500 text-clay-500" />
                  ))}
                </div>
                <div className="text-[#111827] font-medium">{r.name}</div>
                <div className="text-[#4B5563] text-xs mt-0.5">{r.origin}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
