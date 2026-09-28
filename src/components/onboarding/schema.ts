import { z } from "zod";

// The quiz is intentionally short and mostly multiple-choice — it has to work
// for a total beginner who has never run a store and doesn't have a product
// yet. Every field is always present in the form (so saving is simple), but
// only a handful are actually required (`.min(1)`); everything else can be
// left blank and filled in later from "My Business".
export const businessProfileSchema = z.object({
  // Step 1 — the 3 essentials, one click each
  business_type: z.string().min(1, "Please select one"),
  primary_goal: z.string().min(1, "Please select one"),
  monthly_revenue: z.string().min(1, "Please select one"),

  // Step 2 — your product, kept light (niche is a click, product is optional)
  niche: z.string().min(1, "Please select one"),
  product: z.string().trim().max(200).optional().default(""),
  average_price: z.string().trim().max(50).optional().default(""),

  // Step 3 — how you sell, both simple choices
  acquisition_channels: z.array(z.string()).min(1, "Select at least one"),
  main_problem: z.string().min(1, "Please select one"),

  // Step 4 — optional extra detail for better-personalized prompts
  target_country: z.string().trim().max(100).optional().default(""),
  target_language: z.string().trim().max(50).optional().default(""),
  product_cost: z.string().trim().max(50).optional().default(""),
  unique_selling_point: z.string().trim().max(500).optional().default(""),
  target_customer: z.string().trim().max(500).optional().default(""),
  customer_problem: z.string().trim().max(500).optional().default(""),
  purchase_reason: z.string().trim().max(500).optional().default(""),
  main_objection: z.string().trim().optional().default(""),
  marketing_budget: z.string().trim().max(50).optional().default(""),
  content_types: z.array(z.string()).optional().default([]),
  revenue_goal: z.string().trim().max(50).optional().default(""),
  goal_90_days: z.string().trim().max(500).optional().default(""),
  desired_result: z.string().trim().max(500).optional().default(""),
});

export type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;

export const STEP_FIELDS: Array<Array<keyof BusinessProfileFormData>> = [
  ["business_type", "primary_goal", "monthly_revenue"],
  ["niche", "product", "average_price"],
  ["acquisition_channels", "main_problem"],
  [
    "target_country",
    "target_language",
    "product_cost",
    "unique_selling_point",
    "target_customer",
    "customer_problem",
    "purchase_reason",
    "main_objection",
    "marketing_budget",
    "content_types",
    "revenue_goal",
    "goal_90_days",
    "desired_result",
  ],
];

export const STEP_TITLES = ["Your business", "Your product", "How you sell", "More detail (optional)"];

export const defaultBusinessProfileValues: BusinessProfileFormData = {
  business_type: "",
  primary_goal: "",
  monthly_revenue: "",
  niche: "",
  product: "",
  average_price: "",
  acquisition_channels: [],
  main_problem: "",
  target_country: "",
  target_language: "",
  product_cost: "",
  unique_selling_point: "",
  target_customer: "",
  customer_problem: "",
  purchase_reason: "",
  main_objection: "",
  marketing_budget: "",
  content_types: [],
  revenue_goal: "",
  goal_90_days: "",
  desired_result: "",
};
