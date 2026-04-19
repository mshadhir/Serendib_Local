import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLang } from "@/context/LangContext";
import { useCMS } from "@/context/ContentContext";

const FALLBACK_FAQS = [
  { q: "What's the best time to visit Sri Lanka?", a: "There's always somewhere dry — see our live FAQ managed from admin." },
];

export default function FAQ() {
  const { t } = useLang();
  const cmsFaqs = useCMS("faqs");
  const FAQS = cmsFaqs?.length ? cmsFaqs : FALLBACK_FAQS;
  return (
    <section
      id="faq"
      data-testid="faq-section"
      className="relative bg-sand-50 py-24 md:py-32"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <div className="text-center mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4 reveal">
            {t("faq.eyebrow")}
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight reveal">
            {t("faq.title")}
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`faq-${i}`}
              data-testid={`faq-item-${i}`}
              className="rounded-2xl border border-sand-200 bg-sand-50 px-6 data-[state=open]:bg-sand-100 transition-colors reveal"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <AccordionTrigger className="py-6 text-left font-display text-xl md:text-[1.4rem] leading-tight text-[#111827] hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-[#4B5563] text-[15px] leading-relaxed pb-6 pr-2">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center text-[#4B5563] reveal">
          {t("faq.stillQuestion")}{" "}
          <a href="#trip-builder" className="text-jungle-700 underline underline-offset-4 hover:text-clay-500">
            {t("faq.askWhatsapp")}
          </a>
        </div>
      </div>
    </section>
  );
}
