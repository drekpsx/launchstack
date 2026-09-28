import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Form } from "@/components/ui/form";
import {
  businessProfileSchema,
  defaultBusinessProfileValues,
  STEP_FIELDS,
  STEP_TITLES,
  type BusinessProfileFormData,
} from "@/components/onboarding/schema";
import { StepBusiness } from "@/components/onboarding/steps/StepBusiness";
import { StepProduct } from "@/components/onboarding/steps/StepProduct";
import { StepCustomer } from "@/components/onboarding/steps/StepCustomer";
import { StepAcquisition } from "@/components/onboarding/steps/StepAcquisition";
import { StepGoals } from "@/components/onboarding/steps/StepGoals";
import { useSaveBusinessProfile, useBusinessProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { APP_NAME } from "@/config/app";
import { toast } from "sonner";

const steps = [StepBusiness, StepProduct, StepCustomer, StepAcquisition, StepGoals];

export default function Onboarding() {
  const [screen, setScreen] = useState<"intro" | number>("intro");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const saveBusinessProfile = useSaveBusinessProfile();
  const { data: existingProfile } = useBusinessProfile();
  const hasInitialized = useRef(false);

  const form = useForm<BusinessProfileFormData>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: defaultBusinessProfileValues,
    mode: "onChange",
  });

  // Editing an existing profile: pre-fill the form and skip straight to the
  // questionnaire (no need to show the "let's get started" intro again).
  useEffect(() => {
    if (hasInitialized.current || !existingProfile) return;
    hasInitialized.current = true;
    form.reset({
      business_type: existingProfile.business_type ?? "",
      target_country: existingProfile.target_country ?? "",
      target_language: existingProfile.target_language ?? "",
      monthly_revenue: existingProfile.monthly_revenue ?? "",
      primary_goal: existingProfile.primary_goal ?? "",
      product: existingProfile.product ?? "",
      niche: existingProfile.niche ?? "",
      average_price: existingProfile.average_price ?? "",
      product_cost: existingProfile.product_cost ?? "",
      unique_selling_point: existingProfile.unique_selling_point ?? "",
      target_customer: existingProfile.target_customer ?? "",
      customer_problem: existingProfile.customer_problem ?? "",
      purchase_reason: existingProfile.purchase_reason ?? "",
      main_objection: existingProfile.main_objection ?? "",
      acquisition_channels: existingProfile.acquisition_channels ?? [],
      marketing_budget: existingProfile.marketing_budget ?? "",
      content_types: existingProfile.content_types ?? [],
      revenue_goal: existingProfile.revenue_goal ?? "",
      goal_90_days: existingProfile.goal_90_days ?? "",
      main_problem: existingProfile.main_problem ?? "",
      desired_result: existingProfile.desired_result ?? "",
    });
    if (searchParams.get("edit") === "true") setScreen(0);
  }, [existingProfile, form, searchParams]);

  const firstName = (user?.user_metadata?.first_name as string | undefined) ?? "";

  if (screen === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/40 p-4">
        <div className="max-w-md text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            {firstName ? `Let's build your AI system, ${firstName}.` : "Let's build your AI E-commerce System."}
          </h1>
          <p className="mt-4 text-muted-foreground">
            Answer a few questions about your business. We'll personalize your workspace around your goals — takes
            about 3 minutes.
          </p>
          <Button size="lg" className="mt-8" onClick={() => setScreen(0)}>
            Start <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const step = screen;
  const StepComponent = steps[step];
  const isLastStep = step === steps.length - 1;

  const handleNext = async () => {
    const valid = await form.trigger(STEP_FIELDS[step]);
    if (!valid) return;

    if (!isLastStep) {
      setScreen(step + 1);
      return;
    }

    setSubmitting(true);
    try {
      const parsed = businessProfileSchema.parse(form.getValues());
      await saveBusinessProfile.mutateAsync({
        business_type: parsed.business_type,
        target_country: parsed.target_country,
        target_language: parsed.target_language,
        monthly_revenue: parsed.monthly_revenue,
        primary_goal: parsed.primary_goal,
        product: parsed.product,
        niche: parsed.niche,
        average_price: parsed.average_price,
        product_cost: parsed.product_cost,
        unique_selling_point: parsed.unique_selling_point,
        target_customer: parsed.target_customer,
        customer_problem: parsed.customer_problem,
        purchase_reason: parsed.purchase_reason,
        main_objection: parsed.main_objection,
        acquisition_channels: parsed.acquisition_channels,
        marketing_budget: parsed.marketing_budget,
        content_types: parsed.content_types,
        revenue_goal: parsed.revenue_goal,
        goal_90_days: parsed.goal_90_days,
        main_problem: parsed.main_problem,
        desired_result: parsed.desired_result,
      });
      if (existingProfile) {
        toast.success("Business profile updated");
        navigate("/dashboard/business");
      } else {
        navigate("/onboarding/complete");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 0) {
      setScreen("intro");
    } else {
      setScreen(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/40 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-display font-bold">{APP_NAME}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>
            Step {step + 1} of {steps.length}
          </span>
          <span>{STEP_TITLES[step]}</span>
        </div>
        <Progress value={((step + 1) / steps.length) * 100} className="mb-8" />

        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-soft">
          <Form {...form}>
            <StepComponent form={form} />
          </Form>

          <div className="mt-8 flex items-center justify-between">
            <Button type="button" variant="ghost" onClick={handleBack} disabled={submitting}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button type="button" onClick={handleNext} disabled={submitting}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isLastStep ? (
                "Build my system"
              ) : (
                <>
                  Next <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
