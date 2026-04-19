import { useState, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowRight, ArrowLeft, Loader2, CreditCard, MapPin, Calendar, Clock,
  PlaneTakeoff, PlaneLanding, Car, Truck, Bus, Users,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const COUNTRY_CODES = [
  { code: "+44", flag: "GB" }, { code: "+49", flag: "DE" }, { code: "+61", flag: "AU" },
  { code: "+91", flag: "IN" }, { code: "+33", flag: "FR" }, { code: "+1", flag: "US" },
  { code: "+31", flag: "NL" }, { code: "+65", flag: "SG" }, { code: "+81", flag: "JP" },
  { code: "+94", flag: "LK" },
];

// ---------- Config per mode ----------
const CONFIGS = {
  airport: {
    slug: "airport-transfer",
    name: "Airport Transfer",
    headline: "Book your airport transfer",
    blurb: "Meet & greet at arrivals. Cold water. Straight to your hotel.",
    vehicles: [
      { id: "sedan", label: "Sedan (1–3 pax)", price: 35, icon: Car },
      { id: "suv", label: "SUV (1–5 pax)", price: 55, icon: Truck },
      { id: "van", label: "Family Van (1–8 pax)", price: 75, icon: Bus },
    ],
    fullPayment: true,
    unit: "per trip",
    defaultPax: 2,
  },
  dayTour: {
    slug: "day-tour",
    name: "Private Day Tour",
    headline: "Book a private day tour",
    blurb: "Pick any destination. We drive, we guide, we stop whenever you want.",
    vehicles: [
      { id: "sedan", label: "Sedan (1–3 pax)", price: 85, icon: Car },
      { id: "suv", label: "SUV (1–5 pax)", price: 110, icon: Truck },
      { id: "van", label: "Family Van (1–8 pax)", price: 140, icon: Bus },
    ],
    fullPayment: false,
    unit: "per day",
    defaultPax: 2,
  },
};

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function QuickBookModal({ open, onOpenChange, mode = "airport" }) {
  const cfg = CONFIGS[mode] || CONFIGS.airport;
  const [vehicleId, setVehicleId] = useState(cfg.vehicles[0].id);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [direction, setDirection] = useState("pickup"); // airport mode only
  const [location, setLocation] = useState("");         // airport destination or day tour pickup
  const [destination, setDestination] = useState("");   // day tour only
  const [pax, setPax] = useState(cfg.defaultPax);
  const [form, setForm] = useState({
    name: "", email: "", countryCode: "+44", whatsapp: "",
  });
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const vehicle = cfg.vehicles.find((v) => v.id === vehicleId) || cfg.vehicles[0];
  const total = vehicle.price;
  const deposit = cfg.fullPayment ? total : Math.round(total * 0.1);

  const step1Valid = !!date && !!time && (
    mode === "airport" ? !!location.trim() : (!!location.trim() && !!destination.trim())
  );
  const step2Valid = form.name.trim() && form.email.trim() && form.whatsapp.trim();

  const reset = () => {
    setVehicleId(cfg.vehicles[0].id); setDate(""); setTime("10:00");
    setDirection("pickup"); setLocation(""); setDestination("");
    setPax(cfg.defaultPax); setStep(1); setAgreed(false);
    setForm({ name: "", email: "", countryCode: "+44", whatsapp: "" });
  };

  const close = (v) => { if (!v) reset(); onOpenChange(v); };

  const handlePay = async () => {
    if (!agreed) {
      toast.error("Please acknowledge the cancellation policy.");
      return;
    }
    setSubmitting(true);
    try {
      const fullWhatsapp = `${form.countryCode}${form.whatsapp.replace(/[^0-9]/g, "")}`;
      const specialLines = [];
      if (mode === "airport") {
        specialLines.push(`Direction: ${direction === "pickup" ? "Airport → " + location : location + " → Airport"}`);
      } else {
        specialLines.push(`Pickup: ${location}`);
        specialLines.push(`Destination: ${destination}`);
      }
      specialLines.push(`Time: ${time}`);
      specialLines.push(`Passengers: ${pax}`);
      specialLines.push(`Vehicle: ${vehicle.label}`);

      const res = await axios.post(`${API}/bookings/create-checkout`, {
        package_slug: cfg.slug,
        package_name: cfg.name,
        arrival_date: date,
        departure_date: date,
        num_travellers: 1,   // we charge per trip/per day, not per person
        price_per_person: total,
        total_price: total,
        deposit_amount: deposit,
        guest_name: form.name.trim(),
        guest_email: form.email.trim(),
        guest_whatsapp: fullWhatsapp,
        guest_country: "—",
        special_requests: specialLines.join(" · "),
        origin_url: window.location.origin,
        is_full_payment: cfg.fullPayment,
      });
      window.location.href = res.data.url;
    } catch (err) {
      toast.error("Could not start checkout.", { description: err?.response?.data?.detail || err?.message });
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent
        data-testid={`quickbook-${mode}`}
        className="max-w-xl md:max-w-2xl bg-sand-50 border-sand-200 p-0 overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <DialogTitle className="sr-only">{cfg.headline}</DialogTitle>
        <DialogDescription className="sr-only">{cfg.blurb}</DialogDescription>

        <div className="bg-jungle-700 text-sand-50 px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-clay-500">Step {step} of 2</p>
            <p className="font-display text-xl leading-tight mt-0.5">{cfg.headline}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {[1, 2].map((n) => (
              <span key={n} className={`h-1.5 w-8 rounded-full ${n <= step ? "bg-clay-500" : "bg-jungle-600"}`} />
            ))}
          </div>
        </div>

        <div className="px-6 py-6 md:px-8 md:py-8">
          {step === 1 && (
            <div data-testid={`quickbook-${mode}-step-1`}>
              <p className="text-[#4B5563] text-sm mb-6">{cfg.blurb}</p>

              {mode === "airport" && (
                <div className="mb-5">
                  <label className="block text-xs text-[#4B5563] mb-2">Direction</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "pickup", label: "Airport → Hotel", icon: PlaneLanding },
                      { id: "dropoff", label: "Hotel → Airport", icon: PlaneTakeoff },
                    ].map((d) => {
                      const Ic = d.icon;
                      const active = direction === d.id;
                      return (
                        <button
                          key={d.id} type="button"
                          onClick={() => setDirection(d.id)}
                          data-testid={`airport-dir-${d.id}`}
                          className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm transition-all ${
                            active
                              ? "bg-jungle-700 border-jungle-700 text-sand-50"
                              : "bg-sand-50 border-sand-200 text-[#111827] hover:border-jungle-700"
                          }`}
                        >
                          <Ic className="h-4 w-4" /> {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs text-[#4B5563] mb-2">Date</label>
                  <div className="relative">
                    <Calendar className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563] pointer-events-none" />
                    <input type="date" min={todayISO()} value={date} onChange={(e) => setDate(e.target.value)} data-testid={`qb-${mode}-date`} className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none pl-10 pr-3 py-3 text-[#111827]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#4B5563] mb-2">{mode === "airport" ? "Pickup / flight time" : "Pickup time"}</label>
                  <div className="relative">
                    <Clock className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563] pointer-events-none" />
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} data-testid={`qb-${mode}-time`} className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none pl-10 pr-3 py-3 text-[#111827]" />
                  </div>
                </div>
              </div>

              {mode === "airport" ? (
                <div className="mb-5">
                  <label className="block text-xs text-[#4B5563] mb-2">
                    {direction === "pickup" ? "Drop-off location (hotel or area)" : "Pickup location (hotel or area)"}
                  </label>
                  <div className="relative">
                    <MapPin className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563] pointer-events-none" />
                    <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Shangri-La Colombo" data-testid="qb-airport-location" className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none pl-10 pr-3 py-3 text-[#111827]" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block text-xs text-[#4B5563] mb-2">Pickup location</label>
                    <div className="relative">
                      <MapPin className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563] pointer-events-none" />
                      <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Colombo hotel" data-testid="qb-daytour-pickup" className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none pl-10 pr-3 py-3 text-[#111827]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#4B5563] mb-2">Destination</label>
                    <div className="relative">
                      <MapPin className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563] pointer-events-none" />
                      <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Sigiriya · Kandy · Galle…" data-testid="qb-daytour-dest" className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none pl-10 pr-3 py-3 text-[#111827]" />
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-5">
                <label className="block text-xs text-[#4B5563] mb-2">Vehicle</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" data-testid={`qb-${mode}-vehicles`}>
                  {cfg.vehicles.map((v) => {
                    const Ic = v.icon;
                    const active = vehicleId === v.id;
                    return (
                      <button
                        key={v.id} type="button"
                        onClick={() => setVehicleId(v.id)}
                        data-testid={`qb-${mode}-vehicle-${v.id}`}
                        className={`text-left rounded-lg border p-4 transition-all ${
                          active
                            ? "bg-jungle-700 border-jungle-700 text-sand-50"
                            : "bg-sand-50 border-sand-200 text-[#111827] hover:border-jungle-700"
                        }`}
                      >
                        <Ic className={`h-5 w-5 ${active ? "text-clay-500" : "text-jungle-700"}`} />
                        <div className="mt-2 text-sm font-medium">{v.label}</div>
                        <div className={`mt-1 font-display text-xl ${active ? "text-sand-50" : "text-[#111827]"}`}>${v.price}</div>
                        <div className={`text-[10px] uppercase tracking-wider ${active ? "text-sand-50/60" : "text-[#4B5563]"}`}>{cfg.unit}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs text-[#4B5563] mb-2">Passengers</label>
                <div className="inline-flex items-center rounded-full border border-sand-200 bg-sand-50">
                  <button type="button" onClick={() => setPax((v) => Math.max(1, v - 1))} className="h-10 w-10 flex items-center justify-center text-[#111827] hover:text-clay-500">−</button>
                  <span data-testid={`qb-${mode}-pax`} className="font-display text-xl min-w-[2.5rem] text-center text-[#111827]">{pax}</span>
                  <button type="button" onClick={() => setPax((v) => Math.min(12, v + 1))} className="h-10 w-10 flex items-center justify-center text-[#111827] hover:text-clay-500">+</button>
                </div>
              </div>

              <div className="rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 px-5 py-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[#4B5563]">{cfg.fullPayment ? "Pay in full" : "10% deposit"}</div>
                  <div className="text-xs text-[#4B5563] mt-1">Total {cfg.unit}: ${total}</div>
                </div>
                <div data-testid={`qb-${mode}-deposit`} className="font-display text-3xl text-jungle-700">${deposit}</div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!step1Valid}
                  data-testid={`qb-${mode}-step1-continue`}
                  className="inline-flex items-center gap-2 rounded-full bg-jungle-700 hover:bg-jungle-800 disabled:opacity-50 text-sand-50 px-6 py-3 text-sm font-medium transition-all"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div data-testid={`quickbook-${mode}-step-2`}>
              <h3 className="font-display text-3xl leading-tight text-[#111827]">Your details</h3>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs text-[#4B5563] mb-2">Full name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid={`qb-${mode}-name`} className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none px-4 py-3 text-[#111827]" />
                </div>
                <div>
                  <label className="block text-xs text-[#4B5563] mb-2">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid={`qb-${mode}-email`} className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none px-4 py-3 text-[#111827]" />
                </div>
                <div>
                  <label className="block text-xs text-[#4B5563] mb-2">WhatsApp number</label>
                  <div className="flex gap-2">
                    <select value={form.countryCode} onChange={(e) => setForm({ ...form, countryCode: e.target.value })} className="rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none px-3 py-3 text-[#111827]">
                      {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code}>{c.code} {c.flag}</option>)}
                    </select>
                    <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="7700 123456" data-testid={`qb-${mode}-whatsapp`} className="flex-1 rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none px-4 py-3 text-[#111827]" />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 rounded-2xl border border-sand-200 bg-sand-100 p-5 text-sm space-y-1.5">
                <div className="flex justify-between"><span className="text-[#4B5563]">Service</span><span className="text-[#111827] font-medium">{cfg.name}</span></div>
                <div className="flex justify-between"><span className="text-[#4B5563]">Vehicle</span><span className="text-[#111827] font-medium">{vehicle.label}</span></div>
                <div className="flex justify-between"><span className="text-[#4B5563]">Date · time</span><span className="text-[#111827] font-medium">{date} · {time}</span></div>
                {mode === "airport" ? (
                  <div className="flex justify-between"><span className="text-[#4B5563]">Route</span><span className="text-[#111827] font-medium">{direction === "pickup" ? `Airport → ${location}` : `${location} → Airport`}</span></div>
                ) : (
                  <div className="flex justify-between"><span className="text-[#4B5563]">Route</span><span className="text-[#111827] font-medium">{location} → {destination}</span></div>
                )}
                <div className="flex justify-between items-center border-t border-sand-200 pt-2 mt-2">
                  <span className="text-[#4B5563]">{cfg.fullPayment ? "Pay now" : "Deposit today"}</span>
                  <span className="font-display text-2xl text-jungle-700">${deposit}</span>
                </div>
              </div>

              <label className="mt-5 flex items-start gap-3 text-sm text-[#4B5563] cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} data-testid={`qb-${mode}-agree`} className="mt-1 accent-clay-500" />
                <span>{cfg.fullPayment
                  ? "I understand this is a full upfront payment, refundable if cancelled at least 48 hours before pickup."
                  : "I understand the deposit is non-refundable within 14 days of the tour but fully refundable if cancelled more than 30 days before."
                }</span>
              </label>

              <div className="mt-6 flex items-center justify-between">
                <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 text-sm text-[#4B5563] hover:text-jungle-700">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={handlePay}
                  disabled={!step2Valid || !agreed || submitting}
                  data-testid={`qb-${mode}-pay`}
                  className="inline-flex items-center gap-2 rounded-full bg-clay-500 hover:bg-clay-600 disabled:opacity-50 text-white px-6 py-3 text-sm font-medium transition-all"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                  {cfg.fullPayment ? `Pay $${deposit}` : `Pay $${deposit} Deposit`}
                </button>
              </div>
              <p className="mt-3 text-[11px] text-[#4B5563] text-center">
                Paid securely via Stripe. You'll be redirected to complete payment.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
