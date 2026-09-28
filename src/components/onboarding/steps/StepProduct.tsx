import type { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BusinessProfileFormData } from "@/components/onboarding/schema";

export function StepProduct({ form }: { form: UseFormReturn<BusinessProfileFormData> }) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="product"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What do you sell?</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Cat water fountains" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="niche"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What niche are you in?</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Pet accessories" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="average_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Average selling price</FormLabel>
              <FormControl>
                <Input placeholder="e.g. €39" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="product_cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Approximate cost per unit</FormLabel>
              <FormControl>
                <Input placeholder="e.g. €9" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="unique_selling_point"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What makes your product different?</FormLabel>
            <FormControl>
              <Textarea placeholder="e.g. Filters water continuously and looks good on a countertop" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
