import { Link } from "react-router-dom";
import { useSettings } from "@/context/ContentContext";
import SEO from "@/components/site/SEO";

export default function Privacy() {
  const s = useSettings();
  return (
    <main className="min-h-screen bg-sand-50 text-[#111827] py-20 px-6" data-testid="privacy-page">
      <SEO title={`Privacy Policy · ${s.brand_name}`} path="/privacy" />
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-sm text-clay-500 hover:text-clay-600" data-testid="privacy-home-link">← Back home</Link>
        <h1 className="mt-6 font-display text-4xl md:text-5xl">Privacy policy</h1>
        <p className="mt-2 text-[#4B5563] text-sm">Last updated: {new Date().toISOString().slice(0, 10)}</p>

        <section className="mt-10 space-y-6 text-[#374151] leading-relaxed">
          <p>
            {s.brand_name} ("we", "us") respects your privacy. This short policy explains
            what we collect, why, and your choices.
          </p>

          <h2 className="font-display text-2xl text-[#111827]">What we collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><b>Inquiry &amp; booking data</b> — name, email, WhatsApp number, travel dates, stops, experience and accommodation preferences, and free-text notes you submit via the trip builder or the Book Now forms.</li>
            <li><b>Payment data</b> — when you pay a deposit or a trip in full, Stripe processes card details directly. We never see or store your card number. Stripe returns us a session ID, the amount paid, and your email.</li>
            <li><b>Cookies</b> — a single functional cookie stores your preferred currency and language. We do not use advertising cookies.</li>
          </ul>

          <h2 className="font-display text-2xl text-[#111827]">Why we collect it</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To design your trip and reply on WhatsApp / email.</li>
            <li>To take and reconcile deposit or full payments through Stripe.</li>
            <li>To email you the route itinerary and, optionally, balance-due reminders.</li>
          </ul>

          <h2 className="font-display text-2xl text-[#111827]">How we store it</h2>
          <p>
            Inquiries and bookings are stored in a private MongoDB database we operate.
            Payments are held by Stripe under their PCI-compliant terms. We do not sell
            or share your data with third parties beyond these processors.
          </p>

          <h2 className="font-display text-2xl text-[#111827]">Your rights</h2>
          <p>
            You can email <a className="underline" href={`mailto:${s.email}`}>{s.email}</a> to
            ask for a copy of the data we hold about you, or to delete it entirely.
          </p>

          <h2 className="font-display text-2xl text-[#111827]">Contact</h2>
          <p>
            {s.brand_name} · {s.location}<br />
            Email: <a className="underline" href={`mailto:${s.email}`}>{s.email}</a><br />
            WhatsApp: {s.whatsapp_number}
          </p>
        </section>
      </div>
    </main>
  );
}
