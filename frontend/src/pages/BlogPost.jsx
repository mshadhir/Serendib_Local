import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import FloatingWhatsapp from "@/components/site/FloatingWhatsapp";
import SEO from "@/components/site/SEO";
import MarkdownLite from "@/components/site/MarkdownLite";
import NotFound from "@/pages/NotFound";
import { useCMS } from "@/context/ContentContext";
import useReveal from "@/hooks/useReveal";

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPost() {
  const { slug } = useParams();
  const posts = useCMS("blog_posts") || [];
  const post = posts.find((p) => p.slug === slug);
  useReveal();

  if (!post) {
    // While CMS is still loading, posts array is empty from fallback — show
    // 404 only once CMS has resolved. But even a premature 404 is fine
    // because the 404 page lets them go home.
    return <NotFound />;
  }

  const others = posts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <main className="relative bg-sand-50 text-[#111827]" data-testid="blog-post-page">
      <SEO
        title={post.title}
        description={post.excerpt}
        image={post.cover_image}
        path={`/blog/${slug}`}
      />
      <Navbar />

      <article className="pt-32 pb-16 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/blog"
            data-testid="blog-post-back"
            className="inline-flex items-center gap-1.5 text-sm text-clay-500 hover:text-clay-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All posts
          </Link>

          {post.tag && (
            <span className="mt-6 inline-flex rounded-full bg-jungle-700/10 text-jungle-700 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
              {post.tag}
            </span>
          )}

          <h1 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight">
            {post.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-[#4B5563]">
            {post.author && <span>By <span className="text-[#111827] font-medium">{post.author}</span></span>}
            {post.published_at && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> {formatDate(post.published_at)}
              </span>
            )}
            {post.read_minutes ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {post.read_minutes} min read
              </span>
            ) : null}
          </div>

          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={post.title}
              className="mt-10 w-full aspect-[16/9] object-cover rounded-2xl"
              loading="lazy"
            />
          )}

          <MarkdownLite
            text={post.body}
            className="mt-10 text-[#374151] text-base md:text-[17px] leading-[1.75]"
          />

          <div className="mt-14 rounded-2xl border border-sand-200 bg-sand-100 p-6 md:p-8" data-testid="blog-post-cta">
            <p className="text-[11px] uppercase tracking-[0.22em] text-clay-500 font-semibold">
              Ready to visit?
            </p>
            <h3 className="mt-2 font-display text-2xl md:text-3xl leading-tight">
              We'll drive you there.
            </h3>
            <p className="mt-2 text-sm text-[#4B5563] max-w-xl">
              Tell us what you want to see and we'll design the route, find the
              stays, and pick you up from the airport.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/#trip-builder"
                className="inline-flex items-center gap-2 rounded-full bg-clay-500 hover:bg-clay-600 text-white px-5 py-3 text-sm font-semibold transition-all"
              >
                Plan my trip <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/#services"
                className="inline-flex items-center gap-2 rounded-full border border-jungle-700 text-jungle-700 hover:bg-jungle-700 hover:text-sand-50 px-5 py-3 text-sm font-semibold transition-all"
              >
                See services
              </Link>
            </div>
          </div>
        </div>
      </article>

      {others.length > 0 && (
        <section className="pb-24 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl mb-8">More from the road</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  data-testid={`blog-related-${p.slug}`}
                  className="group rounded-2xl overflow-hidden bg-sand-100 border border-sand-200 hover:border-jungle-700 transition-colors"
                >
                  {p.cover_image && (
                    <div className="aspect-[16/10] overflow-hidden bg-sand-200">
                      <img src={p.cover_image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.04]" />
                    </div>
                  )}
                  <div className="p-5">
                    {p.tag && (
                      <span className="inline-flex rounded-full bg-jungle-700/10 text-jungle-700 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]">
                        {p.tag}
                      </span>
                    )}
                    <h3 className="mt-2 font-display text-lg leading-snug line-clamp-3">{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <FloatingWhatsapp />
    </main>
  );
}
