import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";

// CMS defaults mirrored so the UI renders even before `/api/cms` resolves.
// These are hardcoded fallbacks only — real content lives in MongoDB and is
// served by the backend via `/api/cms`. Admins edit via /admin.
import {
  HERO, TRUST_ITEMS, EXPERIENCES, TEAM, REVIEWS, BRAND,
  TRIP_LOCATIONS, TRIP_EXPERIENCES, INTERESTS,
} from "@/lib/siteData";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FALLBACK = {
  settings: {
    brand_name: BRAND.name,
    tagline: BRAND.tagline,
    email: BRAND.email,
    whatsapp_number: BRAND.whatsappNumber,
    location: BRAND.location,
    hero_eyebrow: HERO.eyebrow,
    hero_title: HERO.title,
    hero_sub: HERO.sub,
    hero_image: HERO.image,
    seo_title: "Serendib Local — Private Car & Driver in Sri Lanka",
    seo_description: "Licensed private car & driver across Sri Lanka.",
    seo_keywords: "Sri Lanka private driver, car and driver Sri Lanka",
    seo_og_image: HERO.image,
    site_url: "https://serendiblocal.com",
  },
  services: [],
  vehicles: [],
  locations: TRIP_LOCATIONS,
  trip_experiences: TRIP_EXPERIENCES,
  stay_budgets: [],
  stay_styles: [],
  reviews: REVIEWS,
  faqs: [],
  concierge: [],
  sample_routes: [],
  team: TEAM,
  experiences: EXPERIENCES,
  trust_items: TRUST_ITEMS,
};

const ContentCtx = createContext({ content: FALLBACK, loading: true, reload: () => {} });

export function ContentProvider({ children }) {
  const [content, setContent] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  const reload = async () => {
    try {
      const res = await axios.get(`${API}/cms`);
      // Merge — prefer server, fallback keeps any key server doesn't send.
      setContent({ ...FALLBACK, ...res.data });
    } catch (err) {
      // Keep fallback on network error so the site never hard-fails.
      // eslint-disable-next-line no-console
      console.warn("CMS fetch failed, using fallback content.", err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Guard against StrictMode double-invoke in dev.
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ContentCtx.Provider value={{ content, loading, reload }}>
      {children}
    </ContentCtx.Provider>
  );
}

export const useContent = () => useContext(ContentCtx);

export function useCMS(key) {
  const { content } = useContext(ContentCtx);
  return content?.[key] ?? FALLBACK[key];
}

export function useSettings() {
  const { content } = useContext(ContentCtx);
  return content?.settings ?? FALLBACK.settings;
}
