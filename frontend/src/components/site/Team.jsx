import { Mountain, Calendar, Car } from "lucide-react";
import { useCMS } from "@/context/ContentContext";

const STATS_ICONS = [Mountain, Car, Calendar];

const FALLBACK = {
  eyebrow: "Meet the team",
  heading: "Friends from Badulla. One very well-loved car.",
  paragraph_1: "",
  paragraph_2: "",
  paragraph_3: "",
  paragraph_4: "",
  basic_1: "Born & raised in Badulla, hill country",
  basic_2: "3+ years driving private guests across the island",
  basic_3: "Every corner of Sri Lanka — driven, eaten, slept in",
  footer_note: "",
};

export default function Team() {
  const cms = useCMS("team_section") || {};
  const s = { ...FALLBACK, ...cms };
  const paragraphs = [s.paragraph_1, s.paragraph_2, s.paragraph_3, s.paragraph_4].filter(Boolean);
  const basics = [s.basic_1, s.basic_2, s.basic_3].filter(Boolean);

  return (
    <section
      id="team"
      data-testid="team-section"
      className="relative bg-sand-50 py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4 reveal">
            {s.eyebrow}
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight reveal">
            {s.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          <div className="lg:col-span-3 space-y-5 text-[#4B5563] text-[15px] md:text-base leading-relaxed reveal">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                data-testid={`team-paragraph-${i + 1}`}
                className={i === paragraphs.length - 1 ? "text-[#111827] font-medium" : ""}
              >
                {p}
              </p>
            ))}
          </div>

          <div className="lg:col-span-2 reveal">
            <div className="rounded-2xl border border-sand-200 bg-sand-100 p-6 md:p-7 space-y-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-clay-500 font-semibold">
                The basics
              </p>
              {basics.map((label, i) => {
                const Ic = STATS_ICONS[i] || Mountain;
                return (
                  <div key={i} className="flex items-start gap-3" data-testid={`team-basic-${i + 1}`}>
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-jungle-700 text-clay-500">
                      <Ic className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <p className="text-[#111827] text-sm leading-snug pt-1.5">{label}</p>
                  </div>
                );
              })}
              {s.footer_note && (
                <div
                  data-testid="team-footer-note"
                  className="pt-3 border-t border-sand-200 text-xs text-[#4B5563] leading-relaxed"
                >
                  {s.footer_note}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
