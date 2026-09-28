import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { APP_NAME } from "@/config/app";

const faqs = [
  {
    q: "Do I need ChatGPT to use this?",
    a: `You need access to some AI chat tool — ChatGPT, Claude, Gemini or similar — to actually run the prompts ${APP_NAME} personalizes for you. Most have a free tier that works fine.`,
  },
  {
    q: "Can I use Claude instead of ChatGPT?",
    a: "Yes. Every prompt is written to work well in any modern AI chat tool, including Claude, ChatGPT and others.",
  },
  {
    q: "Does the SaaS generate the answers itself?",
    a: `No. ${APP_NAME} personalizes and organizes the prompts based on your business profile. You copy the prompt and run it in your own AI tool — we never call an AI API on our end.`,
  },
  {
    q: "Is this good for beginners?",
    a: "Yes — that's the point. You don't need to know anything about prompt engineering. Just answer the questionnaire and every prompt comes pre-filled with your business context.",
  },
  {
    q: "Can I edit my business info later?",
    a: "Yes, anytime from My Business in your dashboard. Every prompt updates automatically to reflect your latest answers.",
  },
  {
    q: "Can I use the same prompt more than once?",
    a: "Yes, as many times as you want. You can also save prompts to Favorites and revisit your History at any time.",
  },
  {
    q: "What happens if my business changes?",
    a: "Just update your Business Profile. Every module, workflow and prompt is generated from that profile, so everything stays in sync.",
  },
];

export function FAQ() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-page max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Frequently asked questions</h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-medium">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
