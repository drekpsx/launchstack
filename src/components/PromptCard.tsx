import { Lock, Heart, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PromptTemplate } from "@/types/domain";
import { cn } from "@/lib/utils";

interface PromptCardProps {
  template: PromptTemplate;
  locked?: boolean;
  isFavorite?: boolean;
  recommended?: boolean;
  onClick: () => void;
}

export function PromptCard({ template, locked, isFavorite, recommended, onClick }: PromptCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "group cursor-pointer p-4 transition-all hover:shadow-soft hover:border-primary/40",
        locked && "bg-muted/30"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-snug">{template.title}</h3>
        <div className="flex items-center gap-1.5 shrink-0">
          {isFavorite && <Heart className="h-4 w-4 fill-current text-destructive" />}
          {locked && <Lock className="h-4 w-4 text-muted-foreground" />}
        </div>
      </div>
      {template.description && (
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{template.description}</p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {recommended && (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10 gap-1">
            <Sparkles className="h-3 w-3" /> Recommended
          </Badge>
        )}
        {template.premium && (
          <Badge variant="outline" className="text-xs">
            Pro
          </Badge>
        )}
        <Badge variant="secondary" className="text-xs capitalize">
          {template.difficulty}
        </Badge>
      </div>
    </Card>
  );
}
