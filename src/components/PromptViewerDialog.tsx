import { useMemo } from "react";
import { Heart, Lock, ExternalLink, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/CopyButton";
import { Link } from "react-router-dom";
import type { PromptTemplate } from "@/types/domain";
import { useBusinessProfile } from "@/hooks/useProfile";
import { useProfile } from "@/hooks/useProfile";
import { useIsFavorite, useToggleFavorite, useLogPromptView } from "@/hooks/useActivity";
import { buildVariableMap, renderTemplate } from "@/lib/templateEngine";
import { canAccessTemplate } from "@/config/plans";
import { cn } from "@/lib/utils";

interface PromptViewerDialogProps {
  template: PromptTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function PromptViewerDialog({ template, open, onOpenChange }: PromptViewerDialogProps) {
  const { data: businessProfile } = useBusinessProfile();
  const { data: profile } = useProfile();
  const isFavorite = useIsFavorite(template?.id);
  const toggleFavorite = useToggleFavorite();
  const logView = useLogPromptView();

  const plan = profile?.plan === "pro" ? "pro" : "free";
  const locked = template ? !canAccessTemplate(plan, template.premium) : false;

  const { rendered, missingKeys } = useMemo(() => {
    if (!template) return { rendered: "", missingKeys: [] as string[] };
    const variables = buildVariableMap(businessProfile ?? null);
    return renderTemplate(template.content, variables);
  }, [template, businessProfile]);

  if (!template) return null;

  const handleCopy = () => {
    logView.mutate(template.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">{DIFFICULTY_LABEL[template.difficulty] ?? template.difficulty}</Badge>
            {template.premium && <Badge variant="outline">Pro</Badge>}
            {template.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-muted-foreground">
                {tag}
              </Badge>
            ))}
          </div>
          <DialogTitle className="text-xl">{template.title}</DialogTitle>
          {template.objective && <DialogDescription>{template.objective}</DialogDescription>}
        </DialogHeader>

        {locked ? (
          <div className="rounded-lg border border-dashed p-8 text-center space-y-3">
            <Lock className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="font-medium">This AI workflow is part of Pro.</p>
            <p className="text-sm text-muted-foreground">
              Upgrade to unlock every module, every workflow, and this prompt fully personalized to your business.
            </p>
            <Button asChild>
              <Link to="/pricing">Upgrade to Pro</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {missingKeys.length > 0 && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 p-3 text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
                <span>
                  Some details are missing from your business profile, so a few placeholders are left blank below.{" "}
                  <Link to="/dashboard/business" className="underline font-medium">
                    Complete your profile
                  </Link>{" "}
                  to fully personalize this prompt.
                </span>
              </div>
            )}
            <pre className={cn("whitespace-pre-wrap rounded-lg border bg-muted/40 p-4 text-sm leading-relaxed font-sans")}>
              {rendered}
            </pre>
            <div className="flex flex-wrap items-center gap-2">
              <CopyButton text={rendered} onCopy={handleCopy} />
              <Button
                variant="outline"
                onClick={() => toggleFavorite.mutate({ templateId: template.id, isFavorite })}
              >
                <Heart className={cn("h-4 w-4", isFavorite && "fill-current text-destructive")} />
                {isFavorite ? "Saved" : "Save"}
              </Button>
              <Button variant="ghost" asChild>
                <a href="https://claude.ai/new" target="_blank" rel="noreferrer">
                  Open Claude <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="https://chatgpt.com/" target="_blank" rel="noreferrer">
                  Open ChatGPT <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
