import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowRight, ArrowLeft, Plus, Minus, Check, CreditCard, Loader2, Calendar,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const COUNTRIES = [
  "United Kingdom", "Germany", "Australia", "India", "France", "United States",
  "Netherlands", "Canada", "Japan", "Singapore", "Other",
];
const COUNTRY_CODES = [
  { code: "+44", flag: "GB" }, { code: "+49", flag: "DE" }, { code: "+61", flag: "AU" },
  { code: "+91", flag: "IN" }, { code: "+33", flag: "FR" }, { code: "+1", flag: "US" },
  { code: "+31", flag: "NL" }, { code: "+65", flag: "SG" }, { code: "+81", flag: "JP" },
  { code: "+94", flag: "LK" },
];

function daysBetween(a, b) {
  if (!a || !b) return 0;
  const d1 = new Date(a);
  const d2 = new Date(b);
  return Math.max(0, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
}

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function BookNowModal({ open, onOpenChange, pkg }) {
  // pkg can be a regular package OR { slug: 'custom-road-trip', title: 'Fully Handled Road Trip', pricePerDayUSD: 150, isCustom: true }
  const [step, setStep] = useState(1);
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [travellers, setTravellers] = useState(2);
  const [form, setForm] = useState({
    name: "", email: "", countryCode: "+44", whatsapp: "",
    country: "United Kingdom", specialRequests: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!pkg) return null;

  const days = daysBetween(arrival, departure);
  const isCustom = !!pkg.isCustom;
  const pricePerPerson = isCustom
    ? (pkg.pricePerDayUSD || 150) * Math.max(1, days)
    : (pkg.price?.USD || 0);
  const total = pricePerPerson * travellers;
  const deposit = Math.round(total * 0.1);
  const balance = total - deposit;

  const canContinue1 = !!arrival && !!departure && days >= 1 && travellers >= 1 && pricePerPerson > 0;
  const canContinue2 = form.name.trim() && form.email.trim() && form.whatsapp.trim();

  const reset = () => {
    setStep(1); setArrival(""); setDeparture(""); setTravellers(2);
    setForm({ name: "", email: "", countryCode: "+44", whatsapp: "", country: "United Kingdom", specialRequests: "" });
    setAgreed(false);
  };

  const handleClose = (v) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const handlePay = async () => {
    if (!agreed) {
      toast.error("Please acknowledge the cancellation policy.");
      return;
    }
    setSubmitting(true);
    try {
      const fullWhatsapp = `${form.countryCode}${form.whatsapp.replace(/[^0-9]/g, "")}`;
      const res = await axios.post(`${API}/bookings/create-checkout`, {
        package_slug: pkg.slug,
        package_name: pkg.title,
        arrival_date: arrival,
        departure_date: departure,
        num_travellers: travellers,
        price_per_person: pricePerPerson,
        total_price: total,
        deposit_amount: deposit,
        guest_name: form.name.trim(),
        guest_email: form.email.trim(),
        guest_whatsapp: fullWhatsapp,
        guest_country: form.country,
        special_requests: form.specialRequests || null,
        origin_url: window.location.origin,
      });
      window.location.href = res.data.url;
    } catch (err) {
      toast.error("Could not start checkout.", { description: err?.response?.data?.detail || err?.message });
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        data-testid="book-now-modal"
        className="max-w-xl md:max-w-2xl bg-sand-50 border-sand-200 p-0 overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Hidden title/description for screen readers */}
        <DialogTitle className="sr-only">Book {pkg.title}</DialogTitle>
        <DialogDescription className="sr-only">Multi-step booking flow for {pkg.title}</DialogDescription>

        {/* Header */}
        <div className="bg-jungle-700 text-sand-50 px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-clay-500">Book · step {step} of 3</p>
            <p className="font-display text-xl leading-tight mt-0.5">{pkg.title}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className={`h-1.5 w-8 rounded-full transition-colors ${
                  n <= step ? "bg-clay-500" : "bg-jungle-600"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="px-6 py-6 md:px-8 md:py-8">
          {/* ---------- STEP 1 ---------- */}
          {step === 1 && (
            <div data-testid="book-step-1">
              <h3 className="font-display text-3xl md:text-4xl leading-tight text-[#111827]">When are you coming?</h3>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#4B5563] mb-2">Arrival date</label>
                  <div className="relative">
                    <Calendar className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563] pointer-events-none" />
                    <input
                      type="date"
                      min={todayISO()}
                      value={arrival}
                      onChange={(e) => setArrival(e.target.value)}
                      data-testid="book-arrival"
                      className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none pl-10 pr-3 py-3 text-[#111827]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#4B5563] mb-2">Departure date</label>
                  <div className="relative">
                    <Calendar className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563] pointer-events-none" />
                    <input
                      type="date"
                      min={arrival || todayISO()}
                      value={departure}
                      onChange={(e) => setDeparture(e.target.value)}
                      data-testid="book-departure"
                      className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none pl-10 pr-3 py-3 text-[#111827]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-xs text-[#4B5563] mb-2">Number of travellers</label>
                <div className="inline-flex items-center rounded-full border border-sand-200 bg-sand-50">
                  <button
                    type="button"
                    onClick={() => setTravellers((v) => Math.max(1, v - 1))}
                    data-testid="book-travellers-minus"
                    className="h-11 w-11 flex items-center justify-center text-[#111827] hover:text-clay-500"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span
                    data-testid="book-travellers-count"
                    className="font-display text-2xl min-w-[3rem] text-center text-[#111827]"
                  >
                    {travellers}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTravellers((v) => Math.min(12, v + 1))}
                    data-testid="book-travellers-plus"
                    className="h-11 w-11 flex items-center justify-center text-[#111827] hover:text-clay-500"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-sand-200 bg-sand-100 p-5" data-testid="book-price-summary">
                <p className="text-[11px] uppercase tracking-[0.22em] text-clay-500">Price summary</p>
                <div className="mt-3 text-sm text-[#4B5563] space-y-1.5">
                  <div className="flex justify-between"><span>{pkg.title}</span><span className="text-[#111827] font-medium">{isCustom ? `$${pkg.pricePerDayUSD}/day/pp` : `$${pkg.price?.USD}/pp`}</span></div>
                  <div className="flex justify-between"><span>Trip length</span><span className="text-[#111827] font-medium">{days} day{days === 1 ? "" : "s"}</span></div>
                  <div className="flex justify-between"><span>Travellers</span><span className="text-[#111827] font-medium">{travellers}</span></div>
                  <div className="flex justify-between border-t border-sand-200 pt-2 mt-2">
                    <span>Total estimate</span>
                    <span className="text-[#111827] font-display text-xl">${total.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-4 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 px-4 py-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#111827] font-medium text-sm">10% deposit to confirm</span>
                    <span data-testid="book-deposit-amount" className="font-display text-2xl text-jungle-700">${deposit.toLocaleString()}</span>
                  </div>
                  <p className="text-[11px] text-[#4B5563] mt-1">Full balance due 30 days before arrival</p>
                </div>
              </div>

              <div className="mt-7 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!canContinue1}
                  data-testid="book-step1-continue"
                  className="inline-flex items-center gap-2 rounded-full bg-jungle-700 hover:bg-jungle-800 disabled:opacity-50 disabled:cursor-not-allowed text-sand-50 px-6 py-3 text-sm font-medium transition-all"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ---------- STEP 2 ---------- */}
          {step === 2 && (
            <div data-testid="book-step-2">
              <h3 className="font-display text-3xl md:text-4xl leading-tight text-[#111827]">Tell us about yourself</h3>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs text-[#4B5563] mb-2">Full name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    data-testid="book-name"
                    className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none px-4 py-3 text-[#111827]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#4B5563] mb-2">Email address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    data-testid="book-email"
                    className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none px-4 py-3 text-[#111827]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#4B5563] mb-2">WhatsApp number</label>
                  <div className="flex gap-2">
                    <select
                      value={form.countryCode}
                      onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
                      data-testid="book-country-code"
                      className="rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none px-3 py-3 text-[#111827]"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>{c.code} {c.flag}</option>
                      ))}
                    </select>
                    <input
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      placeholder="7700 123456"
                      required
                      data-testid="book-whatsapp"
                      className="flex-1 rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none px-4 py-3 text-[#111827]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#4B5563] mb-2">Country you're travelling from</label>
                  <select
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    data-testid="book-country"
                    className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none px-4 py-3 text-[#111827]"
                  >
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#4B5563] mb-2">Any special requests or questions (optional)</label>
                  <textarea
                    value={form.specialRequests}
                    onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                    placeholder="Dietary requirements, mobility needs, specific places you want to visit..."
                    rows={3}
                    data-testid="book-requests"
                    className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none px-4 py-3 text-[#111827]"
                  />
                </div>
              </div>

              <div className="mt-7 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 text-sm text-[#4B5563] hover:text-jungle-700"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!canContinue2}
                  data-testid="book-step2-continue"
                  className="inline-flex items-center gap-2 rounded-full bg-jungle-700 hover:bg-jungle-800 disabled:opacity-50 text-sand-50 px-6 py-3 text-sm font-medium transition-all"
                >
                  Review & Pay Deposit <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ---------- STEP 3 ---------- */}
          {step === 3 && (
            <div data-testid="book-step-3">
              <h3 className="font-display text-3xl md:text-4xl leading-tight text-[#111827]">Confirm your booking</h3>

              <div className="mt-6 rounded-2xl border border-sand-200 bg-sand-100 p-5 text-sm">
                <dl className="space-y-2">
                  <Row k="Package" v={pkg.title} />
                  <Row k="Dates" v={`${arrival} → ${departure} (${days} day${days === 1 ? "" : "s"})`} />
                  <Row k="Travellers" v={travellers} />
                  <Row k="Total trip price" v={`$${total.toLocaleString()}`} />
                  <Row k="Name" v={form.name} />
                  <Row k="Email" v={form.email} />
                  <Row k="WhatsApp" v={`${form.countryCode} ${form.whatsapp}`} />
                </dl>
              </div>

              <div className="mt-5 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/40 p-5 text-center">
                <div className="text-[11px] uppercase tracking-[0.22em] text-[#4B5563]">Deposit today</div>
                <div data-testid="book-review-deposit" className="mt-1 font-display text-5xl text-jungle-700 leading-none">
                  ${deposit.toLocaleString()}
                </div>
                <div className="mt-2 text-xs text-[#4B5563]">Balance ${balance.toLocaleString()} due 30 days before arrival</div>
              </div>

              <label className="mt-6 flex items-start gap-3 text-sm text-[#4B5563] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  data-testid="book-agree"
                  className="mt-1 accent-clay-500"
                />
                <span>
                  I understand the deposit is non-refundable within 14 days of arrival but fully refundable if cancelled more than 30 days before.
                </span>
              </label>

              <div className="mt-7 flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 text-sm text-[#4B5563] hover:text-jungle-700"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={handlePay}
                  disabled={!agreed || submitting}
                  data-testid="book-pay"
                  className="inline-flex items-center gap-2 rounded-full bg-clay-500 hover:bg-clay-600 disabled:opacity-50 text-white px-6 py-3 text-sm font-medium transition-all"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                  Pay ${deposit.toLocaleString()} Deposit
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

function Row({ k, v }) {
  return (
    <div className="flex justify-between">
      <dt className="text-[#4B5563]">{k}</dt>
      <dd className="text-[#111827] font-medium">{v}</dd>
    </div>
  );
}
