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
import useReveal from "@/hooks/useReveal";

export default function Home() {
  const location = useLocation();
  useReveal();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 120);
    }
  }, [location]);

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 120);
    }
  }, [location]);

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
