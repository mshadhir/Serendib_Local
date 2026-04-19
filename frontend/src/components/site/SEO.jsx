import { Helmet } from "react-helmet-async";
import { useSettings } from "@/context/ContentContext";

/**
 * SEO component — drop onto any page to set <title> / <meta> / OpenGraph / Twitter.
 * Defaults come from the CMS `settings` singleton (editable at /admin).
 *
 * Usage:
 *   <SEO />                                   // Home page, uses site defaults
 *   <SEO title="Admin dashboard" noindex />   // Admin page, kept out of search
 */
export default function SEO({ title, description, image, path = "/", noindex = false }) {
  const s = useSettings();
  const finalTitle = title || s.seo_title || s.brand_name;
  const finalDesc = description || s.seo_description || s.tagline;
  const finalImage = image || s.seo_og_image || s.hero_image;
  const baseUrl = (s.site_url || "").replace(/\/$/, "");
  const canonical = baseUrl ? `${baseUrl}${path}` : undefined;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      {s.seo_keywords && <meta name="keywords" content={s.seo_keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* OpenGraph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      {finalImage && <meta property="og:image" content={finalImage} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content={s.brand_name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      {finalImage && <meta name="twitter:image" content={finalImage} />}

      {/* Structured data: TravelAgency */}
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": s.brand_name,
        "description": finalDesc,
        "email": s.email,
        "telephone": s.whatsapp_number,
        "address": { "@type": "PostalAddress", "addressLocality": s.location, "addressCountry": "LK" },
        "url": baseUrl || undefined,
        "image": finalImage || undefined,
      })}</script>
    </Helmet>
  );
}
