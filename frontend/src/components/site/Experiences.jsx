import { EXPERIENCES } from "@/lib/siteData";

export default function Experiences() {
  return (
    <section
      id="experiences"
      data-testid="experiences-section"
      className="relative bg-jungle-700 text-sand-50 py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4 reveal">
              Moments, not places
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-sand-50 max-w-3xl reveal">
              Eight things you'll remember when Instagram is dead.
            </h2>
          </div>
          <p className="text-sand-50/70 max-w-sm text-base reveal">
            Not a list of temples. These are the feelings our guests keep bringing up a year later.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {EXPERIENCES.map((e, i) => (
            <article
              key={e.title}
              data-testid={`experience-card-${i}`}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-jungle-800 reveal"
              style={{ transitionDelay: `${(i % 4) * 80}ms` }}
            >
              <img
                src={e.image}
                alt={e.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110 brightness-[0.88] group-hover:brightness-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-jungle-900 via-jungle-900/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display text-xl md:text-[1.4rem] leading-tight text-sand-50">
                  {e.title}
                </h3>
                <p className="mt-2 text-sand-50/70 text-[13px] leading-snug line-clamp-2 transition-all duration-500 max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100">
                  {e.caption}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
