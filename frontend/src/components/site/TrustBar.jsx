import { ShieldCheck, Star, Car, Leaf } from "lucide-react";
import { TRUST_ITEMS } from "@/lib/siteData";

const ICONS = { ShieldCheck, Star, Car, Leaf };

export default function TrustBar() {
  return (
    <section
      data-testid="trust-bar"
      className="relative bg-jungle-700 text-sand-50 border-y border-jungle-600"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 md:py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
        {TRUST_ITEMS.map((t) => {
          const Icon = ICONS[t.icon] || ShieldCheck;
          return (
            <div
              key={t.label}
              data-testid={`trust-item-${t.label.toLowerCase().replace(/[^a-z]/g, "-")}`}
              className="flex items-center gap-3"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-jungle-600 text-clay-500">
                <Icon className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <span className="text-[13px] md:text-sm tracking-wide font-medium leading-tight">
                {t.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
