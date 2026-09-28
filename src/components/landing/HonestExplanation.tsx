import { ShieldCheck, Wand2, Wallet } from "lucide-react";
import { APP_NAME } from "@/config/app";

const points = [
  {
    icon: Wallet,
    title: "We don't make you pay for AI calls",
    description:
      "No token bills, no usage-based pricing tied to an AI provider. Your subscription pays for the system, not for API usage.",
  },
  {
    icon: Wand2,
    title: "We personalize the system, not the answer",
    description:
      `${APP_NAME} organizes and personalizes workflows and prompts around your business profile. The AI response itself comes from your own ChatGPT, Claude, or any tool you already use.`,
  },
  {
    icon: ShieldCheck,
    title: "Always honest about what this is",
    description:
      "This is a personalization system for using AI well — not a black box that pretends to think for you. You stay in control of the final output.",
  },
];

export function HonestExplanation() {
  return (
    <section className="py-20 lg:py-28 bg-secondary/40">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">How this is actually built</h2>
          <p className="mt-4 text-muted-foreground">No smoke and mirrors. Here's exactly what happens under the hood.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {points.map((p) => (
            <div key={p.title} className="text-center md:text-left">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto md:mx-0">
                <p.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
