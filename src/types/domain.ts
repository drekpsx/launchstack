import type { Tables } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;
export type BusinessProfile = Tables<"business_profiles">;
export type Module = Tables<"modules">;
export type PromptTemplate = Tables<"prompt_templates">;
export type Workflow = Tables<"workflows">;
export type WorkflowStep = Tables<"workflow_steps">;
export type Favorite = Tables<"favorites">;
export type PromptHistoryEntry = Tables<"prompt_history">;
export type WorkflowStepProgress = Tables<"workflow_step_progress">;
export type Subscription = Tables<"subscriptions">;

export type Plan = "free" | "pro";

/** A workflow step joined with the prompt template it points to. */
export interface WorkflowStepWithTemplate extends WorkflowStep {
  template: PromptTemplate | null;
}

export interface WorkflowWithSteps extends Workflow {
  steps: WorkflowStepWithTemplate[];
}

/** A module joined with its templates, used on the module detail page. */
export interface ModuleWithTemplates extends Module {
  templates: PromptTemplate[];
}
