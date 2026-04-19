import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, MessageCircle, Loader2, Calendar, Users, Home as HomeIcon } from "lucide-react";
import { WHATSAPP_LINK, BRAND } from "@/lib/siteData";
import Footer from "@/components/site/Footer";
import FloatingWhatsapp from "@/components/site/FloatingWhatsapp";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function BookingConfirmed() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [booking, setBooking] = useState(null);
  const [polling, setPolling] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    const MAX = 15;

    const poll = async (n) => {
      if (cancelled) return;
      setPolling(true);
      setAttempts(n);
      try {
        const res = await axios.get(`${API}/bookings/status/${sessionId}`);
        setBooking(res.data);
        if (res.data.payment_status === "paid") {
          setPolling(false);
          return;
        }
        if (n >= MAX) {
          setPolling(false);
          return;
        }
        setTimeout(() => poll(n + 1), 2000);
      } catch {
        if (n >= MAX) setPolling(false);
        else setTimeout(() => poll(n + 1), 2500);
      }
    };
    poll(1);
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const paid = booking?.payment_status === "paid";

  return (
    <main className="min-h-screen bg-sand-50" data-testid="booking-confirmed-page">
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#4B5563] hover:text-jungle-700 mb-10">
          <HomeIcon className="h-4 w-4" /> Back to site
        </Link>

        <div className="rounded-2xl border border-sand-200 bg-sand-50 p-8 md:p-12 text-center">
          {!paid && polling && (
            <>
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-jungle-700 text-clay-500">
                <Loader2 className="h-7 w-7 animate-spin" />
              </span>
              <h1 className="mt-6 font-display text-4xl md:text-5xl leading-tight">Confirming your payment…</h1>
              <p className="mt-4 text-[#4B5563]">Hold tight — this usually takes a few seconds. (attempt {attempts})</p>
            </>
          )}

          {!paid && !polling && (
            <>
              <h1 className="mt-6 font-display text-4xl leading-tight">Still processing</h1>
              <p className="mt-4 text-[#4B5563] max-w-md mx-auto">
                Payment is still confirming. We've taken no charge yet. If this persists, ping us on WhatsApp and we'll sort it.
              </p>
              <a
                href={WHATSAPP_LINK()}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-6 py-3 text-sm font-medium"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp us
              </a>
            </>
          )}

          {paid && booking && (
            <>
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white">
                <CheckCircle2 className="h-9 w-9" strokeWidth={2.2} />
              </span>
              <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-clay-500">Booking confirmed</p>
              <h1 data-testid="booking-success" className="mt-3 font-display text-4xl md:text-5xl leading-tight">
                You're booked in! 🎉
              </h1>
              <p className="mt-4 text-[#4B5563]">Your deposit is confirmed and your dates are locked.</p>

              <div className="mt-8 rounded-2xl border border-sand-200 bg-sand-100 p-6 text-left text-sm">
                <p className="text-[11px] uppercase tracking-[0.22em] text-clay-500 mb-4">Booking summary</p>
                <dl className="space-y-2">
                  <Row k="Package" v={booking.package_name} />
                  <Row k="Arrival" v={booking.arrival_date} icon={Calendar} />
                  <Row k="Departure" v={booking.departure_date} icon={Calendar} />
                  <Row k="Travellers" v={booking.num_travellers} icon={Users} />
                  <Row k="Total trip price" v={`$${Number(booking.total_price).toLocaleString()}`} />
                  <Row k="Deposit paid" v={`$${Number(booking.deposit_amount).toLocaleString()}`} bold />
                  <Row k="Balance due" v={`$${Number(booking.balance_due).toLocaleString()} (30 days before arrival)`} />
                  <Row k="Name" v={booking.guest_name} />
                  <Row k="Email" v={booking.guest_email} />
                </dl>
              </div>

              <p className="mt-8 text-[#4B5563] max-w-md mx-auto">
                We'll WhatsApp you within 2 hours to introduce ourselves and start planning your trip in detail.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a
                  href={WHATSAPP_LINK(`Hi! I just booked the "${booking.package_name}" — my dates are ${booking.arrival_date} to ${booking.departure_date}. Looking forward to chatting!`)}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="booking-whatsapp"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1fb457] text-white px-6 py-3 text-sm font-medium"
                >
                  <MessageCircle className="h-4 w-4" /> Chat with us now
                </a>
                <Link to="/" className="inline-flex items-center rounded-full border border-sand-200 hover:border-jungle-700 px-6 py-3 text-sm font-medium text-[#111827]">
                  Back to site
                </Link>
              </div>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-[#4B5563]">
          Questions? <a href={`mailto:${BRAND.email}`} className="underline underline-offset-4 text-jungle-700">{BRAND.email}</a>
        </p>
      </div>
      <Footer />
      <FloatingWhatsapp />
    </main>
  );
}

function Row({ k, v, bold, icon: Icon }) {
  return (
    <div className="flex justify-between items-center">
      <dt className="text-[#4B5563] inline-flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-clay-500" />} {k}
      </dt>
      <dd className={`text-[#111827] ${bold ? "font-display text-lg" : "font-medium"}`}>{v}</dd>
    </div>
  );
}
