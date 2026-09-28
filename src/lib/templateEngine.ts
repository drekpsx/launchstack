import type { BusinessProfile } from "@/types/domain";
import {
  BUSINESS_TYPES,
  PRIMARY_GOALS,
  MAIN_OBJECTIONS,
  MONTHLY_REVENUE_RANGES,
  MAIN_PROBLEMS,
  ACQUISITION_CHANNELS,
  CONTENT_TYPES,
  labelFor,
  labelsFor,
} from "@/config/questionnaire";

/**
 * The template engine: turns a BusinessProfile into a variable map, and
 * renders {{variable}} tokens inside stored prompt content. Purely
 * deterministic string substitution — no AI/LLM call happens here.
 */

export const BASE_VARIABLE_KEYS = [
  "business_type",
  "target_country",
  "target_language",
  "monthly_revenue",
  "primary_goal",
  "product",
  "niche",
  "average_price",
  "product_cost",
  "unique_selling_point",
  "target_customer",
  "customer_problem",
  "purchase_reason",
  "main_objection",
  "acquisition_channels",
  "marketing_budget",
  "content_types",
  "revenue_goal",
  "goal_90_days",
  "main_problem",
  "desired_result",
] as const;

export const DERIVED_VARIABLE_KEYS = [
  "business_summary",
  "customer_summary",
  "offer_summary",
  "marketing_context",
] as const;

export const ALL_VARIABLE_KEYS: readonly string[] = [
  ...BASE_VARIABLE_KEYS,
  ...DERIVED_VARIABLE_KEYS,
];

export const VARIABLE_LABELS: Record<string, string> = {
  business_type: "Business type",
  target_country: "Target country",
  target_language: "Target language",
  monthly_revenue: "Monthly revenue",
  primary_goal: "Primary goal",
  product: "Product",
  niche: "Niche",
  average_price: "Average price",
  product_cost: "Product cost",
  unique_selling_point: "Unique selling point",
  target_customer: "Target customer",
  customer_problem: "Customer problem",
  purchase_reason: "Purchase reason",
  main_objection: "Main objection",
  acquisition_channels: "Acquisition channels",
  marketing_budget: "Marketing budget",
  content_types: "Content types",
  revenue_goal: "Revenue goal",
  goal_90_days: "90-day goal",
  main_problem: "Main problem",
  desired_result: "Desired result",
  business_summary: "Business summary (derived)",
  customer_summary: "Customer summary (derived)",
  offer_summary: "Offer summary (derived)",
  marketing_context: "Marketing context (derived)",
};

type VariableMap = Record<string, string | null>;

/** Builds the full {{variable}} -> value map for a business profile. null = not filled in yet. */
export function buildVariableMap(profile: BusinessProfile | null): VariableMap {
  if (!profile) {
    const empty: VariableMap = {};
    for (const key of ALL_VARIABLE_KEYS) empty[key] = null;
    return empty;
  }

  const acquisitionChannels = labelsFor(ACQUISITION_CHANNELS, profile.acquisition_channels).join(", ");
  const contentTypes = labelsFor(CONTENT_TYPES, profile.content_types).join(", ");
  const businessType = labelFor(BUSINESS_TYPES, profile.business_type);
  const primaryGoal = labelFor(PRIMARY_GOALS, profile.primary_goal);
  const mainObjection = labelFor(MAIN_OBJECTIONS, profile.main_objection);
  const monthlyRevenue = labelFor(MONTHLY_REVENUE_RANGES, profile.monthly_revenue);
  const mainProblem = labelFor(MAIN_PROBLEMS, profile.main_problem);

  const base: VariableMap = {
    business_type: businessType || null,
    target_country: profile.target_country,
    target_language: profile.target_language,
    monthly_revenue: monthlyRevenue || null,
    primary_goal: primaryGoal || null,
    product: profile.product,
    niche: profile.niche,
    average_price: profile.average_price,
    product_cost: profile.product_cost,
    unique_selling_point: profile.unique_selling_point,
    target_customer: profile.target_customer,
    customer_problem: profile.customer_problem,
    purchase_reason: profile.purchase_reason,
    main_objection: mainObjection || null,
    acquisition_channels: acquisitionChannels || null,
    marketing_budget: profile.marketing_budget,
    content_types: contentTypes || null,
    revenue_goal: profile.revenue_goal,
    goal_90_days: profile.goal_90_days,
    main_problem: mainProblem || null,
    desired_result: profile.desired_result,
  };

  const derived: VariableMap = {
    business_summary: deriveBusinessSummary(profile, base),
    customer_summary: deriveCustomerSummary(profile, base),
    offer_summary: deriveOfferSummary(profile, base),
    marketing_context: deriveMarketingContext(profile, base),
  };

  return { ...base, ...derived };
}

