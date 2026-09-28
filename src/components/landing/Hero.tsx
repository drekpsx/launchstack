import { Link } from "react-router-dom";
import { ArrowRight, Search, Megaphone, Video, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_TAGLINE, APP_DESCRIPTION } from "@/config/app";

const previewModules = [
  { icon: Search, label: "Product Research", done: true },
  { icon: Megaphone, label: "Meta Ads", done: true },
  { icon: Video, label: "TikTok Content", done: false },
  { icon: Mail, label: "Email Flows", done: false },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-page py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground mb-6">
              No AI API. No token bills. Just your own AI tools, personalized.
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              {APP_TAGLINE}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">{APP_DESCRIPTION}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild className="text-base">
                <Link to="/onboarding">
                  Build My System <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <Link to="/#how-it-works">See how it works</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Takes about a minute. No account needed to start.</p>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-border bg-card shadow-elevated p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm font-semibold">Your workspace</p>
                  <p className="text-xs text-muted-foreground">Personalized from your business profile</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                  8
                </div>
              </div>
              <div className="space-y-2">
                {previewModules.map((m) => (
                  <div
                    key={m.label}
                    className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 bg-background"
                  >
                    <div className="h-8 w-8 rounded-md bg-accent flex items-center justify-center">
                      <m.icon className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <span className="text-sm font-medium flex-1">{m.label}</span>
                    {m.done ? (
                      <span className="text-xs text-success font-medium">Recommended</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Ready</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-border grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold">12</p>
                  <p className="text-[11px] text-muted-foreground">Modules</p>
                </div>
                <div>
                  <p className="text-lg font-bold">5</p>
                  <p className="text-[11px] text-muted-foreground">Workflows</p>
                </div>
                <div>
                  <p className="text-lg font-bold">44+</p>
                  <p className="text-[11px] text-muted-foreground">Prompts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
