import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Module, PromptTemplate, WorkflowWithSteps, Workflow } from "@/types/domain";

export function useModules() {
  return useQuery({
    queryKey: ["modules"],
    queryFn: async (): Promise<Module[]> => {
      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useModule(slug: string | undefined) {
  return useQuery({
    queryKey: ["module", slug],
    queryFn: async (): Promise<Module | null> => {
      if (!slug) return null;
      const { data, error } = await supabase.from("modules").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useTemplatesByModule(moduleId: string | undefined) {
  return useQuery({
    queryKey: ["templates", "module", moduleId],
    queryFn: async (): Promise<PromptTemplate[]> => {
      if (!moduleId) return [];
      const { data, error } = await supabase
        .from("prompt_templates")
        .select("*")
        .eq("module_id", moduleId)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!moduleId,
  });
}

export function useAllTemplates() {
  return useQuery({
    queryKey: ["templates", "all"],
    queryFn: async (): Promise<PromptTemplate[]> => {
      const { data, error } = await supabase
        .from("prompt_templates")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useTemplate(id: string | undefined) {
  return useQuery({
    queryKey: ["template", id],
    queryFn: async (): Promise<PromptTemplate | null> => {
      if (!id) return null;
      const { data, error } = await supabase.from("prompt_templates").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useWorkflows() {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: async (): Promise<Workflow[]> => {
      const { data, error } = await supabase
        .from("workflows")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useWorkflow(slug: string | undefined) {
  return useQuery({
    queryKey: ["workflow", slug],
    queryFn: async (): Promise<WorkflowWithSteps | null> => {
      if (!slug) return null;
      const { data: workflow, error } = await supabase.from("workflows").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      if (!workflow) return null;

      const { data: steps, error: stepsError } = await supabase
        .from("workflow_steps")
        .select("*, template:prompt_templates(*)")
        .eq("workflow_id", workflow.id)
        .order("sort_order", { ascending: true });
      if (stepsError) throw stepsError;

      return { ...workflow, steps: steps ?? [] };
    },
    enabled: !!slug,
  });
}
