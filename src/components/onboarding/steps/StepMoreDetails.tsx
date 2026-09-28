import type { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioCardGroup } from "@/components/onboarding/RadioCardGroup";
import { CheckboxGroup } from "@/components/onboarding/CheckboxGroup";
import { MAIN_OBJECTIONS, CONTENT_TYPES } from "@/config/questionnaire";
import type { BusinessProfileFormData } from "@/components/onboarding/schema";

// Everything here is optional — it sharpens the personalized prompts, but
// nothing here blocks finishing the quiz. A total beginner can skip straight
// to "Build my system" from step 3 and fill this in later from My Business.
export function StepMoreDetails({ form }: { form: UseFormReturn<BusinessProfileFormData> }) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Optional — answering these makes your prompts more specific, but you can skip straight to the next
        button and fill this in later.
      </p>

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

      <FormField
        control={form.control}
        name="revenue_goal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What's your monthly revenue goal?</FormLabel>
            <FormControl>
              <Input placeholder="e.g. €10,000" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="goal_90_days"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What's your goal for the next 90 days?</FormLabel>
            <FormControl>
              <Textarea placeholder="e.g. Launch my store and get my first 50 orders" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="desired_result"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What result do you want from this system?</FormLabel>
            <FormControl>
              <Textarea placeholder="e.g. A clear plan and ready-to-use prompts so I stop guessing" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
