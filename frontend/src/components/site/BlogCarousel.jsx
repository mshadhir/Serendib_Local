import { Link } from "react-router-dom";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useCMS } from "@/context/ContentContext";

// Treat `featured` as truthy for "true", true, 1, "1"
const isFeatured = (v) => v === true || v === "true" || v === 1 || v === "1";

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function BlogCarousel() {
  const posts = (useCMS("blog_posts") || []).filter(isFeatured);
  if (posts.length === 0) return null;

  return (
    <section
      id="blog"
      data-testid="blog-carousel-section"
      className="relative bg-sand-50 py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4 reveal">
              From the road
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight reveal">
              Stories, tips &amp; honest guides from our Sri Lanka.
            </h2>
          </div>
          <Link
            to="/blog"
            data-testid="blog-carousel-view-all"
            className="inline-flex items-center gap-2 text-sm text-jungle-700 hover:text-clay-500 font-medium reveal"
          >
            All posts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <Carousel opts={{ align: "start" }} className="reveal" data-testid="blog-carousel">
          <CarouselContent className="-ml-4">
            {posts.map((p, i) => (
              <CarouselItem
                key={p.slug || i}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
                data-testid={`blog-carousel-item-${i}`}
              >
                <article className="group h-full flex flex-col rounded-2xl overflow-hidden bg-sand-100 border border-sand-200 hover:border-jungle-700 transition-colors">
                  <div className="relative aspect-[16/10] overflow-hidden bg-sand-200">
                    {p.cover_image && (
                      <img
                        src={p.cover_image}
                        alt={p.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.04]"
                      />
                    )}
                    {p.tag && (
                      <span className="absolute top-4 left-4 inline-flex rounded-full bg-sand-50/90 backdrop-blur px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-jungle-700">
                        {p.tag}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-6 md:p-7">
                    <div className="flex items-center gap-3 text-[11px] text-[#4B5563]">
                      {p.published_at && (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          {formatDate(p.published_at)}
                        </span>
                      )}
                      {p.read_minutes ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          {p.read_minutes} min read
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-3 font-display text-2xl md:text-[1.65rem] leading-[1.15] text-[#111827] line-clamp-3">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-sm text-[#4B5563] leading-relaxed line-clamp-3">
                      {p.excerpt}
                    </p>
                    <div className="mt-auto pt-6">
                      <Link
                        to={`/blog/${p.slug}`}
                        data-testid={`blog-carousel-readmore-${p.slug}`}
                        className="inline-flex items-center gap-2 rounded-full bg-jungle-700 hover:bg-jungle-800 text-sand-50 px-5 py-2.5 text-xs font-semibold transition-all"
                      >
                        Read more <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex items-center justify-end gap-2">
            <CarouselPrevious
              data-testid="blog-carousel-prev"
              className="static translate-y-0 h-10 w-10 border-sand-200 text-[#111827] hover:border-jungle-700 hover:bg-sand-100"
            />
            <CarouselNext
              data-testid="blog-carousel-next"
              className="static translate-y-0 h-10 w-10 border-sand-200 text-[#111827] hover:border-jungle-700 hover:bg-sand-100"
            />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
