import type { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioCardGroup } from "@/components/onboarding/RadioCardGroup";
import { BUSINESS_TYPES, MONTHLY_REVENUE_RANGES, PRIMARY_GOALS } from "@/config/questionnaire";
import type { BusinessProfileFormData } from "@/components/onboarding/schema";

export function StepBusiness({ form }: { form: UseFormReturn<BusinessProfileFormData> }) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="business_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What type of business do you have?</FormLabel>
            <FormControl>
              <RadioCardGroup options={BUSINESS_TYPES} value={field.value} onChange={field.onChange} columns={3} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="target_country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target country</FormLabel>
              <FormControl>
                <Input placeholder="e.g. France" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="target_language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target language</FormLabel>
              <FormControl>
                <Input placeholder="e.g. French" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="monthly_revenue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What's your approximate monthly revenue?</FormLabel>
            <FormControl>
              <RadioCardGroup options={MONTHLY_REVENUE_RANGES} value={field.value} onChange={field.onChange} columns={3} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="primary_goal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What's your main objective right now?</FormLabel>
            <FormControl>
              <RadioCardGroup options={PRIMARY_GOALS} value={field.value} onChange={field.onChange} columns={2} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
