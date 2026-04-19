import { Mountain, Calendar, Car } from "lucide-react";

const STORY_STATS = [
  { icon: Mountain, label: "Born & raised in Badulla, hill country" },
  { icon: Car, label: "3+ years driving private guests across the island" },
  { icon: Calendar, label: "Every corner of Sri Lanka — driven, eaten, slept in" },
];

export default function Team() {
  return (
    <section
      id="team"
      data-testid="team-section"
      className="relative bg-sand-50 py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4 reveal">
            Meet the team
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight reveal">
            Friends from Badulla. One very well-loved car.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          <div className="lg:col-span-3 space-y-5 text-[#4B5563] text-[15px] md:text-base leading-relaxed reveal">
            <p>
              We're a small team of childhood friends from{" "}
              <span className="text-[#111827] font-medium">Badulla</span>, a small
              town tucked into the tea hills of Sri Lanka's Uva province. We rode the
              same Ella-to-Kandy train on weekends to visit cousins, and spent every
              school holiday exploring a new corner of the island — usually crammed
              into a dad's old Nissan with too many aunties.
            </p>
            <p>
              By the time we finished school we'd basically driven the whole country:
              up to Jaffna for kool, down to Mirissa for stilt fishermen, east to
              Arugam Bay the week before surf season, west for crab in Negombo. What
              started as a habit became the thing we loved most — showing
              friends-of-friends around, picking them up from the airport at 3am,
              taking the long way home past the best kottu shop nobody tells
              tourists about.
            </p>
            <p>
              So <span className="text-[#111827] font-medium">three years ago</span>{" "}
              we decided to just do it properly. We bought a comfortable car, got
              our tour licences, built this little site, and started driving
              travellers the way we drive our own friends: no rushed schedules, no
              group buses, no commission-taking detours to gem shops. Just us, one
              air-conditioned car, and whatever corner of Sri Lanka you want to see
              next.
            </p>
            <p className="text-[#111827] font-medium">
              If you book with us, you're not hiring a company. You're asking a
              Badulla-born friend to drive you around his country — and he's pretty
              happy to.
            </p>
          </div>

          <div className="lg:col-span-2 reveal">
            <div className="rounded-2xl border border-sand-200 bg-sand-100 p-6 md:p-7 space-y-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-clay-500 font-semibold">
                The basics
              </p>
              {STORY_STATS.map((s) => {
                const Ic = s.icon;
                return (
                  <div key={s.label} className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-jungle-700 text-clay-500">
                      <Ic className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <p className="text-[#111827] text-sm leading-snug pt-1.5">{s.label}</p>
                  </div>
                );
              })}
              <div className="pt-3 border-t border-sand-200 text-xs text-[#4B5563] leading-relaxed">
                Every booking goes directly to us — not a reseller. You'll chat with
                one of us on WhatsApp, and one of us will be the person picking you up.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
