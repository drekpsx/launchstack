import { MainLayout } from "@/components/layout/MainLayout";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQ } from "@/components/landing/FAQ";

export default function Pricing() {
  return (
    <MainLayout>
      <div className="container-page pt-16 pb-4 text-center">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">Pricing</h1>
        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
          Start free, no credit card required. Upgrade whenever you want the full system.
        </p>
      </div>
      <PricingSection compact />
      <FAQ />
    </MainLayout>
  );
}
