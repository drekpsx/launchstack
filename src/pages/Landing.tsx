import { MainLayout } from "@/components/layout/MainLayout";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { HonestExplanation } from "@/components/landing/HonestExplanation";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function Landing() {
  return (
    <MainLayout>
      <Hero />
      <HowItWorks />
      <Features />
      <HonestExplanation />
      <PricingSection />
      <FAQ />
      <FinalCTA />
    </MainLayout>
  );
}
