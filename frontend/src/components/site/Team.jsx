import { MapPin, Mail } from "lucide-react";
import { TEAM, BRAND } from "@/lib/siteData";

export default function Team() {
  return (
    <section
      id="team"
      data-testid="team-section"
      className="relative bg-sand-50 py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4 reveal">
            Meet the team
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight reveal">
            The two people who'll actually plan your trip.
          </h2>
          <p className="mt-6 text-[#4B5563] text-base md:text-lg max-w-2xl reveal">
            No sales team, no call centre. You'll message us directly — and we'll message you back
            from a tuk-tuk somewhere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          {TEAM.map((m, i) => (
            <article
              key={m.name}
              data-testid={`team-card-${m.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="group reveal"
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-sand-200">
                <img
                  src={m.image}
                  alt={m.name}
                  className="h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-[1.06]"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-sand-50/90 backdrop-blur text-jungle-700 text-[11px] tracking-[0.18em] uppercase font-semibold px-3.5 py-1.5">
                    {m.role}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <h3 className="font-display text-3xl md:text-4xl leading-tight text-[#111827]">
                    {m.name}
                  </h3>
                  <p className="mt-1 text-clay-500 text-sm tracking-wide">{m.role}</p>
                </div>
                <div className="flex items-center gap-4 text-[#4B5563] text-xs">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {BRAND.location}
                  </span>
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="inline-flex items-center gap-1.5 hover:text-clay-500"
                  >
                    <Mail className="h-3.5 w-3.5" /> say hi
                  </a>
                </div>
              </div>
              <p className="mt-5 text-[#4B5563] text-[15px] leading-relaxed max-w-md">{m.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
