import { Link } from "react-router-dom";
import { useSettings } from "@/context/ContentContext";
import SEO from "@/components/site/SEO";

export default function Terms() {
  const s = useSettings();
  return (
    <main className="min-h-screen bg-sand-50 text-[#111827] py-20 px-6" data-testid="terms-page">
      <SEO title={`Terms · ${s.brand_name}`} path="/terms" />
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-sm text-clay-500 hover:text-clay-600" data-testid="terms-home-link">← Back home</Link>
        <h1 className="mt-6 font-display text-4xl md:text-5xl">Terms of service</h1>
        <p className="mt-2 text-[#4B5563] text-sm">Last updated: {new Date().toISOString().slice(0, 10)}</p>

        <section className="mt-10 space-y-6 text-[#374151] leading-relaxed">
          <p>
            By booking with {s.brand_name} you agree to the following. If anything is
            unclear, WhatsApp us at {s.whatsapp_number} — we'll happily walk through it.
          </p>

          <h2 className="font-display text-2xl text-[#111827]">1. What you're booking</h2>
          <p>
            A private car &amp; driver service within Sri Lanka — Airport Transfer, Private
            Day Tour, or a multi-day Road Trip. Unless explicitly included, accommodation,
            meals, fuel at long-distance stops, and entry tickets are not part of the
            quoted price. We'll make every reasonable effort to keep the driver, vehicle
            and route you approved.
          </p>

          <h2 className="font-display text-2xl text-[#111827]">2. Deposits &amp; balance</h2>
          <p>
            Airport Transfer is payable in full at checkout. Day Tour and Road Trip
            require a 10% deposit to confirm your dates; the balance is payable to your
            driver on pickup (cash USD/EUR/GBP/LKR, or bank transfer on request). Prices
            are quoted in USD and may be shown in EUR/GBP for convenience.
          </p>

          <h2 className="font-display text-2xl text-[#111827]">3. Cancellations</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>More than 30 days before arrival — 100% deposit refund.</li>
            <li>Between 14–30 days — 50% deposit refund.</li>
            <li>Inside 14 days — deposit is non-refundable, but we will credit it toward a future trip within 12 months.</li>
            <li>Airport transfers — full refund if cancelled at least 48 hours before pickup.</li>
          </ul>

          <h2 className="font-display text-2xl text-[#111827]">4. Changes on the road</h2>
          <p>
            The trip builder is a starting point, not a contract — you can swap stops or
            adjust the pace with your driver day-to-day. Price is reconciled on the final
            day with any agreed additions.
          </p>

          <h2 className="font-display text-2xl text-[#111827]">5. Safety &amp; insurance</h2>
          <p>
            All our vehicles are licensed, insured and regularly maintained. Our drivers
            are licensed chauffeur-guides. We strongly recommend
            you hold valid travel insurance covering health, theft and trip interruption.
          </p>

          <h2 className="font-display text-2xl text-[#111827]">6. Liability</h2>
          <p>
            We are not liable for delays or changes caused by force majeure (weather,
            strikes, political unrest, airline cancellations, road closures), nor for
            losses, damage or injury arising from activities booked through third parties
            (safaris, cooking classes, surf lessons, etc.).
          </p>

          <h2 className="font-display text-2xl text-[#111827]">7. Governing law</h2>
          <p>
            These terms are governed by the laws of the Democratic Socialist Republic of
            Sri Lanka.
          </p>

          <h2 className="font-display text-2xl text-[#111827]">Contact</h2>
          <p>
            Questions about these terms? Email{" "}
            <a className="underline" href={`mailto:${s.email}`}>{s.email}</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
