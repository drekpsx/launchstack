import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-page">
        <div className="rounded-2xl bg-primary px-8 py-16 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground tracking-tight">
            Build your AI e-commerce system today
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-lg mx-auto">
            It takes less than five minutes to go from "no product yet" to a fully personalized workspace.
          </p>
          <Button size="lg" variant="secondary" asChild className="mt-8 text-base">
            <Link to="/signup">
              Build My System <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
