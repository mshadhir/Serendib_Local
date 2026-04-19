import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import TrustBar from "@/components/site/TrustBar";
import WhyUs from "@/components/site/WhyUs";
import Packages from "@/components/site/Packages";
import WhyBookDirect from "@/components/site/WhyBookDirect";
import Experiences from "@/components/site/Experiences";
import Team from "@/components/site/Team";
import Reviews from "@/components/site/Reviews";
import TripBuilder from "@/components/site/TripBuilder";
import FAQ from "@/components/site/FAQ";
import Blog from "@/components/site/Blog";
import Instagram from "@/components/site/Instagram";
import Footer from "@/components/site/Footer";
import FloatingWhatsapp from "@/components/site/FloatingWhatsapp";

export default function Home() {
  const location = useLocation();

  // Scroll to hash if coming from a detail page
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 120);
      }
    }
  }, [location]);

  // Reveal-on-scroll for any element with .reveal
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
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
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="relative bg-sand-50 text-[#111827]" data-testid="home-page">
      <Navbar />
      <Hero />
      <TrustBar />
      <WhyUs />
      <Packages />
      <WhyBookDirect />
      <Experiences />
      <Team />
      <Reviews />
      <TripBuilder />
      <FAQ />
      <Blog />
      <Instagram />
      <Footer />
      <FloatingWhatsapp />
    </main>
  );
}
