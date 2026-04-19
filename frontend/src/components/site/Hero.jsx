import { ArrowRight, Play } from "lucide-react";
import { HERO, WHATSAPP_LINK } from "@/lib/siteData";
import { useLang } from "@/context/LangContext";
import { useSettings } from "@/context/ContentContext";

export default function Hero() {
  const { t } = useLang();
  const settings = useSettings();
  const image = settings.hero_image || HERO.image;
  const title = settings.hero_title || HERO.title;
  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative min-h-[100svh] w-full overflow-hidden bg-jungle-900"
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={image}
          alt="Sri Lanka tea plantation landscape"
          className="h-full w-full object-cover will-change-transform animate-ken-burns"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-40 pb-28 min-h-[100svh] flex flex-col justify-end">
        <p
          data-testid="hero-eyebrow"
          className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.28em] text-clay-500 mb-6"
        >
          {t("hero.eyebrow")}
        </p>
        <h1
          data-testid="hero-title"
          className="font-display text-white text-5xl sm:text-6xl lg:text-[5.75rem] leading-[0.95] tracking-tight max-w-4xl"
        >
          {title}
        </h1>
        <p
          data-testid="hero-sub"
          className="mt-7 max-w-2xl text-white/85 text-base md:text-lg leading-relaxed"
        >
          {t("hero.sub")}
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#trip-builder"
            data-testid="hero-cta-day-tour"
            className="group inline-flex items-center gap-2 rounded-full bg-clay-500 hover:bg-clay-600 text-white px-7 py-4 text-sm font-medium transition-all"
          >
            Book a Day Tour
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#trip-builder"
            data-testid="hero-cta-road-trip"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 hover:border-white/80 text-white/95 px-7 py-4 text-sm font-medium backdrop-blur-sm transition-all"
          >
            <Play className="h-4 w-4" />
            Plan a Road Trip
          </a>
          <a
            href={WHATSAPP_LINK()}
            target="_blank"
            rel="noreferrer"
            data-testid="hero-cta-whatsapp"
            className="inline-flex items-center text-white/70 hover:text-white text-sm underline underline-offset-4 px-2 py-4"
          >
            {t("hero.ctaWhatsapp")}
          </a>
        </div>

        <div className="mt-14 hidden md:flex items-center gap-8 text-white/70 text-xs tracking-widest uppercase">
          <span>{t("hero.scroll")}</span>
          <span className="h-px w-20 bg-white/40" />
          <span>{t("hero.explore")}</span>
        </div>
      </div>
    </section>
  );
}
