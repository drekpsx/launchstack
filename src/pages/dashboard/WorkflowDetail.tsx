import { useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { ArrowLeft, Check, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PromptViewerDialog } from "@/components/PromptViewerDialog";
import { useWorkflow } from "@/hooks/useContent";
import { useProfile } from "@/hooks/useProfile";
import { useWorkflowProgress, useToggleWorkflowStep } from "@/hooks/useActivity";
import { canAccessTemplate } from "@/config/plans";
import { getIcon } from "@/lib/iconMap";
import { cn } from "@/lib/utils";
import type { PromptTemplate } from "@/types/domain";

export default function WorkflowDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [activeTemplate, setActiveTemplate] = useState<PromptTemplate | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: workflow, isLoading } = useWorkflow(slug);
  const { data: profile } = useProfile();
  const { data: completedSteps } = useWorkflowProgress(workflow?.id);
  const toggleStep = useToggleWorkflowStep();

  const plan = profile?.plan === "pro" ? "pro" : "free";

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!workflow) return <Navigate to="/dashboard/workflows" replace />;

  const Icon = getIcon(workflow.icon);
  const completedCount = workflow.steps.filter((s) => completedSteps?.has(s.id)).length;
  const progressPct = workflow.steps.length ? (completedCount / workflow.steps.length) * 100 : 0;

  return (
    <div className="max-w-2xl space-y-6">
      <Link to="/dashboard/workflows" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> All workflows
      </Link>

      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-accent-foreground" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">{workflow.title}</h1>
          <p className="text-muted-foreground text-sm">{workflow.description}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-sm mb-1.5">
          <span className="text-muted-foreground">
            {completedCount} of {workflow.steps.length} steps completed
          </span>
        </div>
        <Progress value={progressPct} />
      </div>

      <div className="space-y-3">
        {workflow.steps.map((step, i) => {
          const done = completedSteps?.has(step.id) ?? false;
          const locked = step.template ? !canAccessTemplate(plan, step.template.premium) : false;
          return (
            <Card key={step.id} className={cn("p-4 flex items-center gap-4", locked && "bg-muted/30")}>
              <button
                type="button"
                onClick={() => toggleStep.mutate({ workflowId: workflow.id, stepId: step.id, completed: done })}
                className={cn(
                  "h-7 w-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                  done ? "bg-primary border-primary text-primary-foreground" : "border-border text-transparent hover:border-primary"
                )}
                aria-label={done ? "Mark as not done" : "Mark as done"}
              >
                <Check className="h-4 w-4" />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Step {i + 1}</p>
                <p className={cn("font-medium", done && "text-muted-foreground line-through")}>{step.title}</p>
                {step.description && <p className="text-sm text-muted-foreground">{step.description}</p>}
              </div>
              <Button
                variant={locked ? "outline" : "secondary"}
                size="sm"
                onClick={() => {
                  if (!step.template) return;
                  setActiveTemplate(step.template);
                  setDialogOpen(true);
                }}
                disabled={!step.template}
              >
                {locked && <Lock className="h-3.5 w-3.5" />}
                Open prompt
              </Button>
            </Card>
          );
        })}
      </div>

      <PromptViewerDialog template={activeTemplate} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
