import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, Navigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PromptCard } from "@/components/PromptCard";
import { PromptViewerDialog } from "@/components/PromptViewerDialog";
import { useModule, useTemplatesByModule } from "@/hooks/useContent";
import { useBusinessProfile, useProfile } from "@/hooks/useProfile";
import { useFavorites } from "@/hooks/useActivity";
import { sortByRelevance, isRecommended } from "@/lib/personalizationEngine";
import { canAccessTemplate } from "@/config/plans";
import { getIcon } from "@/lib/iconMap";
import type { PromptTemplate } from "@/types/domain";

export default function ModulePage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [activeTemplate, setActiveTemplate] = useState<PromptTemplate | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: module, isLoading: moduleLoading } = useModule(slug);
  const { data: templates, isLoading: templatesLoading } = useTemplatesByModule(module?.id);
  const { data: businessProfile } = useBusinessProfile();
  const { data: profile } = useProfile();
  const { data: favorites } = useFavorites();

  const plan = profile?.plan === "pro" ? "pro" : "free";
  const sortedTemplates = useMemo(
    () => sortByRelevance(templates ?? [], businessProfile ?? null),
    [templates, businessProfile]
  );
  const filteredTemplates = sortedTemplates.filter(
    (t) =>
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const favoriteIds = new Set((favorites ?? []).map((f) => f.template?.id));

  useEffect(() => {
    const openId = searchParams.get("open");
    if (openId && templates) {
      const template = templates.find((t) => t.id === openId);
      if (template) {
        setActiveTemplate(template);
        setDialogOpen(true);
      }
      searchParams.delete("open");
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates]);

  if (!moduleLoading && !module) {
    return <Navigate to="/dashboard" replace />;
  }

  const Icon = module ? getIcon(module.icon) : null;

  return (
    <div className="space-y-6">
      {moduleLoading ? (
        <Skeleton className="h-10 w-64" />
      ) : (
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-accent-foreground" />
            </div>
          )}
          <div>
            <h1 className="font-display text-2xl font-bold">{module?.name}</h1>
            {module?.description && <p className="text-muted-foreground text-sm">{module.description}</p>}
          </div>
        </div>
      )}

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search prompts…"
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {templatesLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <p className="text-muted-foreground text-sm">No prompts match your search.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <PromptCard
              key={template.id}
              template={template}
              locked={!canAccessTemplate(plan, template.premium)}
              isFavorite={favoriteIds.has(template.id)}
              recommended={isRecommended(template, businessProfile ?? null)}
              onClick={() => {
                setActiveTemplate(template);
                setDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <PromptViewerDialog template={activeTemplate} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
