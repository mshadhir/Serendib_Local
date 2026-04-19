import { Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { BRAND, NAV_LINKS, TRUST_BADGES, WHATSAPP_LINK } from "@/lib/siteData";
import { useLang } from "@/context/LangContext";

const NAV_KEY_MAP = {
  "Why Us": "nav.whyUs",
  Packages: "nav.packages",
  Experiences: "nav.experiences",
  Team: "nav.team",
  "Plan My Trip": "nav.planTrip",
};

export default function Footer() {
  const { t } = useLang();
  return (
    <footer
      data-testid="site-footer"
      className="relative bg-jungle-900 text-sand-50 pt-20 pb-10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Big brand */}
        <div className="border-b border-jungle-600 pb-14">
          <a
            href="#top"
            className="font-display text-6xl md:text-8xl lg:text-[9rem] leading-[0.9] tracking-tight block"
          >
            {BRAND.name}<span className="text-clay-500">.</span>
          </a>
          <p className="mt-6 font-display italic text-sand-50/70 text-xl md:text-2xl max-w-xl">
            {BRAND.tagline}
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-14">
          <div>
            <h4 className="text-[11px] tracking-[0.24em] uppercase text-clay-500 mb-5">{t("footer.explore")}</h4>
            <ul className="space-y-3 text-sand-50/80 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-sand-50">{t(NAV_KEY_MAP[l.label]) || l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] tracking-[0.24em] uppercase text-clay-500 mb-5">{t("footer.journeys")}</h4>
            <ul className="space-y-3 text-sand-50/80 text-sm">
              <li>The Real Sri Lanka</li>
              <li>Hidden Lanka</li>
              <li>Slow &amp; Savour</li>
              <li>Custom Trip</li>
              <li>Day Tours</li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] tracking-[0.24em] uppercase text-clay-500 mb-5">{t("footer.contact")}</h4>
            <ul className="space-y-3 text-sand-50/80 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-clay-500" />
                <a href={`mailto:${BRAND.email}`} className="hover:text-sand-50">{BRAND.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-clay-500" />
                <span>{BRAND.location}</span>
              </li>
              <li>
                <a
                  href={WHATSAPP_LINK()}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="footer-whatsapp"
                  className="inline-flex items-center rounded-full bg-[#25D366] hover:bg-[#1fb457] text-white px-4 py-2 text-xs font-medium mt-2"
                >
                  WhatsApp us · 24/7
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] tracking-[0.24em] uppercase text-clay-500 mb-5">{t("footer.follow")}</h4>
            <ul className="space-y-3 text-sand-50/80 text-sm">
              <li className="flex items-center gap-2"><Instagram className="h-4 w-4 text-clay-500" /> @serendiblocal</li>
              <li className="flex items-center gap-2"><Facebook className="h-4 w-4 text-clay-500" /> /serendiblocal</li>
            </ul>
            <p className="mt-6 text-sand-50/60 text-xs leading-relaxed">
              {t("footer.newsletter")}
            </p>
          </div>
        </div>

        {/* Trust + copyright */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-10 border-t border-jungle-600">
          <div className="flex flex-wrap gap-2.5">
            {TRUST_BADGES.map((b) => (
              <span
                key={b}
                className="inline-flex items-center rounded-full border border-jungle-600 text-sand-50/80 text-[11px] tracking-[0.18em] uppercase px-3 py-1.5"
              >
                {b}
              </span>
            ))}
          </div>
          <p className="text-xs text-sand-50/50">
            © {new Date().getFullYear()} {BRAND.name}. {t("footer.made")}
          </p>
        </div>
      </div>
    </footer>
  );
}
