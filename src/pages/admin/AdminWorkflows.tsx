import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import type { Workflow } from "@/types/domain";
import type { TablesInsert } from "@/integrations/supabase/types";
import { toast } from "sonner";

type WorkflowFormValues = Omit<TablesInsert<"workflows">, "id">;

const emptyWorkflow: WorkflowFormValues = {
  slug: "",
  title: "",
  description: "",
  icon: "route",
  business_types: [],
  channels: [],
  goals: [],
  problems: [],
  premium: false,
  sort_order: 0,
  is_active: true,
};

function strToArr(str: string) {
  return str.split(",").map((s) => s.trim()).filter(Boolean);
}
function arrToStr(arr: string[] | null | undefined) {
  return (arr ?? []).join(", ");
}

function useAdminWorkflows() {
  return useQuery({
    queryKey: ["admin-workflows"],
    queryFn: async (): Promise<Workflow[]> => {
      const { data, error } = await supabase.from("workflows").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

export default function AdminWorkflows() {
  const { data: workflows, isLoading } = useAdminWorkflows();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Workflow | null>(null);
  const [form, setForm] = useState<WorkflowFormValues>(emptyWorkflow);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-workflows"] });
    queryClient.invalidateQueries({ queryKey: ["workflows"] });
    queryClient.invalidateQueries({ queryKey: ["workflow"] });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("workflows").update(form).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("workflows").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Workflow updated" : "Workflow created");
      invalidate();
      setDialogOpen(false);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Something went wrong"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("workflows").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Workflow deleted");
      invalidate();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Something went wrong"),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyWorkflow);
    setDialogOpen(true);
  };

  const openEdit = (workflow: Workflow) => {
    setEditing(workflow);
    setForm({ ...workflow });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Workflows</h1>
          <p className="text-muted-foreground text-sm mt-1">Guided, multi-step sequences of prompts.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" /> New workflow
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit workflow" : "New workflow"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Slug</Label>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  value={form.description ?? ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Business types (comma, empty = all)</Label>
                  <Input
                    value={arrToStr(form.business_types)}
                    onChange={(e) => setForm({ ...form, business_types: strToArr(e.target.value) })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Channels (comma, empty = all)</Label>
                  <Input value={arrToStr(form.channels)} onChange={(e) => setForm({ ...form, channels: strToArr(e.target.value) })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Goals (comma, empty = all)</Label>
                  <Input value={arrToStr(form.goals)} onChange={(e) => setForm({ ...form, goals: strToArr(e.target.value) })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Problems (comma, empty = all)</Label>
                  <Input value={arrToStr(form.problems)} onChange={(e) => setForm({ ...form, problems: strToArr(e.target.value) })} />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={form.premium ?? false} onCheckedChange={(c) => setForm({ ...form, premium: c })} />
                  <Label>Pro only</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_active ?? true} onCheckedChange={(c) => setForm({ ...form, is_active: c })} />
                  <Label>Active</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                {editing ? "Save changes" : "Create workflow"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Workflow</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading &&
            workflows?.map((workflow) => (
              <TableRow key={workflow.id}>
                <TableCell className="font-medium">{workflow.title}</TableCell>
                <TableCell className="text-muted-foreground">{workflow.slug}</TableCell>
                <TableCell>{workflow.is_active ? "Active" : "Hidden"}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/admin/workflows/${workflow.id}`}>
                      <ListOrdered className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(workflow)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{workflow.title}"?</AlertDialogTitle>
                        <AlertDialogDescription>This also deletes its steps. This can't be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(workflow.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
