import { ArrowUpRight } from "lucide-react";
import { BLOG } from "@/lib/siteData";

export default function Blog() {
  return (
    <section
      id="blog"
      data-testid="blog-section"
      className="relative bg-sand-50 py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4 reveal">
              Local-written travel guide
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight max-w-2xl reveal">
              Honest reads before you book.
            </h2>
          </div>
          <a
            href="#"
            data-testid="blog-see-all"
            className="inline-flex items-center gap-2 text-sm text-jungle-700 hover:text-clay-500 transition-colors self-start md:self-auto reveal"
          >
            See all articles <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {BLOG.map((b, i) => (
            <article
              key={b.title}
              data-testid={`blog-card-${i}`}
              className="group cursor-pointer reveal"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-sand-200">
                <img
                  src={b.image}
                  alt={b.title}
                  className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.08]"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center rounded-full bg-sand-50/90 backdrop-blur text-jungle-700 text-[10px] tracking-[0.2em] uppercase font-semibold px-3 py-1.5">
                    {b.tag}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-display text-2xl md:text-[1.75rem] leading-tight text-[#111827] group-hover:text-clay-500 transition-colors">
                  {b.title}
                </h3>
                <p className="mt-3 text-[#4B5563] text-[15px] leading-relaxed line-clamp-2">
                  {b.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-[#4B5563]">
                  <span className="uppercase tracking-widest">{b.read}</span>
                  <span className="inline-flex items-center gap-1 text-jungle-700 group-hover:text-clay-500">
                    Read article <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
