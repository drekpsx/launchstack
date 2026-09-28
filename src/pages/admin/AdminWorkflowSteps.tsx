import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import type { Module, PromptTemplate, Workflow, WorkflowStep } from "@/types/domain";
import { toast } from "sonner";

interface StepForm {
  title: string;
  description: string;
  template_id: string | null;
  sort_order: number;
}

const emptyStep: StepForm = { title: "", description: "", template_id: null, sort_order: 0 };

export default function AdminWorkflowSteps() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<WorkflowStep | null>(null);
  const [form, setForm] = useState<StepForm>(emptyStep);

  const { data: workflow } = useQuery({
    queryKey: ["admin-workflow", id],
    queryFn: async (): Promise<Workflow | null> => {
      if (!id) return null;
      const { data, error } = await supabase.from("workflows").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: steps, isLoading } = useQuery({
    queryKey: ["admin-workflow-steps", id],
    queryFn: async (): Promise<WorkflowStep[]> => {
      if (!id) return [];
      const { data, error } = await supabase.from("workflow_steps").select("*").eq("workflow_id", id).order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: templates } = useQuery({
    queryKey: ["admin-all-templates-with-modules"],
    queryFn: async (): Promise<(PromptTemplate & { module: Module | null })[]> => {
      const { data, error } = await supabase.from("prompt_templates").select("*, module:modules(*)").order("title");
      if (error) throw error;
      return data as unknown as (PromptTemplate & { module: Module | null })[];
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-workflow-steps", id] });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!id) return;
      const payload = { ...form, workflow_id: id };
      if (editing) {
        const { error } = await supabase.from("workflow_steps").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("workflow_steps").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Step updated" : "Step added");
      invalidate();
      setDialogOpen(false);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Something went wrong"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (stepId: string) => {
      const { error } = await supabase.from("workflow_steps").delete().eq("id", stepId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Step deleted");
      invalidate();
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ a, b }: { a: WorkflowStep; b: WorkflowStep }) => {
      await supabase.from("workflow_steps").update({ sort_order: b.sort_order }).eq("id", a.id);
      await supabase.from("workflow_steps").update({ sort_order: a.sort_order }).eq("id", b.id);
    },
    onSuccess: invalidate,
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyStep, sort_order: (steps?.length ?? 0) + 1 });
    setDialogOpen(true);
  };

  const openEdit = (step: WorkflowStep) => {
    setEditing(step);
    setForm({
      title: step.title,
      description: step.description ?? "",
      template_id: step.template_id,
      sort_order: step.sort_order,
    });
    setDialogOpen(true);
  };

  if (!id) return <Navigate to="/admin/workflows" replace />;

  return (
    <div className="space-y-6 max-w-2xl">
      <Link to="/admin/workflows" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> All workflows
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">{workflow?.title ?? "Workflow"}</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage the steps of this workflow.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" /> Add step
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit step" : "New step"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Prompt template</Label>
                <Select value={form.template_id ?? ""} onValueChange={(v) => setForm({ ...form, template_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates?.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.module?.name} — {t.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Sort order</Label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                {editing ? "Save changes" : "Add step"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {!isLoading &&
          steps?.map((step, i) => (
            <Card key={step.id} className="p-4 flex items-center gap-3">
              <div className="flex flex-col">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  disabled={i === 0}
                  onClick={() => steps[i - 1] && reorderMutation.mutate({ a: step, b: steps[i - 1] })}
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  disabled={i === steps.length - 1}
                  onClick={() => steps[i + 1] && reorderMutation.mutate({ a: step, b: steps[i + 1] })}
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Step {i + 1}</p>
                <p className="font-medium truncate">{step.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {templates?.find((t) => t.id === step.template_id)?.title ?? "No template assigned"}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => openEdit(step)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(step.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </Card>
          ))}
      </div>
    </div>
  );
}
