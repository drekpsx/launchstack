import { useNavigate } from "react-router-dom";
import { PartyPopper, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModules, useAllTemplates, useWorkflows } from "@/hooks/useContent";
import { useBusinessProfile } from "@/hooks/useProfile";
import { getRecommendedModuleSlugs } from "@/lib/personalizationEngine";

export default function OnboardingComplete() {
  const navigate = useNavigate();
  const { data: modules, isLoading: modulesLoading } = useModules();
  const { data: templates, isLoading: templatesLoading } = useAllTemplates();
  const { data: workflows, isLoading: workflowsLoading } = useWorkflows();
  const { data: businessProfile } = useBusinessProfile();

  const isLoading = modulesLoading || templatesLoading || workflowsLoading;
  const recommendedCount = getRecommendedModuleSlugs(businessProfile ?? null).length;

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/40 p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
          <PartyPopper className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Your system is ready.</h1>
        <p className="mt-3 text-muted-foreground">
          We've personalized your workspace based on your business profile.
        </p>

        {isLoading ? (
          <div className="mt-10 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-2xl font-extrabold">{recommendedCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Modules recommended</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-2xl font-extrabold">{workflows?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Workflows available</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-2xl font-extrabold">{templates?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Personalized prompts</p>
            </div>
          </div>
        )}

        <Button size="lg" className="mt-10" onClick={() => navigate("/dashboard")}>
          Go to my dashboard <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
