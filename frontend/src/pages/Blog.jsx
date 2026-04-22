import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import FloatingWhatsapp from "@/components/site/FloatingWhatsapp";
import SEO from "@/components/site/SEO";
import { useCMS, useSettings } from "@/context/ContentContext";
import useReveal from "@/hooks/useReveal";

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function Blog() {
  const posts = useCMS("blog_posts") || [];
  const settings = useSettings();
  useReveal();

  // Sort: newest published_at first; fall back to order.
  const sorted = [...posts].sort((a, b) => {
    const ad = Date.parse(a.published_at || "") || 0;
    const bd = Date.parse(b.published_at || "") || 0;
    if (ad !== bd) return bd - ad;
    return (a.order ?? 999) - (b.order ?? 999);
  });

  return (
    <main className="relative bg-sand-50 text-[#111827]" data-testid="blog-page">
      <SEO
        title={`Blog — ${settings.brand_name || "Serendib Local"}`}
        description="Stories, tips and honest guides from our Sri Lanka — written by your local drivers."
        path="/blog"
      />
      <Navbar />

      <section className="pt-40 pb-16 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4">
            From the road
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.98] tracking-tight">
            Stories, tips &amp; honest guides <span className="italic text-[#4B5563]">from our Sri Lanka.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[#4B5563] text-base md:text-lg">
            Written by the people behind the wheel. No sponsored posts, no affiliate links —
            just the stuff we'd tell you over a cup of tea.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="blog-grid">
          {sorted.length === 0 && (
            <div className="col-span-full py-24 text-center text-[#4B5563]">
              No posts yet — check back soon.
            </div>
          )}
          {sorted.map((p, i) => (
            <article
              key={p.slug || i}
              data-testid={`blog-card-${p.slug}`}
              className="reveal group h-full flex flex-col rounded-2xl overflow-hidden bg-sand-100 border border-sand-200 hover:border-jungle-700 transition-colors"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {p.cover_image && (
                <Link to={`/blog/${p.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-sand-200">
                  <img
                    src={p.cover_image}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.04]"
                  />
                  {p.tag && (
                    <span className="absolute top-4 left-4 inline-flex rounded-full bg-sand-50/90 backdrop-blur px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-jungle-700">
                      {p.tag}
                    </span>
                  )}
                </Link>
              )}
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-3 text-[11px] text-[#4B5563]">
                  {p.published_at && <span className="inline-flex items-center gap-1.5"><Calendar className="h-3 w-3" />{formatDate(p.published_at)}</span>}
                  {p.read_minutes ? <span className="inline-flex items-center gap-1.5"><Clock className="h-3 w-3" />{p.read_minutes} min</span> : null}
                </div>
                <h2 className="mt-3 font-display text-2xl leading-[1.15] text-[#111827] line-clamp-3">
                  <Link to={`/blog/${p.slug}`} className="hover:text-jungle-700 transition-colors">
                    {p.title}
                  </Link>
                </h2>
                <p className="mt-3 text-sm text-[#4B5563] leading-relaxed line-clamp-3">
                  {p.excerpt}
                </p>
                <div className="mt-auto pt-5">
                  <Link
                    to={`/blog/${p.slug}`}
                    data-testid={`blog-card-readmore-${p.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-clay-500 hover:text-clay-600"
                  >
                    Read more <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
      <FloatingWhatsapp />
    </main>
  );
}
