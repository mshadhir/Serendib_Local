import InstantPriceWidget from "@/components/site/InstantPriceWidget";

export default function InstantPriceBlock() {
  return (
    <section
      id="pricing"
      data-testid="instant-price-section"
      className="relative bg-jungle-800 text-sand-50 py-24 md:py-32 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #C05A45 0, transparent 40%), radial-gradient(circle at 80% 80%, #F9F6F0 0, transparent 40%)",
        }}
      />
      <div className="relative max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4 reveal">
            Get a quick price
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight reveal">
            Two dropdowns. Real price.
            <span className="block italic text-sand-50/70">No form fill.</span>
          </h2>
          <p className="mt-6 text-sand-50/75 text-base md:text-lg max-w-md reveal">
            Pick your trip length and vehicle. You'll see an honest all-in total in under 5 seconds — and we'll continue the conversation on WhatsApp.
          </p>
          <ul className="mt-8 space-y-3 text-sand-50/80 text-sm reveal">
            <li>· Flat daily rate — fuel, driver, tolls, all in</li>
            <li>· Change dates or vehicle anytime before payment</li>
            <li>· 10% deposit locks your dates</li>
          </ul>
        </div>
        <div className="lg:col-span-6 reveal">
          <InstantPriceWidget variant="glass" />
        </div>
      </div>
    </section>
  );
}
