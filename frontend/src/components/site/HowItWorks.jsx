import { ClipboardList, Calendar, Plane, Map } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardList,
    n: "01",
    title: "Tell us your dates & vibe",
    body: "A quick WhatsApp or form — how many days, what kind of traveller you are, any must-sees. 40 seconds tops.",
  },
  {
    icon: Calendar,
    n: "02",
    title: "We plan a rough route",
    body: "We suggest a flexible outline with hotel options at every budget. You tweak until it feels like your trip.",
  },
  {
    icon: Plane,
    n: "03",
    title: "Airport pickup, day one",
    body: "Your driver meets you at arrivals with your name on a sign. Cold water. Comfortable car. Off we go.",
  },
  {
    icon: Map,
    n: "04",
    title: "Explore at your pace",
    body: "Change the plan any morning. Stay an extra night. Skip a stop. Your driver reshuffles everything in real time.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      data-testid="how-it-works-section"
      className="relative bg-sand-100 py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-14 max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4 reveal">
            How it works
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight reveal">
            From first message to wheels-on-the-road in under 48 hours.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.n}
                data-testid={`how-step-${i}`}
                className="relative rounded-2xl border border-sand-200 bg-sand-50 p-7 hover:-translate-y-1 hover:shadow-[0_22px_50px_-30px_rgba(26,54,45,0.35)] transition-all duration-500 reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-jungle-700 text-clay-500">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <span className="font-display text-3xl text-clay-500 leading-none">{s.n}</span>
                </div>
                <h3 className="mt-5 font-display text-2xl text-[#111827] leading-tight">{s.title}</h3>
                <p className="mt-3 text-[#4B5563] text-[15px] leading-relaxed">{s.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
