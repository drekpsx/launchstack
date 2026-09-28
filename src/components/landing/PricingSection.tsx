import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PLANS } from "@/config/plans";
import { cn } from "@/lib/utils";

export function PricingSection({ compact = false }: { compact?: boolean }) {
  return (
    <section id="pricing" className={cn("py-20 lg:py-28", !compact && "bg-secondary/40")}>
      <div className="container-page">
        {!compact && (
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Simple, honest pricing</h2>
            <p className="mt-4 text-muted-foreground">Start free. Upgrade when you're ready to unlock everything.</p>
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {Object.values(PLANS).map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "p-8 flex flex-col",
                plan.id === "pro" && "border-primary shadow-elevated relative"
              )}
            >
              {plan.id === "pro" && (
                <span className="absolute -top-3 left-8 rounded-full bg-primary text-primary-foreground text-xs font-semibold px-3 py-1">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-xl font-bold">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{plan.tagline}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight">
                  {plan.priceMonthly === 0 ? "€0" : `€${plan.priceMonthly}`}
                </span>
                {plan.priceMonthly !== 0 && <span className="text-muted-foreground text-sm">/ month</span>}
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8" variant={plan.id === "pro" ? "default" : "outline"}>
                <Link to="/signup">{plan.id === "pro" ? "Upgrade to Pro" : "Start for free"}</Link>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
