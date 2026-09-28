import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { History as HistoryIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PromptViewerDialog } from "@/components/PromptViewerDialog";
import { useHistory } from "@/hooks/useActivity";
import { useProfile } from "@/hooks/useProfile";
import { PLANS } from "@/config/plans";
import type { PromptTemplate } from "@/types/domain";

export default function History() {
  const { data: profile } = useProfile();
  const plan = profile?.plan === "pro" ? "pro" : "free";
  const limit = PLANS[plan].limits.historyEntries;
  const { data: history, isLoading } = useHistory(Number.isFinite(limit) ? limit : 200);
  const [activeTemplate, setActiveTemplate] = useState<PromptTemplate | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold">History</h1>
        <p className="text-muted-foreground text-sm mt-1">Prompts you've recently used.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : !history || history.length === 0 ? (
        <Card className="p-10 text-center">
          <HistoryIcon className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium">No history yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Prompts you copy will show up here.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {history
            .filter((h) => h.template)
            .map((entry) => (
              <Card key={entry.id} className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium truncate">{entry.template!.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {entry.template!.module && (
                      <Badge variant="secondary" className="text-xs">
                        {entry.template!.module.name}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => {
                    setActiveTemplate(entry.template);
                    setDialogOpen(true);
                  }}
                >
                  Reopen
                </Button>
              </Card>
            ))}
        </div>
      )}

      <PromptViewerDialog template={activeTemplate} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
