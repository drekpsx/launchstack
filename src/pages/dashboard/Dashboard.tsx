import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useBusinessProfile } from "@/hooks/useProfile";
import { useModules, useAllTemplates, useWorkflows } from "@/hooks/useContent";
import {
  getRecommendedModules,
  getModuleRecommendationReason,
  sortByRelevance,
} from "@/lib/personalizationEngine";
import { getIcon } from "@/lib/iconMap";
import { Skeleton } from "@/components/ui/skeleton";

const QUICK_ACTIONS = [
  { label: "Find a product", templateTitle: "Find Winning Product Ideas" },
  { label: "Analyze my product", templateTitle: "Analyze a Product Idea" },
  { label: "Create an offer", templateTitle: "Value Proposition Generator" },
  { label: "Write my product page", templateTitle: "Product Title & Subtitle" },
  { label: "Create TikTok hooks", templateTitle: "Create 20 TikTok Hooks" },
  { label: "Create Meta ads", templateTitle: "Meta Ads Primary Text & Headlines" },
  { label: "Create UGC scripts", templateTitle: "UGC Creator Brief" },
  { label: "Build an email sequence", templateTitle: "Welcome Email Sequence" },
  { label: "Analyze competitors", templateTitle: "Competitor Teardown" },
  { label: "Improve my conversion rate", templateTitle: "Store UX & Conversion Audit" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: businessProfile, isLoading: businessLoading } = useBusinessProfile();
  const { data: modules, isLoading: modulesLoading } = useModules();
  const { data: templates } = useAllTemplates();
  const { data: workflows } = useWorkflows();

  const firstName = profile?.first_name || (user?.user_metadata?.first_name as string | undefined) || "there";

  const recommendedModules = modules ? getRecommendedModules(modules, businessProfile ?? null) : [];
  const topWorkflow = workflows ? sortByRelevance(workflows, businessProfile ?? null)[0] : undefined;

  const moduleBySlugMap = new Map((modules ?? []).map((m) => [m.id, m.slug]));
  const quickActionLinks = QUICK_ACTIONS.map((action) => {
    const template = templates?.find((t) => t.title === action.templateTitle);
    const moduleSlug = template ? moduleBySlugMap.get(template.module_id) : undefined;
    return { ...action, href: template && moduleSlug ? `/dashboard/modules/${moduleSlug}?open=${template.id}` : null };
  });

  if (!businessLoading && !businessProfile) {
    return (
      <div className="max-w-lg">
        <h1 className="font-display text-2xl font-bold">Welcome, {firstName}.</h1>
        <p className="mt-2 text-muted-foreground">
          Finish your business profile to unlock your personalized dashboard.
        </p>
        <Card className="mt-6 p-6">
          <Link to="/onboarding" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
            Complete the questionnaire <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Hello, {firstName}.</h1>
        <p className="mt-1 text-muted-foreground">Here's what you can work on today.</p>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recommended for you</h2>
        {modulesLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedModules.map((module) => {
              const Icon = getIcon(module.icon);
              return (
                <Link key={module.id} to={`/dashboard/modules/${module.slug}`}>
                  <Card className="p-4 h-full hover:border-primary/40 hover:shadow-soft transition-all">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                        <Icon className="h-4.5 w-4.5 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{module.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {getModuleRecommendationReason(module.slug, businessProfile ?? null)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {topWorkflow && (
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Suggested workflow</h2>
          <Link to={`/dashboard/workflows/${topWorkflow.slug}`}>
            <Card className="p-5 flex items-center justify-between hover:border-primary/40 hover:shadow-soft transition-all">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{topWorkflow.title}</p>
                  <p className="text-sm text-muted-foreground">{topWorkflow.description}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </Card>
          </Link>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">What do you want to do?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActionLinks.map((action) =>
            action.href ? (
              <Link key={action.label} to={action.href}>
                <Card className="p-4 hover:border-primary/40 hover:shadow-soft transition-all">
                  <p className="text-sm font-medium">{action.label}</p>
                </Card>
              </Link>
            ) : (
              <Card key={action.label} className="p-4 opacity-50">
                <p className="text-sm font-medium">{action.label}</p>
              </Card>
            )
          )}
        </div>
      </section>
    </div>
  );
}
