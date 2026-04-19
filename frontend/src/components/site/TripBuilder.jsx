import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Check, Send, MessageCircle } from "lucide-react";
import { INTERESTS, WHATSAPP_LINK } from "@/lib/siteData";
import { useLang } from "@/context/LangContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function TripBuilder() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", email: "", days: "10", message: "" });
  const [interests, setInterests] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleInterest = (tag) =>
    setInterests((prev) => (prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]));

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const buildWhatsappMessage = () => {
    const lines = [
      `Hi Serendib Local! I'd love to plan a trip.`,
      ``,
      `Name: ${form.name || "—"}`,
      `Email: ${form.email || "—"}`,
      `Days: ${form.days || "—"}`,
      `Interests: ${interests.join(", ") || "—"}`,
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
        days: Number(form.days) || 7,
        interests,
        message: form.message || null,
      });
      toast.success(t("builder.success"), { description: t("builder.successDesc") });
      window.open(WHATSAPP_LINK(buildWhatsappMessage()), "_blank", "noopener,noreferrer");
      setForm({ name: "", email: "", days: "10", message: "" });
      setInterests([]);
    } catch (err) {
      toast.error(t("builder.error"), {
        description: err?.response?.data?.detail?.[0]?.msg || err?.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="trip-builder"
      data-testid="trip-builder-section"
      className="relative bg-jungle-800 text-sand-50 py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #C05A45 0, transparent 40%), radial-gradient(circle at 80% 80%, #F9F6F0 0, transparent 40%)",
        }}
      />
      <div className="relative max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-14">
        <div className="lg:col-span-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4 reveal">
            {t("builder.eyebrow")}
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight reveal">
            {t("builder.title")}
            <span className="block italic text-sand-50/70">{t("builder.titleItalic")}</span>
          </h2>
          <p className="mt-6 text-sand-50/75 text-base md:text-lg max-w-md reveal">
            {t("builder.sub")}
          </p>

          <ul className="mt-10 space-y-3 text-sand-50/80 text-sm reveal">
            {["builder.bullet1", "builder.bullet2", "builder.bullet3"].map((k) => (
              <li key={k} className="flex items-start gap-3">
                <Check className="h-4 w-4 text-clay-500 mt-0.5 flex-none" />
                {t(k)}
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          data-testid="trip-builder-form"
          className="lg:col-span-7 bg-sand-50 text-[#111827] rounded-2xl p-7 md:p-10 reveal"
        >
          <label className="text-[11px] font-semibold uppercase tracking-[0.24em] text-clay-500">
            {t("builder.interests")}
          </label>
          <div className="mt-4 flex flex-wrap gap-2.5" data-testid="interest-pills">
            {INTERESTS.map((tag) => {
              const active = interests.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleInterest(tag)}
                  data-testid={`interest-${tag.toLowerCase().replace(/[^a-z]/g, "-")}`}
                  className={`rounded-full px-4 py-2 text-sm border transition-all ${
                    active
                      ? "bg-jungle-700 border-jungle-700 text-sand-50"
                      : "bg-sand-50 border-sand-200 text-[#111827] hover:border-jungle-700"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-[#4B5563] mb-2">{t("builder.name")}</label>
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Emma"
                data-testid="trip-form-name"
                className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 focus:ring-0 outline-none px-4 py-3 text-[#111827]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#4B5563] mb-2">{t("builder.email")}</label>
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="emma@example.com"
                data-testid="trip-form-email"
                className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-xs text-[#4B5563] mb-2">{t("builder.days")}</label>
              <input
                required
                type="number"
                min={1}
                max={60}
                name="days"
                value={form.days}
                onChange={handleChange}
                data-testid="trip-form-days"
                className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-xs text-[#4B5563] mb-2">{t("builder.when")}</label>
              <input
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder={t("builder.whenPlaceholder")}
                data-testid="trip-form-when"
                className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none px-4 py-3"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              data-testid="trip-form-submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-jungle-700 hover:bg-jungle-800 disabled:opacity-60 text-sand-50 px-7 py-4 text-sm font-medium transition-all"
            >
              <Send className="h-4 w-4" />
              {submitting ? t("builder.submitting") : t("builder.submit")}
            </button>
            <a
              href={WHATSAPP_LINK(buildWhatsappMessage())}
              target="_blank"
              rel="noreferrer"
              data-testid="trip-form-whatsapp"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-jungle-700 text-jungle-700 hover:bg-jungle-700 hover:text-sand-50 px-7 py-4 text-sm font-medium transition-all"
            >
              <MessageCircle className="h-4 w-4" /> {t("builder.chat")}
            </a>
          </div>
        </form>
      </div>
    </section>
  );
}
