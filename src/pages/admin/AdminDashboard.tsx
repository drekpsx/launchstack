import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Users, Crown, Layers, FileText, Route } from "lucide-react";

function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [usersRes, proUsersRes, modulesRes, templatesRes, workflowsRes] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("plan", "pro"),
        supabase.from("modules").select("*", { count: "exact", head: true }),
        supabase.from("prompt_templates").select("*", { count: "exact", head: true }),
        supabase.from("workflows").select("*", { count: "exact", head: true }),
      ]);
      return {
        users: usersRes.count ?? 0,
        proUsers: proUsersRes.count ?? 0,
        modules: modulesRes.count ?? 0,
        templates: templatesRes.count ?? 0,
        workflows: workflowsRes.count ?? 0,
      };
    },
  });
}

export default function AdminDashboard() {
  const { data, isLoading } = useAdminStats();

  const cards = [
    { label: "Total users", value: data?.users, icon: Users },
    { label: "Pro subscribers", value: data?.proUsers, icon: Crown },
    { label: "Modules", value: data?.modules, icon: Layers },
    { label: "Templates", value: data?.templates, icon: FileText },
    { label: "Workflows", value: data?.workflows, icon: Route },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">A snapshot of your product's content and users.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Card key={card.label} className="p-5">
            <card.icon className="h-4 w-4 text-muted-foreground mb-3" />
            {isLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-2xl font-extrabold">{card.value}</p>}
            <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
