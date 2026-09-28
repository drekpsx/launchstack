import type { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CheckboxGroup } from "@/components/onboarding/CheckboxGroup";
import { ACQUISITION_CHANNELS, CONTENT_TYPES } from "@/config/questionnaire";
import type { BusinessProfileFormData } from "@/components/onboarding/schema";

export function StepAcquisition({ form }: { form: UseFormReturn<BusinessProfileFormData> }) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="acquisition_channels"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Which channels do you use?</FormLabel>
            <FormControl>
              <CheckboxGroup options={ACQUISITION_CHANNELS} value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="marketing_budget"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Monthly marketing budget</FormLabel>
            <FormControl>
              <Input placeholder="e.g. €500" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="content_types"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What type of content do you use?</FormLabel>
            <FormControl>
              <CheckboxGroup options={CONTENT_TYPES} value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
