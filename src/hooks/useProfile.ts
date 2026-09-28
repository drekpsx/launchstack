import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { BusinessProfile, Profile } from "@/types/domain";
import type { TablesUpdate } from "@/integrations/supabase/types";

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!user) return null;
      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useIsAdmin() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async (): Promise<boolean> => {
      if (!user) return false;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
    enabled: !!user,
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: TablesUpdate<"profiles">) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("profiles").update(updates).eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });
}

export function useBusinessProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["business-profile", user?.id],
    queryFn: async (): Promise<BusinessProfile | null> => {
      if (!user) return null;
      const { data, error } = await supabase.from("business_profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

type BusinessProfileInput = {
  business_type: string;
  target_country: string;
  target_language: string;
  monthly_revenue: string;
  primary_goal: string;
  product: string;
  niche: string;
  average_price: string;
  product_cost: string;
  unique_selling_point: string;
  target_customer: string;
  customer_problem: string;
  purchase_reason: string;
  main_objection: string;
  acquisition_channels: string[];
  marketing_budget: string;
  content_types: string[];
  revenue_goal: string;
  goal_90_days: string;
  main_problem: string;
  desired_result: string;
};

export function useSaveBusinessProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: BusinessProfileInput) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("business_profiles")
        .upsert({ ...values, user_id: user.id }, { onConflict: "user_id" });
      if (error) throw error;

      await supabase.from("profiles").update({ onboarding_completed: true }).eq("user_id", user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-profile", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });
}
