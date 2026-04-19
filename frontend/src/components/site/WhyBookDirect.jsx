import { Check, X, Handshake, Wallet } from "lucide-react";

const POINTS = [
  {
    icon: Wallet,
    title: "Skip the 25% middleman",
    body: "Viator, GetYourGuide and booking platforms add a commission we don't charge. You pay the driver-guide, not a platform.",
  },
  {
    icon: Handshake,
    title: "Talk to the person driving",
    body: "No call centres. The person who replies on WhatsApp is the same person you'll be on the road with.",
  },
  {
    icon: Check,
    title: "Customise anything, for free",
    body: "Want to add an extra day? Skip a temple? Swap hotels? No change fees. We just redo the math.",
  },
];

export default function WhyBookDirect() {
  return (
    <section
      id="why-direct"
      data-testid="why-book-direct"
      className="relative bg-sand-100 py-20 md:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4 reveal">
              Why book direct
            </p>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.04] tracking-tight reveal">
              The same trip, <span className="italic">25% cheaper.</span>
            </h2>
            <p className="mt-5 text-[#4B5563] text-base md:text-lg max-w-md reveal">
              Platforms like Viator and big tour agencies add huge commissions and layers of sales
              reps between you and the road. With us, you just get us.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {POINTS.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="rounded-2xl border border-sand-200 bg-sand-50 p-7 hover:-translate-y-1 hover:shadow-[0_22px_50px_-30px_rgba(26,54,45,0.35)] transition-all duration-500 reveal"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-jungle-700 text-clay-500">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-5 font-display text-2xl text-[#111827] leading-tight">{p.title}</h3>
                  <p className="mt-3 text-[#4B5563] text-[15px] leading-relaxed">{p.body}</p>
                </div>
              );
            })}

            <div
              className="sm:col-span-2 rounded-2xl bg-jungle-700 text-sand-50 p-7 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5 reveal"
              style={{ transitionDelay: "240ms" }}
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-clay-500 text-sand-50 flex-none">
                  <X className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <div>
                  <p className="font-display text-xl md:text-2xl leading-tight">
                    What you won't get:
                  </p>
                  <p className="text-sand-50/75 text-sm mt-1.5">
                    Hidden fees · pushy upsells · 6am group bus tours · call-centre agents who
                    have never set foot in Sri Lanka.
                  </p>
                </div>
              </div>
              <a
                href="#trip-builder"
                data-testid="why-direct-cta"
                className="shrink-0 inline-flex items-center justify-center rounded-full bg-sand-50 hover:bg-clay-500 hover:text-sand-50 text-jungle-700 px-6 py-3 text-sm font-medium transition-all"
              >
                Start my trip →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
