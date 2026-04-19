import { WHY_US } from "@/lib/siteData";

export default function WhyUs() {
  return (
    <section
      id="why-us"
      data-testid="why-us-section"
      className="relative bg-sand-50 py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-start">
        {/* Image column */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 reveal">
          <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-sand-100 shadow-[0_30px_80px_-40px_rgba(26,54,45,0.35)]">
            <img
              src={WHY_US.image}
              alt="Local Sri Lankan meal"
              className="h-full w-full object-cover transition-transform duration-[1800ms] hover:scale-[1.04]"
              loading="lazy"
            />
          </div>
          <div className="mt-6 ml-4 max-w-sm text-sm text-[#4B5563] italic font-display">
            "Rice &amp; curry — the first meal almost every guest falls in love with."
          </div>
        </div>

        {/* Pillars column */}
        <div className="lg:col-span-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-5 reveal">
            Why Serendib Local
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-[#111827] max-w-2xl reveal">
            We're not a tour agency.
            <span className="block italic text-jungle-700"> We're your local friends.</span>
          </h2>
          <p className="mt-6 max-w-xl text-[#4B5563] text-base md:text-lg leading-relaxed reveal">
            After 12 years showing friends-of-friends around the island, we realised most tour
            companies sell Sri Lanka the way it looks on Instagram — not the way it actually feels.
            So we built the opposite.
          </p>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-10">
            {WHY_US.pillars.map((p, i) => (
              <div key={p.title} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="flex items-start gap-4">
                  <span className="mt-2 font-display text-3xl text-clay-500 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl md:text-[1.7rem] text-[#111827] leading-tight">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-[#4B5563] text-[15px] leading-relaxed">{p.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
