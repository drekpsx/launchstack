// Canonical option values used by the onboarding questionnaire, the
// personalization engine and the admin template/workflow condition editors.
// Keeping these in one place guarantees the values a user picks in the
// questionnaire always line up with the values templates/workflows filter on.

export interface Option {
  value: string;
  label: string;
}

export const BUSINESS_TYPES: Option[] = [
  { value: "new_store", label: "I'm just starting" },
  { value: "existing_store", label: "I have an online store already" },
  { value: "brand", label: "E-commerce brand" },
  { value: "dropshipping", label: "Dropshipping" },
  { value: "print_on_demand", label: "Print-on-demand" },
  { value: "digital_product", label: "Digital product" },
  { value: "other", label: "Other" },
];

export const MONTHLY_REVENUE_RANGES: Option[] = [
  { value: "0", label: "€0" },
  { value: "under_1k", label: "Under €1,000" },
  { value: "1k_5k", label: "€1,000 – €5,000" },
  { value: "5k_10k", label: "€5,000 – €10,000" },
  { value: "10k_50k", label: "€10,000 – €50,000" },
  { value: "50k_plus", label: "€50,000+" },
];

export const PRIMARY_GOALS: Option[] = [
  { value: "find_product", label: "Find a product" },
  { value: "launch_store", label: "Launch my store" },
  { value: "first_sales", label: "Get my first sales" },
  { value: "increase_revenue", label: "Increase my revenue" },
  { value: "improve_profitability", label: "Improve my profitability" },
  { value: "grow_brand", label: "Grow my brand" },
  { value: "automate_marketing", label: "Automate my marketing" },
  { value: "other", label: "Other" },
];

export const MAIN_OBJECTIONS: Option[] = [
  { value: "price", label: "Price" },
  { value: "trust", label: "Trust" },
  { value: "quality", label: "Quality" },
  { value: "shipping", label: "Shipping" },
  { value: "real_need", label: "Not sure they need it" },
  { value: "comparison", label: "Comparing with competitors" },
  { value: "unknown", label: "I don't know" },
  { value: "other", label: "Other" },
];

export const ACQUISITION_CHANNELS: Option[] = [
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "meta_ads", label: "Meta Ads" },
  { value: "google_ads", label: "Google Ads" },
  { value: "seo", label: "SEO" },
  { value: "email", label: "Email" },
  { value: "influencers", label: "Influencers" },
  { value: "organic", label: "Organic" },
  { value: "none", label: "None yet" },
];

export const CONTENT_TYPES: Option[] = [
  { value: "ugc", label: "UGC" },
  { value: "product_videos", label: "Product videos" },
  { value: "reels", label: "Reels" },
  { value: "tiktok", label: "TikTok" },
  { value: "images", label: "Images" },
  { value: "blog", label: "Blog" },
  { value: "email", label: "Email" },
  { value: "none", label: "None yet" },
];

export const MAIN_PROBLEMS: Option[] = [
  { value: "product", label: "Product" },
  { value: "acquisition", label: "Acquisition" },
  { value: "ads", label: "Advertising" },
  { value: "conversion", label: "Conversion" },
  { value: "content_creation", label: "Content creation" },
  { value: "seo", label: "SEO" },
  { value: "email", label: "Email" },
  { value: "offer", label: "Offer" },
  { value: "positioning", label: "Positioning" },
  { value: "organization", label: "Organization" },
  { value: "unknown", label: "I don't know" },
];

export function labelFor(options: Option[], value: string | null | undefined): string {
  if (!value) return "";
  return options.find((o) => o.value === value)?.label ?? value;
}

export function labelsFor(options: Option[], values: string[] | null | undefined): string[] {
  if (!values) return [];
  return values.map((v) => labelFor(options, v));
}
