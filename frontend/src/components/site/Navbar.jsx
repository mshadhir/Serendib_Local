import { useEffect, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { BRAND, NAV_LINKS, WHATSAPP_LINK } from "@/lib/siteData";
import { useLang } from "@/context/LangContext";
import LanguageSwitcher from "@/components/site/LanguageSwitcher";

const KEY_MAP = {
  "Why Us": "nav.whyUs",
  Packages: "nav.packages",
  "Car & Driver": "nav.carAndDriver",
  Experiences: "nav.experiences",
  Team: "nav.team",
  "Plan My Trip": "nav.planTrip",
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const baseText = scrolled ? "text-[#111827]" : "text-white";
  const bar = scrolled
    ? "backdrop-blur-xl bg-sand-50/80 border-b border-sand-200"
    : "bg-transparent border-b border-transparent";

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${bar}`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <a
          href="#top"
          data-testid="nav-logo"
          className={`font-display text-2xl md:text-[1.75rem] leading-none tracking-tight ${baseText}`}
        >
          {BRAND.name}
          <span className="text-clay-500">.</span>
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={`text-sm tracking-wide hover:text-clay-500 transition-colors ${baseText}`}
            >
              {t(KEY_MAP[l.label]) || l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:block">
            <LanguageSwitcher variant={scrolled ? "light" : "dark"} />
          </div>
          <a
            href={WHATSAPP_LINK()}
            target="_blank"
            rel="noreferrer"
            data-testid="nav-whatsapp-btn"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1fb457] text-white px-5 py-2.5 text-sm font-medium transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            {t("nav.whatsapp")}
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className={`md:hidden p-2 rounded-full ${scrolled ? "text-[#111827]" : "text-white"}`}
            aria-label="Menu"
            data-testid="nav-mobile-toggle"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-sand-50 border-t border-sand-200" data-testid="nav-mobile-menu">
          <div className="px-6 py-6 flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-[#111827] text-base"
              >
                {t(KEY_MAP[l.label]) || l.label}
              </a>
            ))}
            <div className="pt-2">
              <LanguageSwitcher variant="light" />
            </div>
            <a
              href={WHATSAPP_LINK()}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-5 py-3 text-sm font-medium w-fit"
            >
              <MessageCircle className="h-4 w-4" /> {t("nav.whatsapp")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
