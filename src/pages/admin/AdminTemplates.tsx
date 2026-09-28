import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, AlertTriangle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import type { Module, PromptTemplate, BusinessProfile } from "@/types/domain";
import type { TablesInsert } from "@/integrations/supabase/types";
import { ALL_VARIABLE_KEYS, findUnknownVariables, buildVariableMap, renderTemplate } from "@/lib/templateEngine";
import { toast } from "sonner";

type TemplateFormValues = Omit<TablesInsert<"prompt_templates">, "id">;

const SAMPLE_PROFILE: BusinessProfile = {
  id: "sample", user_id: "sample", created_at: "", updated_at: "",
  business_type: "dropshipping", target_country: "France", target_language: "French",
  monthly_revenue: "1k_5k", primary_goal: "increase_revenue",
  product: "Cat water fountain", niche: "Pet accessories", average_price: "€39", product_cost: "€9",
  unique_selling_point: "Filters water continuously and looks good on a countertop",
  target_customer: "Cat owners aged 25-45 who care about their pet's health",
  customer_problem: "Cats don't drink enough water from a bowl",
  purchase_reason: "It's an easy way to keep their cat healthy and hydrated",
  main_objection: "price", acquisition_channels: ["tiktok", "meta_ads"], marketing_budget: "€500",
  content_types: ["ugc", "tiktok"], revenue_goal: "€10,000", goal_90_days: "Launch and get 50 orders",
  main_problem: "conversion", desired_result: "A clear plan and ready-to-use prompts",
};

const emptyTemplate = (moduleId: string): TemplateFormValues => ({
  module_id: moduleId,
  title: "",
  description: "",
  objective: "",
  difficulty: "beginner",
  content: "",
  required_variables: [],
  tags: [],
  business_types: [],
  channels: [],
  goals: [],
  problems: [],
  premium: true,
  version: 1,
  is_active: true,
  sort_order: 0,
});

function arrToStr(arr: string[] | null | undefined) {
  return (arr ?? []).join(", ");
}
function strToArr(str: string) {
  return str.split(",").map((s) => s.trim()).filter(Boolean);
}

function useAdminTemplates() {
  return useQuery({
    queryKey: ["admin-templates"],
    queryFn: async (): Promise<PromptTemplate[]> => {
      const { data, error } = await supabase.from("prompt_templates").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

function useAdminModulesList() {
  return useQuery({
    queryKey: ["admin-modules"],
    queryFn: async (): Promise<Module[]> => {
      const { data, error } = await supabase.from("modules").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

export default function AdminTemplates() {
  const { data: templates, isLoading } = useAdminTemplates();
  const { data: modules } = useAdminModulesList();
  const queryClient = useQueryClient();

  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editing, setEditing] = useState<PromptTemplate | null>(null);
  const [form, setForm] = useState<TemplateFormValues>(emptyTemplate(""));

  const filtered = templates?.filter((t) => moduleFilter === "all" || t.module_id === moduleFilter);
  const unknownVariables = useMemo(() => findUnknownVariables(form.content), [form.content]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-templates"] });
    queryClient.invalidateQueries({ queryKey: ["templates"] });
    queryClient.invalidateQueries({ queryKey: ["template"] });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("prompt_templates").update(form).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("prompt_templates").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Template updated" : "Template created");
      invalidate();
      setDialogOpen(false);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Something went wrong"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("prompt_templates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Template deleted");
      invalidate();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Something went wrong"),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyTemplate(modules?.[0]?.id ?? ""));
    setDialogOpen(true);
  };

  const openEdit = (template: PromptTemplate) => {
    setEditing(template);
    setForm({ ...template });
    setDialogOpen(true);
  };

  const preview = useMemo(() => {
    const variables = buildVariableMap(SAMPLE_PROFILE);
    return renderTemplate(form.content, variables);
  }, [form.content]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Templates</h1>
          <p className="text-muted-foreground text-sm mt-1">Edit prompt content without redeploying the app.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All modules" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modules</SelectItem>
              {modules?.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> New template
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Module</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading &&
            filtered?.map((template) => (
              <TableRow key={template.id}>
                <TableCell className="font-medium">{template.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {modules?.find((m) => m.id === template.module_id)?.name ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={template.premium ? "default" : "secondary"}>{template.premium ? "Pro" : "Free"}</Badge>
                </TableCell>
                <TableCell>{template.is_active ? "Active" : "Hidden"}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(template)}>
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
                        <AlertDialogTitle>Delete "{template.title}"?</AlertDialogTitle>
                        <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(template.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit template" : "New template"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Module</Label>
                <Select value={form.module_id} onValueChange={(v) => setForm({ ...form, module_id: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modules?.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Difficulty</Label>
                <Select value={form.difficulty ?? "beginner"} onValueChange={(v) => setForm({ ...form, difficulty: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Description (shown on the card)</Label>
              <Input value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Objective</Label>
              <Input value={form.objective ?? ""} onChange={(e) => setForm({ ...form, objective: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>Content ({"{{variable}}"} placeholders)</Label>
                <Button type="button" variant="ghost" size="sm" onClick={() => setPreviewOpen(!previewOpen)}>
                  <Eye className="h-3.5 w-3.5" /> {previewOpen ? "Hide preview" : "Preview as sample user"}
                </Button>
              </div>
              <Textarea
                className="min-h-[200px] font-mono text-xs"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
              {unknownVariables.length > 0 && (
                <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-900 rounded-md p-2">
                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>
                    Unknown variable{unknownVariables.length > 1 ? "s" : ""}: {unknownVariables.map((v) => `{{${v}}}`).join(", ")}.
                    Known variables: {ALL_VARIABLE_KEYS.join(", ")}.
                  </span>
                </div>
              )}
              {previewOpen && (
                <pre className="whitespace-pre-wrap rounded-lg border bg-muted/40 p-3 text-xs font-sans max-h-64 overflow-y-auto">
                  {preview.rendered || "Nothing to preview yet."}
                </pre>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Required variables (comma separated)</Label>
                <Input
                  value={arrToStr(form.required_variables)}
                  onChange={(e) => setForm({ ...form, required_variables: strToArr(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tags (comma separated)</Label>
                <Input value={arrToStr(form.tags)} onChange={(e) => setForm({ ...form, tags: strToArr(e.target.value) })} />
              </div>
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
              <div className="space-y-1.5">
                <Label>Version</Label>
                <Input
                  type="number"
                  value={form.version ?? 1}
                  onChange={(e) => setForm({ ...form, version: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Sort order</Label>
                <Input
                  type="number"
                  value={form.sort_order ?? 0}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={form.premium ?? true} onCheckedChange={(c) => setForm({ ...form, premium: c })} />
                <Label>Pro only</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active ?? true} onCheckedChange={(c) => setForm({ ...form, is_active: c })} />
                <Label>Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.module_id}>
              {editing ? "Save changes" : "Create template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
