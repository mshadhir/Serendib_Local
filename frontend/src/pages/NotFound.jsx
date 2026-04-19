import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import SEO from "@/components/site/SEO";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-sand-50 text-[#111827] flex items-center justify-center px-6" data-testid="not-found-page">
      <SEO title="Page not found" noindex />
      <div className="max-w-xl text-center">
        <MapPin className="h-10 w-10 text-clay-500 mx-auto" />
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500">Error 404</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">
          This road doesn't lead anywhere.
        </h1>
        <p className="mt-5 text-[#4B5563] text-base md:text-lg">
          Looks like the page you're after took an unmarked turn. Let's get you back to
          somewhere useful.
        </p>
        <Link
          to="/"
          data-testid="not-found-home-link"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-jungle-700 hover:bg-jungle-800 text-sand-50 px-7 py-3.5 text-sm font-medium transition-all"
        >
          Take me home
        </Link>
      </div>
    </main>
  );
}
