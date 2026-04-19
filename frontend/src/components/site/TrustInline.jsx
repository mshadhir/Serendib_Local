import { Lock, CheckCircle2, MessageCircle } from "lucide-react";

export default function TrustInline({ variant = "light" }) {
  const cls = variant === "dark" ? "text-sand-50/80" : "text-[#4B5563]";
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-xs ${cls}`} data-testid="trust-inline">
      <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-clay-500" /> Secure payment via Stripe</span>
      <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-clay-500" /> Free cancellation 30+ days out</span>
      <span className="inline-flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5 text-clay-500" /> WhatsApp support 24/7</span>
    </div>
  );
}
