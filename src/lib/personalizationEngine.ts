import type { BusinessProfile, Module, PromptTemplate, Workflow } from "@/types/domain";

/**
 * The personalization engine. Pure, deterministic rule-based logic — no AI
 * call of any kind. It decides:
 *  1) which modules to highlight on the dashboard (getRecommendedModuleSlugs)
 *  2) how relevant a given template/workflow is to this business
 *     (scoreItem, per the point system: +3 channel, +3 goal, +2 business
 *     type, +2 problem, +1 niche keyword match)
 */

interface ConditionedItem {
  business_types: string[];
  channels: string[];
  goals: string[];
  problems: string[];
  tags?: string[];
}

export function scoreItem(item: ConditionedItem, profile: BusinessProfile | null): number {
  if (!profile) return 0;
  let score = 0;

  if (item.channels.length > 0 && profile.acquisition_channels?.some((c) => item.channels.includes(c))) {
    score += 3;
  }
  if (item.goals.length > 0 && profile.primary_goal && item.goals.includes(profile.primary_goal)) {
    score += 3;
  }
  if (item.business_types.length > 0 && profile.business_type && item.business_types.includes(profile.business_type)) {
    score += 2;
  }
  if (item.problems.length > 0 && profile.main_problem && item.problems.includes(profile.main_problem)) {
    score += 2;
  }
  if (profile.niche && item.tags?.length) {
    const niche = profile.niche.toLowerCase();
    const nicheMatch = item.tags.some(
      (tag) => niche.includes(tag.toLowerCase()) || tag.toLowerCase().includes(niche)
    );
    if (nicheMatch) score += 1;
  }

  return score;
}

/** Sorts templates/workflows by relevance score (desc), keeping DB sort_order as the tiebreaker. */
export function sortByRelevance<T extends ConditionedItem & { sort_order: number }>(
  items: T[],
  profile: BusinessProfile | null
): T[] {
  return [...items]
    .map((item) => ({ item, score: scoreItem(item, profile) }))
    .sort((a, b) => b.score - a.score || a.item.sort_order - b.item.sort_order)
    .map(({ item }) => item);
}

export function isRecommended(item: ConditionedItem, profile: BusinessProfile | null): boolean {
  return scoreItem(item, profile) > 0;
}

// ----------------------------------------------------------------------------
// Module recommendation rules — mirrors the master-prompt rule examples:
// business type, acquisition channel and main problem each push relevant
// module slugs. This drives the "recommended for you" section of the
// dashboard; every module always stays reachable from the sidebar.
// ----------------------------------------------------------------------------

export function getRecommendedModuleSlugs(profile: BusinessProfile | null): string[] {
  if (!profile) return ["product-research", "product-validation"];

  const modules: string[] = [];
  const push = (...slugs: string[]) => {
    for (const slug of slugs) if (!modules.includes(slug)) modules.push(slug);
  };

  switch (profile.business_type) {
    case "new_store":
    case "dropshipping":
    case "print_on_demand":
      push("product-research", "product-validation", "offer");
      break;
    case "existing_store":
    case "brand":
      push("store-optimization", "competitor-analysis");
      break;
    default:
      break;
  }

  const channels = profile.acquisition_channels ?? [];
  if (channels.includes("tiktok")) push("tiktok", "content");
  if (channels.includes("meta_ads") || channels.includes("facebook") || channels.includes("instagram")) push("meta-ads");
  if (channels.includes("seo")) push("seo");
  if (channels.includes("email")) push("email");
  if (channels.includes("influencers")) push("tiktok", "content");

  switch (profile.primary_goal) {
    case "find_product":
      push("product-research", "product-validation");
      break;
    case "launch_store":
      push("offer", "product-page");
      break;
    case "first_sales":
      push("offer", "meta-ads", "tiktok");
      break;
    case "grow_brand":
      push("competitor-analysis", "customer-research");
      break;
    case "automate_marketing":
      push("email", "content");
      break;
    case "improve_profitability":
      push("offer", "store-optimization");
      break;
    default:
      break;
  }

  switch (profile.main_problem) {
    case "conversion":
      push("store-optimization", "product-page", "offer");
      break;
    case "content_creation":
      push("content", "tiktok");
      break;
    case "offer":
      push("offer");
      break;
    case "positioning":
      push("competitor-analysis", "customer-research");
      break;
    case "seo":
      push("seo");
      break;
    case "email":
      push("email");
      break;
    case "product":
      push("product-research", "product-validation");
      break;
    case "acquisition":
    case "ads":
      push("meta-ads", "tiktok");
      break;
    default:
      break;
  }

  if (modules.length === 0) push("product-research", "product-validation", "customer-research");

  return modules.slice(0, 6);
}

export function getRecommendedModules(modules: Module[], profile: BusinessProfile | null): Module[] {
  const recommendedSlugs = getRecommendedModuleSlugs(profile);
  return recommendedSlugs
    .map((slug) => modules.find((m) => m.slug === slug))
    .filter((m): m is Module => Boolean(m));
}

/** One-line, human-readable reason a module was recommended — shown on the dashboard. */
export function getModuleRecommendationReason(slug: string, profile: BusinessProfile | null): string {
  if (!profile) return "A good place to start.";
  const channels = profile.acquisition_channels ?? [];
  if (slug === "tiktok" && channels.includes("tiktok")) return "Your main channel is TikTok.";
  if (slug === "meta-ads" && (channels.includes("meta_ads") || channels.includes("facebook") || channels.includes("instagram")))
    return "You're running Meta Ads.";
  if (slug === "seo" && channels.includes("seo")) return "SEO is one of your channels.";
  if (slug === "email" && channels.includes("email")) return "Email is one of your channels.";
  if (slug === "store-optimization" && profile.main_problem === "conversion") return "Conversion is your main problem right now.";
  if ((slug === "product-research" || slug === "product-validation") && profile.primary_goal === "find_product")
    return "Your goal is to find a product.";
  if (slug === "offer" && profile.main_problem === "offer") return "Your offer needs work right now.";
  if ((slug === "competitor-analysis" || slug === "customer-research") && profile.primary_goal === "grow_brand")
    return "You're focused on growing your brand.";
  return "Recommended based on your business profile.";
}

export function scoreTemplate(template: PromptTemplate, profile: BusinessProfile | null): number {
  return scoreItem(template, profile);
}

export function scoreWorkflow(workflow: Workflow, profile: BusinessProfile | null): number {
  return scoreItem(workflow, profile);
}
