import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { PromptCard } from "@/components/PromptCard";
import { PromptViewerDialog } from "@/components/PromptViewerDialog";
import { useFavorites } from "@/hooks/useActivity";
import type { PromptTemplate } from "@/types/domain";

export default function Favorites() {
  const { data: favorites, isLoading } = useFavorites();
  const [activeTemplate, setActiveTemplate] = useState<PromptTemplate | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Favorites</h1>
        <p className="text-muted-foreground text-sm mt-1">Prompts you've saved for quick access.</p>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : !favorites || favorites.length === 0 ? (
        <Card className="p-10 text-center">
          <Heart className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium">No favorites yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Save any prompt from a module or workflow to find it here later.
          </p>
          <Link to="/dashboard" className="inline-block mt-4 text-primary font-medium text-sm hover:underline">
            Explore modules
          </Link>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites
            .filter((f) => f.template)
            .map((f) => (
              <PromptCard
                key={f.id}
                template={f.template!}
                isFavorite
                onClick={() => {
                  setActiveTemplate(f.template);
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
