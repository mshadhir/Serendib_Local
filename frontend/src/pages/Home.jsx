import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import TrustBar from "@/components/site/TrustBar";
import Services from "@/components/site/Services";
import HowItWorks from "@/components/site/HowItWorks";
import Vehicles from "@/components/site/Vehicles";
import InstantPriceBlock from "@/components/site/InstantPriceBlock";
import Concierge from "@/components/site/Concierge";
import SampleRoutes from "@/components/site/SampleRoutes";
import Experiences from "@/components/site/Experiences";
import Team from "@/components/site/Team";
import Reviews from "@/components/site/Reviews";
import WhyBookDirect from "@/components/site/WhyBookDirect";
import TripBuilder from "@/components/site/TripBuilder";
import FAQ from "@/components/site/FAQ";
import Instagram from "@/components/site/Instagram";
import Footer from "@/components/site/Footer";
import FloatingWhatsapp from "@/components/site/FloatingWhatsapp";
import SEO from "@/components/site/SEO";
import { useContent } from "@/context/ContentContext";

export default function Home() {
  const location = useLocation();
  const { loading: cmsLoading } = useContent();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 120);
    }
  }, [location]);

  useEffect(() => {
    // Re-run after CMS settles so FAQ / Reviews / Services items (which
    // only mount once `/api/cms` resolves) still get faded in.
    const els = document.querySelectorAll(".reveal:not(.in)");
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => {
      io.observe(el);
      // Fallback: if item is already in viewport at mount, reveal immediately
      // (IntersectionObserver only fires on changes after registration).
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("in");
    });
    return () => io.disconnect();
  }, [cmsLoading]);

  return (
    <main className="relative bg-sand-50 text-[#111827]" data-testid="home-page">
      <SEO path="/" />
      <Navbar />
      <Hero />
      <TrustBar />
      <Services />
      <HowItWorks />
      <Vehicles />
      <InstantPriceBlock />
      <Concierge />
      <SampleRoutes />
      <Experiences />
      <Team />
      <Reviews />
      <WhyBookDirect />
      <TripBuilder />
      <FAQ />
      <Instagram />
      <Footer />
      <FloatingWhatsapp />
    </main>
  );
}
