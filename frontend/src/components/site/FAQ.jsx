import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    q: "What's the best time to visit Sri Lanka?",
    a: "The short answer: there's always somewhere dry. The south & west coast + hill country are best from December to March. The east coast + Jaffna are best from May to September. Shoulder months (April, October) are often the sweet spot — less crowds, lower prices, and most regions still pleasant.",
  },
  {
    q: "Is Sri Lanka safe for solo female travellers?",
    a: "Yes, overwhelmingly so — and our trips are even safer because you're with a local driver-guide the whole time, staying in vetted accommodations, and always a WhatsApp message away from us. Around 40% of our guests are solo women, many repeat travellers.",
  },
  {
    q: "Do I need a visa?",
    a: "Most nationalities need an ETA (Electronic Travel Authorisation) which costs around USD 50 and you apply online in 10 minutes at eta.gov.lk before you fly. We send you a step-by-step guide once you book.",
  },
  {
    q: "Can I customise one of your packages?",
    a: "That's literally the whole point. Every package is a starting shape — we'll rearrange days, swap hotels, add experiences, skip anything you're not into. No change fees. The price just adjusts up or down transparently.",
  },
  {
    q: "What's your cancellation policy?",
    a: "Free cancellation up to 30 days before arrival (full refund minus any hotel deposits we've already paid on your behalf). 15-29 days: 50% refund. Less than 15 days: no refund, but we can usually reschedule your trip for a small fee.",
  },
  {
    q: "How much should I budget beyond the package price?",
    a: "Roughly USD 20-40 per day per person for lunches, drinks, extra experiences and tips. Sri Lanka is still wonderfully affordable compared to most Asian destinations — a fancy seafood dinner rarely goes above USD 15.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      data-testid="faq-section"
      className="relative bg-sand-50 py-24 md:py-32"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <div className="text-center mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay-500 mb-4 reveal">
            Your questions
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight reveal">
            Before you book, the honest answers.
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
          Still something on your mind?{" "}
          <a href="#trip-builder" className="text-jungle-700 underline underline-offset-4 hover:text-clay-500">
            just ask us on WhatsApp →
          </a>
        </div>
      </div>
    </section>
  );
}