function deriveBusinessSummary(profile: BusinessProfile, base: VariableMap): string | null {
  if (!profile.product && !profile.niche) return null;
  const parts: string[] = [];
  parts.push(
    `${profile.product ?? "This business"} is a ${base.business_type?.toLowerCase() ?? "e-commerce"} business${
      profile.niche ? ` in the ${profile.niche} niche` : ""
    }${profile.target_customer ? ` targeting ${profile.target_customer}` : ""}.`
  );
  if (base.monthly_revenue) parts.push(`Current monthly revenue is around ${base.monthly_revenue}.`);
  if (base.primary_goal) parts.push(`The primary goal right now is to ${base.primary_goal.toLowerCase()}.`);
  return parts.join(" ");
}

function deriveCustomerSummary(profile: BusinessProfile, base: VariableMap): string | null {
  if (!profile.target_customer && !profile.customer_problem) return null;
  const parts: string[] = [];
  if (profile.target_customer) parts.push(`The ideal customer is ${profile.target_customer}.`);
  if (profile.customer_problem) parts.push(`They struggle with: ${profile.customer_problem}.`);
  if (profile.purchase_reason) parts.push(`They would buy because: ${profile.purchase_reason}.`);
  if (base.main_objection) parts.push(`Their main hesitation is usually related to ${base.main_objection.toLowerCase()}.`);
  return parts.join(" ");
}

function deriveOfferSummary(profile: BusinessProfile, base: VariableMap): string | null {
  if (!profile.product) return null;
  const parts: string[] = [`Product: ${profile.product}.`];
  if (profile.average_price) parts.push(`Sells for ${profile.average_price}${profile.product_cost ? ` (cost: ${profile.product_cost})` : ""}.`);
  if (profile.unique_selling_point) parts.push(`Unique selling point: ${profile.unique_selling_point}.`);
  if (base.main_objection) parts.push(`Main objection to overcome: ${base.main_objection}.`);
  return parts.join(" ");
}

function deriveMarketingContext(profile: BusinessProfile, base: VariableMap): string | null {
  if (!base.acquisition_channels && !profile.marketing_budget) return null;
  const parts: string[] = [];
  if (base.acquisition_channels) parts.push(`Main acquisition channels: ${base.acquisition_channels}.`);
  if (profile.marketing_budget) parts.push(`Monthly marketing budget: ${profile.marketing_budget}.`);
  if (base.content_types) parts.push(`Content types currently used: ${base.content_types}.`);
  if (profile.target_country) parts.push(`Target market: ${profile.target_country}${profile.target_language ? ` (${profile.target_language})` : ""}.`);
  return parts.join(" ");
}

const VARIABLE_TOKEN_RE = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

/** Returns every distinct {{variable}} key referenced inside a template's content. */
export function extractVariableKeys(content: string): string[] {
  const found = new Set<string>();
  for (const match of content.matchAll(VARIABLE_TOKEN_RE)) {
    found.add(match[1]);
  }
  return Array.from(found);
}

/** Admin-side validation: flags {{variables}} used in content that aren't part of the known system. */
export function findUnknownVariables(content: string): string[] {
  return extractVariableKeys(content).filter((key) => !ALL_VARIABLE_KEYS.includes(key));
}

export interface RenderResult {
  rendered: string;
  /** Variable keys referenced in the content that resolved to an empty/missing value. */
  missingKeys: string[];
}

/** Replaces every {{variable}} in content with the value from the map. */
export function renderTemplate(content: string, variables: VariableMap): RenderResult {
  const missingKeys: string[] = [];
  const rendered = content.replace(VARIABLE_TOKEN_RE, (_match, key: string) => {
    const value = variables[key];
    if (value === null || value === undefined || value === "") {
      if (!missingKeys.includes(key)) missingKeys.push(key);
      return `[${VARIABLE_LABELS[key] ?? key}]`;
    }
    return value;
  });
  return { rendered, missingKeys };
}

/** Which of a template's required_variables are not yet filled in the profile. */
export function getMissingRequiredVariables(
  requiredVariables: string[],
  profile: BusinessProfile | null
): string[] {
  const map = buildVariableMap(profile);
  return requiredVariables.filter((key) => !map[key]);
}
