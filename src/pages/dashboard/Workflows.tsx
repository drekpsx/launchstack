import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getIcon } from "@/lib/iconMap";
import { useWorkflows } from "@/hooks/useContent";
import { useBusinessProfile } from "@/hooks/useProfile";
import { sortByRelevance, isRecommended } from "@/lib/personalizationEngine";

export default function Workflows() {
  const { data: workflows, isLoading } = useWorkflows();
  const { data: businessProfile } = useBusinessProfile();

  const sorted = workflows ? sortByRelevance(workflows, businessProfile ?? null) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Workflows</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Guided, multi-step sequences that walk you from a starting point to a finished result.
        </p>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {sorted.map((workflow) => {
            const Icon = getIcon(workflow.icon);
            return (
              <Link key={workflow.id} to={`/dashboard/workflows/${workflow.slug}`}>
                <Card className="p-5 h-full hover:border-primary/40 hover:shadow-soft transition-all flex flex-col">
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                      <Icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    {isRecommended(workflow, businessProfile ?? null) && (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/10 gap-1">
                        <Sparkles className="h-3 w-3" /> Recommended
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold mt-3">{workflow.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 flex-1">{workflow.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                    Start workflow <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
