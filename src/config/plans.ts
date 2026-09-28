import type { Plan } from "@/types/domain";

// TEMP pricing/limits — a config object on purpose (not hardcoded inline in
// components, not a hardcoded price in Stripe checkout code) so it can be
// changed in one place once real pricing is decided, without touching the
// rest of the app.

export interface PlanDefinition {
  id: Plan;
  name: string;
  priceMonthly: number | null;
  billingInterval: "month" | null;
  tagline: string;
  features: string[];
  limits: {
    /** Templates marked `premium` in the DB are locked unless plan is 'pro'. */
    premiumTemplates: boolean;
    /** Full step-by-step workflows (premium steps included) vs. first step only. */
    fullWorkflows: boolean;
    maxFavorites: number;
    historyEntries: number;
  };
}

export const PLANS: Record<Plan, PlanDefinition> = {
  free: {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    billingInterval: "month",
    tagline: "Build your business profile and try the system.",
    features: [
      "Full business questionnaire & profile",
      "Product Research module (full access)",
      "1 starter prompt in every other module",
      "Preview every workflow",
      "Favorites & prompt history",
    ],
    limits: {
      premiumTemplates: false,
      fullWorkflows: false,
      maxFavorites: 10,
      historyEntries: 20,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceMonthly: 29,
    billingInterval: "month",
    tagline: "The full personalized AI e-commerce system.",
    features: [
      "Every module, fully unlocked",
      "Every workflow, start to finish",
      "New prompts as we add them",
      "Unlimited favorites & history",
      "Priority support",
    ],
    limits: {
      premiumTemplates: true,
      fullWorkflows: true,
      maxFavorites: Infinity,
      historyEntries: Infinity,
    },
  },
};

export function canAccessTemplate(plan: Plan, premium: boolean): boolean {
  if (!premium) return true;
  return PLANS[plan].limits.premiumTemplates;
}
