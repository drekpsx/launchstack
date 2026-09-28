import type { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CheckboxGroup } from "@/components/onboarding/CheckboxGroup";
import { RadioCardGroup } from "@/components/onboarding/RadioCardGroup";
import { ACQUISITION_CHANNELS, MAIN_PROBLEMS } from "@/config/questionnaire";
import type { BusinessProfileFormData } from "@/components/onboarding/schema";

export function StepAcquisition({ form }: { form: UseFormReturn<BusinessProfileFormData> }) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="acquisition_channels"
        render={({ field }) => (
          <FormItem>
            <FormLabel>How do you plan to get customers?</FormLabel>
            <FormControl>
              <CheckboxGroup options={ACQUISITION_CHANNELS} value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="main_problem"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What's your biggest problem right now?</FormLabel>
            <FormControl>
              <RadioCardGroup options={MAIN_PROBLEMS} value={field.value} onChange={field.onChange} columns={2} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
