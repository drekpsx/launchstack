import { ClipboardList, LayoutDashboard, Copy } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Tell us about your business",
    description: "Answer a short, guided questionnaire about your product, customer, channels and goals.",
  },
  {
    icon: LayoutDashboard,
    title: "Get your personalized system",
    description: "Your workspace is automatically built around your answers — the right modules, workflows and prompts.",
  },
  {
    icon: Copy,
    title: "Use AI with your own tools",
    description: "Copy any prompt and paste it into ChatGPT, Claude, or whichever AI tool you already use.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-secondary/40">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">How it works</h2>
          <p className="mt-4 text-muted-foreground">Three steps between you and a fully personalized AI e-commerce system.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-xl bg-primary flex items-center justify-center shrink-0">
                  <step.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-4xl font-display font-extrabold text-border select-none">0{i + 1}</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
