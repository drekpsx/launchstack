import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import type { Module } from "@/types/domain";
import type { TablesInsert } from "@/integrations/supabase/types";
import { getIcon, ICON_MAP } from "@/lib/iconMap";
import { toast } from "sonner";

type ModuleFormValues = Omit<TablesInsert<"modules">, "id">;

const emptyModule: ModuleFormValues = {
  slug: "",
  name: "",
  description: "",
  icon: "sparkles",
  sort_order: 0,
  is_active: true,
};

function useAdminModules() {
  return useQuery({
    queryKey: ["admin-modules"],
    queryFn: async (): Promise<Module[]> => {
      const { data, error } = await supabase.from("modules").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

export default function AdminModules() {
  const { data: modules, isLoading } = useAdminModules();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Module | null>(null);
  const [form, setForm] = useState<ModuleFormValues>(emptyModule);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-modules"] });
    queryClient.invalidateQueries({ queryKey: ["modules"] });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("modules").update(form).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("modules").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Module updated" : "Module created");
      invalidate();
      setDialogOpen(false);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Something went wrong"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("modules").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Module deleted");
      invalidate();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Something went wrong"),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyModule);
    setDialogOpen(true);
  };

  const openEdit = (module: Module) => {
    setEditing(module);
    setForm({
      slug: module.slug,
      name: module.name,
      description: module.description ?? "",
      icon: module.icon,
      sort_order: module.sort_order,
      is_active: module.is_active,
    });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Modules</h1>
          <p className="text-muted-foreground text-sm mt-1">The workspace categories users see in their sidebar.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" /> New module
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit module" : "New module"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Slug</Label>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  value={form.description ?? ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <Label>Icon</Label>
                  <Input value={form.icon ?? ""} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
                  <p className="text-xs text-muted-foreground">One of: {Object.keys(ICON_MAP).join(", ")}</p>
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
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.is_active ?? true}
                  onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
                />
                <Label>Active (visible to users)</Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                {editing ? "Save changes" : "Create module"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Module</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading &&
            modules?.map((module) => {
              const Icon = getIcon(module.icon);
              return (
                <TableRow key={module.id}>
                  <TableCell className="flex items-center gap-2 font-medium">
                    <Icon className="h-4 w-4 text-muted-foreground" /> {module.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{module.slug}</TableCell>
                  <TableCell>{module.sort_order}</TableCell>
                  <TableCell>{module.is_active ? "Active" : "Hidden"}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(module)}>
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
                          <AlertDialogTitle>Delete "{module.name}"?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This also deletes every template in this module. This can't be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMutation.mutate(module.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
