import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Module, PromptTemplate } from "@/types/domain";

export interface FavoriteWithTemplate {
  id: string;
  created_at: string;
  template: (PromptTemplate & { module: Module | null }) | null;
}

export function useFavorites() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async (): Promise<FavoriteWithTemplate[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("favorites")
        .select("id, created_at, template:prompt_templates(*, module:modules(*))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as FavoriteWithTemplate[];
    },
    enabled: !!user,
  });
}

export function useIsFavorite(templateId: string | undefined) {
  const { data: favorites } = useFavorites();
  return !!favorites?.some((f) => f.template?.id === templateId);
}

export function useToggleFavorite() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ templateId, isFavorite }: { templateId: string; isFavorite: boolean }) => {
      if (!user) throw new Error("Not authenticated");
      if (isFavorite) {
        const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("template_id", templateId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("favorites").insert({ user_id: user.id, template_id: templateId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", user?.id] });
    },
  });
}

export interface HistoryEntryWithTemplate {
  id: string;
  created_at: string;
  template: (PromptTemplate & { module: Module | null }) | null;
}

export function useHistory(limit = 50) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["history", user?.id, limit],
    queryFn: async (): Promise<HistoryEntryWithTemplate[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("prompt_history")
        .select("id, created_at, template:prompt_templates(*, module:modules(*))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as unknown as HistoryEntryWithTemplate[];
    },
    enabled: !!user,
  });
}

export function useLogPromptView() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateId: string) => {
      if (!user) return;
      const { error } = await supabase.from("prompt_history").insert({ user_id: user.id, template_id: templateId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history", user?.id] });
    },
  });
}

export function useWorkflowProgress(workflowId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["workflow-progress", user?.id, workflowId],
    queryFn: async (): Promise<Set<string>> => {
      if (!user || !workflowId) return new Set();
      const { data, error } = await supabase
        .from("workflow_step_progress")
        .select("step_id")
        .eq("user_id", user.id)
        .eq("workflow_id", workflowId);
      if (error) throw error;
      return new Set((data ?? []).map((row) => row.step_id));
    },
    enabled: !!user && !!workflowId,
  });
}

export function useToggleWorkflowStep() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workflowId,
      stepId,
      completed,
    }: {
      workflowId: string;
      stepId: string;
      completed: boolean;
    }) => {
      if (!user) throw new Error("Not authenticated");
      if (completed) {
        const { error } = await supabase.from("workflow_step_progress").delete().eq("user_id", user.id).eq("step_id", stepId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("workflow_step_progress")
          .insert({ user_id: user.id, workflow_id: workflowId, step_id: stepId });
        if (error) throw error;
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workflow-progress", user?.id, variables.workflowId] });
    },
  });
}
