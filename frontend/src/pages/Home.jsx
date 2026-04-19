import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
  const navigate = useNavigate();
  useReveal();

  // Surface a Stripe-cancel error message when the user is bounced back
  // from Checkout via `/?booking_cancelled=1`.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("booking_cancelled") === "1") {
      toast.error("Payment cancelled", {
        description: "No charge was made. You can try again or reach out on WhatsApp if you ran into trouble.",
      });
      // Clean the URL so refreshes don't re-fire the toast.
      params.delete("booking_cancelled");
      params.delete("package");
      const qs = params.toString();
      navigate({ pathname: "/", search: qs ? `?${qs}` : "", hash: location.hash }, { replace: true });
    }
  }, [location.search, location.hash, navigate]);

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
