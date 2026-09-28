import type { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioCardGroup } from "@/components/onboarding/RadioCardGroup";
import { NICHES, PRICE_RANGES } from "@/config/questionnaire";
import type { BusinessProfileFormData } from "@/components/onboarding/schema";

export function StepProduct({ form }: { form: UseFormReturn<BusinessProfileFormData> }) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="niche"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What niche are you in (or interested in)?</FormLabel>
            <FormControl>
              <RadioCardGroup options={NICHES} value={field.value} onChange={field.onChange} columns={3} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="product"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What do you sell? <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
            <FormControl>
              <Input placeholder="e.g. Cat water fountains — leave blank if you're not sure yet" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="average_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What price range are you thinking? <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
            <FormControl>
              <RadioCardGroup options={PRICE_RANGES} value={field.value} onChange={field.onChange} columns={3} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
