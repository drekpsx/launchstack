import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBusinessProfile } from "@/hooks/useProfile";
import {
  BUSINESS_TYPES,
  MONTHLY_REVENUE_RANGES,
  PRIMARY_GOALS,
  MAIN_OBJECTIONS,
  MAIN_PROBLEMS,
  ACQUISITION_CHANNELS,
  CONTENT_TYPES,
  labelFor,
  labelsFor,
} from "@/config/questionnaire";
import { Skeleton } from "@/components/ui/skeleton";

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-sm">{value || "—"}</p>
    </div>
  );
}

export default function MyBusiness() {
  const { data: profile, isLoading } = useBusinessProfile();

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-3xl">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Card className="max-w-lg p-6">
        <p className="font-medium">You haven't completed your business profile yet.</p>
        <Button asChild className="mt-4">
          <Link to="/onboarding">Complete the questionnaire</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">My Business</h1>
          <p className="text-muted-foreground text-sm mt-1">
            This profile personalizes every prompt and workflow in your workspace.
          </p>
        </div>
        <Button asChild>
          <Link to="/onboarding?edit=true">
            <Pencil className="h-4 w-4" /> Edit my business
          </Link>
        </Button>
      </div>

      <Card className="p-6 space-y-6">
        <div>
          <h2 className="font-semibold mb-3">Business</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Business type" value={labelFor(BUSINESS_TYPES, profile.business_type)} />
            <Field label="Target market" value={[profile.target_country, profile.target_language].filter(Boolean).join(" · ")} />
            <Field label="Monthly revenue" value={labelFor(MONTHLY_REVENUE_RANGES, profile.monthly_revenue)} />
            <Field label="Primary goal" value={labelFor(PRIMARY_GOALS, profile.primary_goal)} />
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-3">Product</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Product" value={profile.product} />
            <Field label="Niche" value={profile.niche} />
            <Field label="Average price" value={profile.average_price} />
            <Field label="Cost per unit" value={profile.product_cost} />
          </div>
          <div className="mt-4">
            <Field label="Unique selling point" value={profile.unique_selling_point} />
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-3">Customer</h2>
          <div className="space-y-4">
            <Field label="Target customer" value={profile.target_customer} />
            <Field label="Customer problem" value={profile.customer_problem} />
            <Field label="Purchase reason" value={profile.purchase_reason} />
            <Field label="Main objection" value={labelFor(MAIN_OBJECTIONS, profile.main_objection)} />
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-3">Acquisition</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Channels</p>
              <div className="flex flex-wrap gap-1.5">
                {labelsFor(ACQUISITION_CHANNELS, profile.acquisition_channels).map((label) => (
                  <Badge key={label} variant="secondary">
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
            <Field label="Marketing budget" value={profile.marketing_budget} />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Content types</p>
              <div className="flex flex-wrap gap-1.5">
                {labelsFor(CONTENT_TYPES, profile.content_types).map((label) => (
                  <Badge key={label} variant="secondary">
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-3">Goals</h2>
          <div className="space-y-4">
            <Field label="Revenue goal" value={profile.revenue_goal} />
            <Field label="90-day goal" value={profile.goal_90_days} />
            <Field label="Main problem" value={labelFor(MAIN_PROBLEMS, profile.main_problem)} />
            <Field label="Desired result" value={profile.desired_result} />
          </div>
        </div>
      </Card>
    </div>
  );
}
