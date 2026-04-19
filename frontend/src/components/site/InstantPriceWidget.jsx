import { useState, useMemo } from "react";
import { MessageCircle, Sparkles, ChevronDown } from "lucide-react";
import { VEHICLES } from "@/lib/carAndDriver";
import { WHATSAPP_LINK } from "@/lib/siteData";

export default function InstantPriceWidget({ variant = "glass" }) {
  const [days, setDays] = useState(7);
  const [vehicleSlug, setVehicleSlug] = useState(VEHICLES[0].slug);

  const vehicle = VEHICLES.find((v) => v.slug === vehicleSlug) || VEHICLES[0];
  const total = useMemo(() => Math.max(1, Number(days) || 1) * vehicle.price, [days, vehicle]);
  const perPerson = useMemo(() => {
    // Use lower bound of seat range for per-person estimate (e.g. "2–3 guests" → 2)
    const match = vehicle.seats.match(/(\d+)/);
    const seats = match ? Number(match[1]) : 1;
    return Math.round(total / Math.max(1, seats));
  }, [total, vehicle]);

  const message = `Hi! Instant quote check — I'd like a ${vehicle.name} for ${days} days. Your site says approx $${total.toLocaleString("en-US")} total. My dates are…`;

  const isGlass = variant === "glass";
  const wrapper = isGlass
    ? "backdrop-blur-xl bg-sand-50/95 border border-white/30 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)]"
    : "bg-sand-50 border border-sand-200";

  return (
    <div
      data-testid="instant-price-widget"
      className={`rounded-2xl p-6 md:p-7 text-[#111827] ${wrapper}`}
    >
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-clay-500">
        <Sparkles className="h-3.5 w-3.5" />
        Get an instant price
      </div>
      <h3 className="mt-3 font-display text-2xl md:text-[1.7rem] leading-tight">
        Two dropdowns. One price.
      </h3>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] uppercase tracking-[0.18em] text-[#4B5563] mb-2">Days</label>
          <input
            type="number"
            min={1}
            max={60}
            value={days}
            onChange={(e) => setDays(e.target.value)}
            data-testid="ipw-days"
            className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 focus:ring-0 outline-none px-3.5 py-3 text-[#111827] font-display text-xl"
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-[0.18em] text-[#4B5563] mb-2">Vehicle</label>
          <div className="relative">
            <select
              value={vehicleSlug}
              onChange={(e) => setVehicleSlug(e.target.value)}
              data-testid="ipw-vehicle"
              className="w-full appearance-none rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none pl-3.5 pr-10 py-3 text-[#111827] font-medium text-sm"
            >
              {VEHICLES.map((v) => (
                <option key={v.slug} value={v.slug}>{v.name} · ${v.price}/day</option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563] pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-jungle-700 text-sand-50 p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-clay-500">All-in total</div>
            <div
              data-testid="ipw-total"
              className="font-display text-4xl md:text-5xl leading-none mt-1"
            >
              ${total.toLocaleString("en-US")}
            </div>
            <div className="text-xs text-sand-50/65 mt-1.5">
              {days} {days == 1 ? "day" : "days"} × ${vehicle.price}/day · {vehicle.seats}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.22em] text-sand-50/60">Per person</div>
            <div className="font-display text-xl text-sand-50/90 mt-1">~${perPerson.toLocaleString("en-US")}</div>
          </div>
        </div>
      </div>

      <a
        href={WHATSAPP_LINK(message)}
        target="_blank"
        rel="noreferrer"
        data-testid="ipw-whatsapp"
        className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-clay-500 hover:bg-clay-600 text-white px-6 py-3.5 text-sm font-medium transition-all"
      >
        <MessageCircle className="h-4 w-4" /> Get this quote on WhatsApp
      </a>

      <p className="mt-3 text-[11px] text-[#4B5563] text-center">
        Indicative — final quote depends on your actual route. No charge until you approve.
      </p>
    </div>
  );
}
