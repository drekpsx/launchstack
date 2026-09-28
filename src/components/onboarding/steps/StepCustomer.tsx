import type { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioCardGroup } from "@/components/onboarding/RadioCardGroup";
import { MAIN_OBJECTIONS } from "@/config/questionnaire";
import type { BusinessProfileFormData } from "@/components/onboarding/schema";

export function StepCustomer({ form }: { form: UseFormReturn<BusinessProfileFormData> }) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="target_customer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Who is your ideal customer?</FormLabel>
            <FormControl>
              <Textarea placeholder="e.g. Cat owners aged 25-45 who care about their pet's health" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="customer_problem"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What problem does your product solve?</FormLabel>
            <FormControl>
              <Textarea placeholder="e.g. Cats often don't drink enough water from a bowl" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="purchase_reason"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Why would this person buy your product?</FormLabel>
            <FormControl>
              <Textarea placeholder="e.g. It's an easy way to keep their cat healthy and hydrated" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="main_objection"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What's their main objection?</FormLabel>
            <FormControl>
              <RadioCardGroup options={MAIN_OBJECTIONS} value={field.value} onChange={field.onChange} columns={3} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
