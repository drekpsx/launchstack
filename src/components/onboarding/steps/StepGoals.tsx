import type { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioCardGroup } from "@/components/onboarding/RadioCardGroup";
import { MAIN_PROBLEMS } from "@/config/questionnaire";
import type { BusinessProfileFormData } from "@/components/onboarding/schema";

export function StepGoals({ form }: { form: UseFormReturn<BusinessProfileFormData> }) {
  return (
    <div className="space-y-6">
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
        name="main_problem"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What's your biggest problem right now?</FormLabel>
            <FormControl>
              <RadioCardGroup options={MAIN_PROBLEMS} value={field.value} onChange={field.onChange} columns={3} />
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
