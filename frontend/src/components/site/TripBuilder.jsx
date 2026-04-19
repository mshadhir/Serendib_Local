import { useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  ArrowLeft, ArrowRight, Check, Send, MessageCircle, Loader2,
  Car, Truck, Bus, MapPin, Calendar, Users, Sparkles, RotateCcw,
} from "lucide-react";
import {
  TRIP_LOCATIONS, TRIP_EXPERIENCES, WHATSAPP_LINK,
} from "@/lib/siteData";
import { useLang } from "@/context/LangContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Vehicle options match Vehicles section daily pricing.
const VEHICLES = [
  { id: "sedan", label: "Sedan",      seats: "1–3 pax", dailyUSD: 85,  icon: Car },
  { id: "suv",   label: "SUV",        seats: "1–5 pax", dailyUSD: 110, icon: Truck },
  { id: "van",   label: "Family Van", seats: "1–8 pax", dailyUSD: 140, icon: Bus },
];

// Regions drive the location grid grouping.
const REGIONS = [
  "Capital", "West Coast", "Cultural Triangle", "Hill Country",
  "South Coast", "East Coast", "North",
];

const STEPS = [
  { id: 1, label: "Trip basics",   icon: Calendar },
  { id: 2, label: "Pick stops",    icon: MapPin },
  { id: 3, label: "Experiences",   icon: Sparkles },
  { id: 4, label: "Your details",  icon: Send },
];

const DAY_PRESETS = [5, 7, 10, 14];

