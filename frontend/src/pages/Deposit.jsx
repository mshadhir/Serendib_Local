import { useEffect, useState, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  ArrowLeft, CreditCard, ShieldCheck, Lock, CheckCircle2, XCircle, Loader2, MessageCircle, RefreshCw,
} from "lucide-react";
import { getPackageBySlug } from "@/lib/packages";
import { useCurrency } from "@/context/CurrencyContext";
import FloatingWhatsapp from "@/components/site/FloatingWhatsapp";
import Footer from "@/components/site/Footer";
import { BRAND, WHATSAPP_LINK } from "@/lib/siteData";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DEPOSIT_PCT = 0.1;

export default function Deposit() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const pkg = getPackageBySlug(slug);
  const { format } = useCurrency();

  const sessionId = searchParams.get("session_id");
  const cancelled = searchParams.get("cancelled");

  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // PaymentStatusResponse shape
  const [attempts, setAttempts] = useState(0);

  // Poll on return from Stripe
  useEffect(() => {
    if (!sessionId) return;
    let cancelledFlag = false;
    const MAX = 12; // ~24s total
    const poll = async (n) => {
      if (cancelledFlag) return;
      setPolling(true);
      setAttempts(n);
      try {
        const res = await axios.get(`${API}/payments/status/${sessionId}`);
        setPaymentStatus(res.data);
        const terminal =
          res.data.payment_status === "paid" ||
          res.data.status === "expired" ||
          res.data.payment_status === "failed";
        if (terminal) {
          setPolling(false);
          return;
        }
        if (n >= MAX) {
          setPolling(false);
          toast("Still processing — check your email, we'll confirm shortly.");
          return;
        }
        setTimeout(() => poll(n + 1), 2000);
      } catch (err) {
        setPolling(false);
        toast.error("Could not fetch payment status.", { description: err?.message });
      }
    };
    poll(1);
    return () => {
      cancelledFlag = true;
    };
  }, [sessionId]);

  const depositUSD = useMemo(() => (pkg ? Math.round(pkg.price.USD * DEPOSIT_PCT) : 0), [pkg]);
  const remainingUSD = useMemo(() => (pkg ? pkg.price.USD - depositUSD : 0), [pkg, depositUSD]);

  if (!pkg) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-sand-50 px-6 text-center">
        <div>
          <h1 className="font-display text-4xl text-[#111827]">Package not found</h1>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-jungle-700 text-sand-50 px-6 py-3 text-sm">
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
        </div>
      </main>
    );
  }

  const handlePay = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.name.trim()) {
      toast.error("Please enter your name and email.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/payments/checkout`, {
        package_slug: pkg.slug,
        origin_url: window.location.origin,
        customer_email: form.email.trim(),
        customer_name: form.name.trim(),
      });
      window.location.href = res.data.url;
    } catch (err) {
      toast.error("Could not start checkout.", {
        description: err?.response?.data?.detail || err?.message,
      });
      setLoading(false);
    }
  };

  // ---------- Return from Stripe ----------
  if (sessionId) {
    const paid = paymentStatus?.payment_status === "paid";
    const expired = paymentStatus?.status === "expired";
    const failed = paymentStatus?.payment_status === "failed";

    return (
      <main className="min-h-screen bg-sand-50" data-testid="deposit-return">
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <Link
            to={`/packages/${pkg.slug}`}
            className="inline-flex items-center gap-2 text-sm text-[#4B5563] hover:text-jungle-700 mb-10"
          >
            <ArrowLeft className="h-4 w-4" /> Back to {pkg.title}
          </Link>

          <div className="rounded-2xl border border-sand-200 bg-sand-50 p-8 md:p-12 text-center">
            {polling && !paid && !expired && !failed && (
              <>
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-jungle-700 text-clay-500">
                  <Loader2 className="h-7 w-7 animate-spin" />
                </span>
                <h1 data-testid="deposit-polling" className="mt-6 font-display text-4xl md:text-5xl leading-tight">
                  Confirming your payment…
                </h1>
                <p className="mt-4 text-[#4B5563]">
                  Hold tight — this usually takes a few seconds. (attempt {attempts})
                </p>
              </>
            )}

            {paid && (
              <>
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-jungle-700 text-[#25D366]">
                  <CheckCircle2 className="h-8 w-8" />
                </span>
                <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-clay-500">Payment received</p>
                <h1 data-testid="deposit-success" className="mt-3 font-display text-4xl md:text-5xl leading-tight">
                  Your dates are locked. 🎉
                </h1>
                <p className="mt-5 text-[#4B5563] max-w-md mx-auto">
                  Thank you! We've received your <strong>${depositUSD}</strong> deposit for <strong>{pkg.title}</strong>. We'll WhatsApp you within 2 hours to confirm the itinerary and hotel picks.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <a
                    href={WHATSAPP_LINK(`Hi! I just paid the deposit for "${pkg.title}". Can we jump on WhatsApp?`)}
                    target="_blank"
                    rel="noreferrer"
                    data-testid="deposit-success-whatsapp"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1fb457] text-white px-6 py-3 text-sm font-medium"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp us
                  </a>
                  <Link to="/" className="inline-flex items-center rounded-full border border-sand-200 px-6 py-3 text-sm font-medium text-[#111827] hover:border-jungle-700">
                    Back to site
                  </Link>
                </div>
              </>
            )}

            {(expired || failed) && (
              <>
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-clay-500/15 text-clay-500">
                  <XCircle className="h-8 w-8" />
                </span>
                <h1 data-testid="deposit-failed" className="mt-6 font-display text-4xl leading-tight">
                  Payment didn't go through.
                </h1>
                <p className="mt-4 text-[#4B5563] max-w-md mx-auto">
                  No charge was made. Try again, or ping us on WhatsApp and we'll sort you out the old-fashioned way.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link
                    to={`/deposit/${pkg.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-jungle-700 text-sand-50 px-6 py-3 text-sm font-medium"
                  >
                    <RefreshCw className="h-4 w-4" /> Try again
                  </Link>
                  <a
                    href={WHATSAPP_LINK()}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-sand-200 px-6 py-3 text-sm font-medium text-[#111827]"
                  >
                    <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
        <Footer />
        <FloatingWhatsapp />
      </main>
    );
  }

  // ---------- Pay screen ----------
  return (
    <main className="min-h-screen bg-sand-50" data-testid="deposit-page">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <Link
          to={`/packages/${pkg.slug}`}
          className="inline-flex items-center gap-2 text-sm text-[#4B5563] hover:text-jungle-700 mb-10"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {pkg.title}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: summary */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-sand-200">
              <div className="relative aspect-[4/3] bg-jungle-900">
                <img src={pkg.image} alt={pkg.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute left-5 top-5">
                  <span className="inline-flex items-center rounded-full bg-sand-50/90 text-jungle-700 text-[11px] tracking-[0.18em] uppercase font-semibold px-3.5 py-1.5">
                    {pkg.label}
                  </span>
                </div>
                <div className="absolute left-6 right-6 bottom-6 text-white">
                  <div className="font-display text-3xl md:text-4xl leading-tight">{pkg.title}</div>
                  <div className="text-white/80 text-sm mt-1">{pkg.durationLabel} · {pkg.priceNote}</div>
                </div>
              </div>
              <div className="p-7 bg-sand-50">
                <p className="text-[11px] uppercase tracking-[0.22em] text-clay-500 mb-3">You're paying</p>
                <div className="flex items-end gap-4">
                  <div>
                    <div className="font-display text-5xl md:text-6xl leading-none text-[#111827]" data-testid="deposit-amount">
                      ${depositUSD}
                    </div>
                    <div className="text-xs text-[#4B5563] mt-2">10% refundable deposit · USD</div>
                  </div>
                </div>
                <div className="mt-6 text-sm text-[#4B5563] border-t border-sand-200 pt-5 space-y-2">
                  <div className="flex justify-between"><span>Full trip price</span><span className="text-[#111827] font-medium">{format(pkg.price)}</span></div>
                  <div className="flex justify-between"><span>Deposit today</span><span className="text-[#111827] font-medium">${depositUSD}</span></div>
                  <div className="flex justify-between"><span>Balance (due 14 days before arrival)</span><span className="text-[#111827] font-medium">${remainingUSD}</span></div>
                </div>
              </div>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-[#4B5563]">
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-clay-500" /> Refundable up to 30 days before arrival</li>
              <li className="flex items-center gap-2"><Lock className="h-4 w-4 text-clay-500" /> Paid securely via Stripe — we never see your card</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-clay-500" /> 24/7 WhatsApp support from {BRAND.name}</li>
            </ul>
          </div>

          {/* Right: form */}
          <form
            onSubmit={handlePay}
            data-testid="deposit-form"
            className="lg:col-span-6 rounded-2xl bg-jungle-700 text-sand-50 p-8 md:p-10"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500">Lock your dates</p>
            <h1 className="mt-3 font-display text-4xl md:text-5xl leading-[1.05]">Pay a 10% deposit.</h1>
            <p className="mt-4 text-sand-50/75 max-w-md">
              Locks your dates on our side and frees your driver-guide from other bookings. Full trip payment is only due 14 days before arrival.
            </p>

            {cancelled && (
              <div className="mt-6 rounded-xl bg-clay-500/15 border border-clay-500/30 text-sand-50 p-4 text-sm">
                Payment cancelled — no charge was made. Give it another go when you're ready.
              </div>
            )}

            <div className="mt-8 space-y-4">
              <div>
                <label className="block text-xs text-sand-50/70 mb-2">Your name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Emma Robinson"
                  data-testid="deposit-name"
                  className="w-full rounded-lg bg-jungle-800 border border-jungle-600 focus:border-clay-500 outline-none px-4 py-3 text-sand-50 placeholder:text-sand-50/40"
                />
              </div>
              <div>
                <label className="block text-xs text-sand-50/70 mb-2">Email (for receipt + confirmation)</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="emma@example.com"
                  data-testid="deposit-email"
                  className="w-full rounded-lg bg-jungle-800 border border-jungle-600 focus:border-clay-500 outline-none px-4 py-3 text-sand-50 placeholder:text-sand-50/40"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="deposit-pay-btn"
              className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-full bg-clay-500 hover:bg-clay-600 disabled:opacity-60 text-white px-7 py-4 text-sm font-medium transition-all"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
              {loading ? "Redirecting to Stripe…" : `Pay $${depositUSD} deposit securely`}
            </button>

            <p className="mt-5 text-[11px] text-sand-50/50 text-center">
              You'll be redirected to Stripe's secure checkout. Powered by Stripe.
            </p>
          </form>
        </div>
      </div>
      <Footer />
      <FloatingWhatsapp />
    </main>
  );
}
