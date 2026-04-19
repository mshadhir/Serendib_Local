import { Instagram as IgIcon, Heart, MessageSquare } from "lucide-react";
import { EXPERIENCES } from "@/lib/siteData";
import { useLang } from "@/context/LangContext";

// Use existing travel imagery as realistic Instagram-style tiles.
const POSTS = EXPERIENCES.slice(0, 8).map((e, i) => ({
  image: e.image,
  likes: 840 + i * 97,
  comments: 18 + i * 3,
  caption: e.title,
}));

export default function Instagram() {
  const { t } = useLang();
  return (
    <section
      id="instagram"
      data-testid="instagram-section"
      className="relative bg-sand-100 py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4 reveal">
              {t("ig.eyebrow")}
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight max-w-2xl reveal">
              {t("ig.title")}
            </h2>
            <p className="mt-4 text-[#4B5563] text-base max-w-md reveal">
              {t("ig.sub")}
            </p>
          </div>
          <a
            href="https://instagram.com/serendiblocal"
            target="_blank"
            rel="noreferrer"
            data-testid="instagram-cta"
            className="inline-flex items-center gap-2 rounded-full bg-jungle-700 hover:bg-jungle-800 text-sand-50 px-5 py-3 text-sm font-medium transition-all reveal self-start md:self-auto"
          >
            <IgIcon className="h-4 w-4" />
            {t("ig.follow")}
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3" data-testid="instagram-grid">
          {POSTS.map((p, i) => (
            <a
              key={i}
              href="https://instagram.com/serendiblocal"
              target="_blank"
              rel="noreferrer"
              data-testid={`instagram-post-${i}`}
              className="group relative aspect-square overflow-hidden rounded-xl bg-jungle-900 reveal"
              style={{ transitionDelay: `${(i % 4) * 70}ms` }}
            >
              <img
                src={p.image}
                alt={p.caption}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-500 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-5 text-white text-sm font-medium">
                  <span className="inline-flex items-center gap-1.5"><Heart className="h-4 w-4 fill-white" /> {p.likes}</span>
                  <span className="inline-flex items-center gap-1.5"><MessageSquare className="h-4 w-4" /> {p.comments}</span>
                </div>
              </div>
              <div className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <IgIcon className="h-4 w-4 text-jungle-700" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
