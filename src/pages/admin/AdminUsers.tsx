import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Profile, BusinessProfile } from "@/types/domain";
import { toast } from "sonner";

interface AdminUserRow extends Profile {
  businessProfile: BusinessProfile | null;
}

function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async (): Promise<AdminUserRow[]> => {
      const [{ data: profiles, error: profilesError }, { data: businessProfiles, error: bpError }] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("business_profiles").select("*"),
      ]);
      if (profilesError) throw profilesError;
      if (bpError) throw bpError;

      const bpByUser = new Map((businessProfiles ?? []).map((bp) => [bp.user_id, bp]));
      return (profiles ?? []).map((p) => ({ ...p, businessProfile: bpByUser.get(p.user_id) ?? null }));
    },
  });
}

export default function AdminUsers() {
  const { data: users, isLoading } = useAdminUsers();
  const queryClient = useQueryClient();

  const togglePlan = useMutation({
    mutationFn: async ({ userId, plan }: { userId: string; plan: string }) => {
      const { error } = await supabase.from("profiles").update({ plan }).eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Plan updated");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Something went wrong"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Users</h1>
        <p className="text-muted-foreground text-sm mt-1">{users?.length ?? 0} accounts.</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Business</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Onboarded</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading &&
            users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <p className="font-medium">{user.first_name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.businessProfile?.product ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={user.plan === "pro" ? "default" : "secondary"} className="capitalize">
                    {user.plan}
                  </Badge>
                </TableCell>
                <TableCell>{user.onboarding_completed ? "Yes" : "No"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      togglePlan.mutate({ userId: user.user_id, plan: user.plan === "pro" ? "free" : "pro" })
                    }
                  >
                    {user.plan === "pro" ? "Downgrade to Free" : "Upgrade to Pro"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