export default function TripBuilder() {
  const { t } = useLang();
  const [step, setStep] = useState(1);
  const [days, setDays] = useState(10);
  const [travellers, setTravellers] = useState(2);
  const [vehicleId, setVehicleId] = useState("suv");
  const [travelMonth, setTravelMonth] = useState("");
  const [locations, setLocations] = useState(["sigiriya", "kandy", "ella"]);
  const [experiences, setExperiences] = useState(["rice-curry", "safari"]);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const vehicle = VEHICLES.find((v) => v.id === vehicleId) || VEHICLES[1];
  const estimatedTotalUSD = vehicle.dailyUSD * days;

  const locationsByRegion = useMemo(() => {
    const grouped = {};
    for (const r of REGIONS) grouped[r] = [];
    for (const loc of TRIP_LOCATIONS) {
      if (!grouped[loc.region]) grouped[loc.region] = [];
      grouped[loc.region].push(loc);
    }
    return grouped;
  }, []);

  const toggleLocation = (slug) =>
    setLocations((prev) => (prev.includes(slug) ? prev.filter((x) => x !== slug) : [...prev, slug]));
  const toggleExperience = (slug) =>
    setExperiences((prev) => (prev.includes(slug) ? prev.filter((x) => x !== slug) : [...prev, slug]));

  const resetAll = () => {
    setStep(1); setDays(10); setTravellers(2); setVehicleId("suv");
    setTravelMonth(""); setLocations([]); setExperiences([]);
    setForm({ name: "", email: "", message: "" });
  };

  const locationNames = () =>
    locations.map((s) => TRIP_LOCATIONS.find((l) => l.slug === s)?.name).filter(Boolean);
  const experienceLabels = () =>
    experiences.map((s) => TRIP_EXPERIENCES.find((e) => e.slug === s)?.label).filter(Boolean);

  const buildWhatsappMessage = () => {
    const lines = [
      `Hi Serendib Local! I'd like help planning a private car & driver trip.`, ``,
      `Name: ${form.name || "—"}`,
      `Email: ${form.email || "—"}`,
      `Days: ${days}`,
      `Travellers: ${travellers}`,
      `Vehicle: ${vehicle.label} (${vehicle.seats})`,
      `Travel month: ${travelMonth || "flexible"}`,
      `Stops: ${locationNames().join(", ") || "—"}`,
      `Experiences: ${experienceLabels().join(", ") || "—"}`,
      `Est. driver total: $${estimatedTotalUSD} (accommodation + food separate)`,
    ];
    if (form.message) lines.push(``, `Notes: ${form.message}`);
    return lines.join("\n");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error(t("builder.errorRequired"));
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/trip-inquiries`, {
        name: form.name.trim(),
        email: form.email.trim(),
        days: Number(days) || 7,
        travellers: Number(travellers) || 2,
        vehicle: vehicle.label,
        travel_month: travelMonth || null,
        locations,
        interests: experiences,
        message: form.message || null,
      });
      toast.success(t("builder.success"), { description: t("builder.successDesc") });
      window.open(WHATSAPP_LINK(buildWhatsappMessage()), "_blank", "noopener,noreferrer");
      resetAll();
    } catch (err) {
      toast.error(t("builder.error"), {
        description: err?.response?.data?.detail?.[0]?.msg || err?.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const canContinueFromStep = (n) => {
    if (n === 2) return locations.length >= 1;
    return true;
  };

  return (
    <section
      id="trip-builder"
      data-testid="trip-builder-section"
      className="relative bg-jungle-800 text-sand-50 py-24 md:py-32 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #C05A45 0, transparent 40%), radial-gradient(circle at 80% 80%, #F9F6F0 0, transparent 40%)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4 reveal">
            {t("builder.eyebrow")}
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight reveal">
            Build your own private car & driver trip.
            <span className="block italic text-sand-50/70">We'll stitch the route together.</span>
          </h2>
          <p className="mt-6 text-sand-50/75 text-base md:text-lg max-w-2xl reveal">
            Pick your days, the stops you want to see, and the experiences you'd love along the way —
            we'll come back within a few hours with a full driver-led itinerary and a final price.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Stepper + form */}
          <form
            onSubmit={handleSubmit}
            data-testid="trip-builder-form"
            className="lg:col-span-8 bg-sand-50 text-[#111827] rounded-2xl p-6 md:p-10 reveal"
          >
            {/* Stepper */}
            <div className="flex items-center gap-2 md:gap-3 mb-8" data-testid="tb-stepper">
              {STEPS.map((s, i) => {
                const Ic = s.icon;
                const active = s.id === step;
                const done = s.id < step;
                return (
                  <div key={s.id} className="flex items-center gap-2 md:gap-3 flex-1">
                    <button
                      type="button"
                      onClick={() => s.id < step && setStep(s.id)}
                      data-testid={`tb-step-${s.id}`}
                      className={`inline-flex items-center gap-2 rounded-full px-3 md:px-4 py-2 text-xs md:text-sm transition-all ${
                        active
                          ? "bg-jungle-700 text-sand-50"
                          : done
                          ? "bg-jungle-700/10 text-jungle-700 hover:bg-jungle-700/20"
                          : "bg-sand-100 text-[#4B5563]"
                      }`}
                    >
                      <Ic className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      <span className="hidden sm:inline">{s.label}</span>
                      <span className="sm:hidden">{s.id}</span>
                    </button>
                    {i < STEPS.length - 1 && (
                      <span className={`hidden md:block flex-1 h-[2px] ${done ? "bg-jungle-700" : "bg-sand-200"}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* ---------- Step 1 : Trip basics ---------- */}
            {step === 1 && (
              <div data-testid="tb-step1">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-clay-500 mb-3">
                  How many days?
                </label>
                <div className="flex flex-wrap items-center gap-2" data-testid="tb-day-presets">
                  {DAY_PRESETS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDays(d)}
                      data-testid={`tb-days-${d}`}
                      className={`rounded-full px-5 py-2.5 text-sm border transition-all ${
                        days === d
                          ? "bg-jungle-700 border-jungle-700 text-sand-50"
                          : "bg-sand-50 border-sand-200 text-[#111827] hover:border-jungle-700"
                      }`}
                    >
                      {d} days
                    </button>
                  ))}
                  <div className="inline-flex items-center rounded-full border border-sand-200 bg-sand-50 ml-0 sm:ml-2">
                    <button
                      type="button"
                      onClick={() => setDays((v) => Math.max(1, v - 1))}
                      className="h-10 w-10 flex items-center justify-center text-[#111827] hover:text-clay-500"
                      aria-label="Decrease days"
                    >−</button>
                    <span data-testid="tb-days-value" className="font-display text-lg min-w-[3.5rem] text-center text-[#111827]">
                      {days}d
                    </span>
                    <button
                      type="button"
                      onClick={() => setDays((v) => Math.min(45, v + 1))}
                      className="h-10 w-10 flex items-center justify-center text-[#111827] hover:text-clay-500"
                      aria-label="Increase days"
                    >+</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-clay-500 mb-3">
                      Travellers
                    </label>
                    <div className="inline-flex items-center rounded-full border border-sand-200 bg-sand-50">
                      <button
                        type="button"
                        onClick={() => setTravellers((v) => Math.max(1, v - 1))}
                        className="h-10 w-10 flex items-center justify-center text-[#111827] hover:text-clay-500"
                        aria-label="Fewer travellers"
                      >−</button>
                      <span data-testid="tb-travellers-value" className="font-display text-lg min-w-[3.5rem] text-center text-[#111827] inline-flex items-center gap-1.5 justify-center">
                        <Users className="h-4 w-4 text-clay-500" /> {travellers}
                      </span>
                      <button
                        type="button"
                        onClick={() => setTravellers((v) => Math.min(12, v + 1))}
                        className="h-10 w-10 flex items-center justify-center text-[#111827] hover:text-clay-500"
                        aria-label="More travellers"
                      >+</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-clay-500 mb-3">
                      When are you thinking?
                    </label>
                    <input
                      value={travelMonth}
                      onChange={(e) => setTravelMonth(e.target.value)}
                      placeholder="e.g. Feb 2026 · flexible"
                      data-testid="tb-travel-month"
                      className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none px-4 py-3 text-[#111827]"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-clay-500 mb-3">
                    Vehicle
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" data-testid="tb-vehicles">
                    {VEHICLES.map((v) => {
                      const Ic = v.icon;
                      const active = vehicleId === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setVehicleId(v.id)}
                          data-testid={`tb-vehicle-${v.id}`}
                          className={`text-left rounded-xl border p-4 transition-all ${
                            active
                              ? "bg-jungle-700 border-jungle-700 text-sand-50"
                              : "bg-sand-50 border-sand-200 text-[#111827] hover:border-jungle-700"
                          }`}
                        >
                          <Ic className={`h-5 w-5 ${active ? "text-clay-500" : "text-jungle-700"}`} />
                          <div className="mt-2 text-sm font-medium">{v.label}</div>
                          <div className={`text-xs ${active ? "text-sand-50/70" : "text-[#4B5563]"}`}>{v.seats}</div>
                          <div className={`mt-2 font-display text-xl ${active ? "text-sand-50" : "text-[#111827]"}`}>
                            ${v.dailyUSD}
                          </div>
                          <div className={`text-[10px] uppercase tracking-wider ${active ? "text-sand-50/60" : "text-[#4B5563]"}`}>
                            / day w/ driver
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ---------- Step 2 : Locations ---------- */}
            {step === 2 && (
              <div data-testid="tb-step2">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay-500">
                      Where do you want to go?
                    </p>
                    <p className="text-sm text-[#4B5563] mt-1">
                      Tap any stops — we'll route them in the smartest order.
                    </p>
                  </div>
                  <span
                    data-testid="tb-locations-count"
                    className="inline-flex items-center gap-1.5 rounded-full bg-jungle-700 text-sand-50 px-3 py-1.5 text-xs font-medium"
                  >
                    <MapPin className="h-3.5 w-3.5" /> {locations.length} picked
                  </span>
                </div>

                <div className="space-y-6" data-testid="tb-locations">
                  {REGIONS.map((region) => {
                    const items = locationsByRegion[region] || [];
                    if (!items.length) return null;
                    return (
                      <div key={region}>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-[#4B5563] font-semibold mb-3">
                          {region}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {items.map((loc) => {
                            const active = locations.includes(loc.slug);
                            return (
                              <button
                                key={loc.slug}
                                type="button"
                                onClick={() => toggleLocation(loc.slug)}
                                data-testid={`tb-loc-${loc.slug}`}
                                className={`group rounded-xl border px-4 py-3 text-left transition-all min-w-[180px] ${
                                  active
                                    ? "bg-jungle-700 border-jungle-700 text-sand-50"
                                    : "bg-sand-50 border-sand-200 text-[#111827] hover:border-jungle-700"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-sm">{loc.emoji} {loc.name}</span>
                                  {active && <Check className="h-4 w-4 text-clay-500" />}
                                </div>
                                <div className={`mt-0.5 text-[11px] ${active ? "text-sand-50/75" : "text-[#4B5563]"}`}>
                                  {loc.note}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {locations.length === 0 && (
                  <p className="mt-6 text-xs text-clay-600">Pick at least one stop to continue.</p>
                )}
              </div>
            )}

            {/* ---------- Step 3 : Experiences ---------- */}
            {step === 3 && (
              <div data-testid="tb-step3">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay-500">
                      Experiences to work in?
                    </p>
                    <p className="text-sm text-[#4B5563] mt-1">
                      Optional — tap anything that sounds fun and we'll build it in.
                    </p>
                  </div>
                  <span
                    data-testid="tb-experiences-count"
                    className="inline-flex items-center gap-1.5 rounded-full bg-jungle-700 text-sand-50 px-3 py-1.5 text-xs font-medium"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> {experiences.length} picked
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5" data-testid="tb-experiences">
                  {TRIP_EXPERIENCES.map((exp) => {
                    const active = experiences.includes(exp.slug);
                    return (
                      <button
                        key={exp.slug}
                        type="button"
                        onClick={() => toggleExperience(exp.slug)}
                        data-testid={`tb-exp-${exp.slug}`}
                        className={`rounded-full border px-4 py-2.5 text-sm transition-all ${
                          active
                            ? "bg-jungle-700 border-jungle-700 text-sand-50"
                            : "bg-sand-50 border-sand-200 text-[#111827] hover:border-jungle-700"
                        }`}
                      >
                        <span className="mr-1.5">{exp.emoji}</span>{exp.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ---------- Step 4 : Contact ---------- */}
            {step === 4 && (
              <div data-testid="tb-step4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay-500">
                  Almost there — where should we send the plan?
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                  <div>
                    <label className="block text-xs text-[#4B5563] mb-2">Your name</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Emma"
                      data-testid="tb-name"
                      className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none px-4 py-3"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#4B5563] mb-2">Email</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="emma@example.com"
                      data-testid="tb-email"
                      className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none px-4 py-3"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block text-xs text-[#4B5563] mb-2">Any notes for us? (optional)</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Pace, dietary needs, must-do things, budget hints…"
                    data-testid="tb-notes"
                    rows={3}
                    className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none px-4 py-3 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Nav buttons */}
            <div className="mt-8 flex items-center justify-between gap-3">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((n) => Math.max(1, n - 1))}
                  data-testid="tb-back"
                  className="inline-flex items-center gap-2 text-sm text-[#4B5563] hover:text-jungle-700"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resetAll}
                  data-testid="tb-reset"
                  className="inline-flex items-center gap-2 text-xs text-[#4B5563] hover:text-jungle-700"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  disabled={!canContinueFromStep(step + 1) && step === 1}
                  onClick={() => {
                    if (step === 2 && locations.length === 0) {
                      toast.error("Pick at least one stop.");
                      return;
                    }
                    setStep((n) => Math.min(4, n + 1));
                  }}
                  data-testid="tb-continue"
                  className="inline-flex items-center gap-2 rounded-full bg-jungle-700 hover:bg-jungle-800 disabled:opacity-50 text-sand-50 px-6 py-3 text-sm font-medium transition-all"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <a
                    href={WHATSAPP_LINK(buildWhatsappMessage())}
                    target="_blank"
                    rel="noreferrer"
                    data-testid="tb-whatsapp"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-jungle-700 text-jungle-700 hover:bg-jungle-700 hover:text-sand-50 px-5 py-3 text-sm font-medium transition-all"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                  <button
                    type="submit"
                    disabled={submitting}
                    data-testid="tb-submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-clay-500 hover:bg-clay-600 disabled:opacity-60 text-white px-6 py-3 text-sm font-medium transition-all"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {submitting ? "Sending…" : "Send my trip"}
                  </button>
                </div>
              )}
            </div>
          </form>

          {/* Live summary */}
          <aside className="lg:col-span-4 reveal">
            <div
              data-testid="tb-summary"
              className="sticky top-28 rounded-2xl bg-jungle-700 text-sand-50 border border-jungle-600 p-6 md:p-7"
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-clay-500 font-semibold">
                Your trip so far
              </p>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sand-50/70 inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-clay-500" /> Days
                  </span>
                  <span className="font-medium">{days} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sand-50/70 inline-flex items-center gap-2">
                    <Users className="h-4 w-4 text-clay-500" /> Travellers
                  </span>
                  <span className="font-medium">{travellers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sand-50/70 inline-flex items-center gap-2">
                    <Car className="h-4 w-4 text-clay-500" /> Vehicle
                  </span>
                  <span className="font-medium">{vehicle.label}</span>
                </div>
                {travelMonth && (
                  <div className="flex items-center justify-between">
                    <span className="text-sand-50/70">Travel month</span>
                    <span className="font-medium">{travelMonth}</span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-jungle-600">
                <p className="text-[11px] uppercase tracking-[0.22em] text-sand-50/60 mb-2">
                  Stops ({locations.length})
                </p>
                {locations.length === 0 ? (
                  <p className="text-xs text-sand-50/55">Pick places in Step 2.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {locationNames().map((n) => (
                      <span key={n} className="inline-flex items-center rounded-full bg-jungle-800 border border-jungle-600 text-sand-50/90 px-2.5 py-1 text-[11px]">
                        {n}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-jungle-600">
                <p className="text-[11px] uppercase tracking-[0.22em] text-sand-50/60 mb-2">
                  Experiences ({experiences.length})
                </p>
                {experiences.length === 0 ? (
                  <p className="text-xs text-sand-50/55">Pick add-ons in Step 3.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {experienceLabels().map((l) => (
                      <span key={l} className="inline-flex items-center rounded-full bg-jungle-800 border border-jungle-600 text-sand-50/90 px-2.5 py-1 text-[11px]">
                        {l}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-xl bg-clay-500/15 border border-clay-500/40 px-4 py-3">
                <div className="text-[10px] uppercase tracking-[0.22em] text-clay-500 font-semibold">
                  Est. driver cost
                </div>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <span className="font-display text-3xl" data-testid="tb-estimate">
                    ${estimatedTotalUSD}
                  </span>
                  <span className="text-xs text-sand-50/70">for {days} days</span>
                </div>
                <p className="mt-1 text-[11px] text-sand-50/65 leading-snug">
                  Indicative only. Excludes fuel · tolls · accommodation · entry tickets — we'll
                  share a line-by-line final quote after we design the route.
                </p>
              </div>

              <ul className="mt-5 space-y-2 text-[12px] text-sand-50/75">
                <li className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-clay-500 mt-0.5 flex-none" />
                  No booking fees until you approve the route
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-clay-500 mt-0.5 flex-none" />
                  10% deposit to lock the dates, balance on arrival
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-clay-500 mt-0.5 flex-none" />
                  We reply on WhatsApp, 7 days a week
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
