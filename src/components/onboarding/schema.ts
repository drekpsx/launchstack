import { z } from "zod";

export const businessProfileSchema = z.object({
  // Section A — Business
  business_type: z.string().min(1, "Please select one"),
  target_country: z.string().trim().min(1, "Required").max(100),
  target_language: z.string().trim().min(1, "Required").max(50),
  monthly_revenue: z.string().min(1, "Please select one"),
  primary_goal: z.string().min(1, "Please select one"),

  // Section B — Product
  product: z.string().trim().min(1, "Required").max(200),
  niche: z.string().trim().min(1, "Required").max(200),
  average_price: z.string().trim().min(1, "Required").max(50),
  product_cost: z.string().trim().min(1, "Required").max(50),
  unique_selling_point: z.string().trim().min(1, "Required").max(500),

  // Section C — Customer
  target_customer: z.string().trim().min(1, "Required").max(500),
  customer_problem: z.string().trim().min(1, "Required").max(500),
  purchase_reason: z.string().trim().min(1, "Required").max(500),
  main_objection: z.string().min(1, "Please select one"),

  // Section D — Acquisition
  acquisition_channels: z.array(z.string()).min(1, "Select at least one"),
  marketing_budget: z.string().trim().min(1, "Required").max(50),
  content_types: z.array(z.string()).min(1, "Select at least one"),

  // Section E — Goals
  revenue_goal: z.string().trim().min(1, "Required").max(50),
  goal_90_days: z.string().trim().min(1, "Required").max(500),
  main_problem: z.string().min(1, "Please select one"),
  desired_result: z.string().trim().min(1, "Required").max(500),
});

export type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;

export const STEP_FIELDS: Array<Array<keyof BusinessProfileFormData>> = [
  ["business_type", "target_country", "target_language", "monthly_revenue", "primary_goal"],
  ["product", "niche", "average_price", "product_cost", "unique_selling_point"],
  ["target_customer", "customer_problem", "purchase_reason", "main_objection"],
  ["acquisition_channels", "marketing_budget", "content_types"],
  ["revenue_goal", "goal_90_days", "main_problem", "desired_result"],
];

export const STEP_TITLES = ["Your business", "Your product", "Your customer", "Acquisition", "Your goals"];

export const defaultBusinessProfileValues: BusinessProfileFormData = {
  business_type: "",
  target_country: "",
  target_language: "",
  monthly_revenue: "",
  primary_goal: "",
  product: "",
  niche: "",
  average_price: "",
  product_cost: "",
  unique_selling_point: "",
  target_customer: "",
  customer_problem: "",
  purchase_reason: "",
  main_objection: "",
  acquisition_channels: [],
  marketing_budget: "",
  content_types: [],
  revenue_goal: "",
  goal_90_days: "",
  main_problem: "",
  desired_result: "",
};
