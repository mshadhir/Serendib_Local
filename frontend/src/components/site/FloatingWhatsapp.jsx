import { MessageCircle } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/siteData";
import { useLang } from "@/context/LangContext";

export default function FloatingWhatsapp() {
  const { t } = useLang();
  return (
    <a
      href={WHATSAPP_LINK()}
      target="_blank"
      rel="noreferrer"
      data-testid="floating-whatsapp"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 group"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-ring" aria-hidden />
      <span className="relative flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-[#25D366] hover:bg-[#1fb457] text-white shadow-[0_14px_30px_-10px_rgba(37,211,102,0.6)] transition-all group-hover:scale-105">
        <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
      </span>
      <span className="hidden md:inline-flex absolute right-20 top-1/2 -translate-y-1/2 whitespace-nowrap bg-jungle-900 text-sand-50 text-xs font-medium px-3 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        {t("wa.floating")}
      </span>
    </a>
  );
}
