import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AuthCard } from "@/components/auth/AuthCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getPendingProfile, clearPendingProfile } from "@/lib/pendingBusinessProfile";
import { toast } from "sonner";

const signupSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp } = useAuth();
  const fromQuiz = searchParams.get("fromQuiz") === "true";

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { firstName: "", email: "", password: "" },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password, data.firstName);

    if (error) {
      setIsLoading(false);
      toast.error(error);
      return;
    }

    // Quiz answers taken before creating an account are saved here — fetch
    // the fresh session directly rather than trusting this component's
    // (possibly stale) auth state right after signUp() resolves.
    const pending = getPendingProfile();
    const { data: sessionData } = await supabase.auth.getUser();
    setIsLoading(false);

    if (pending && sessionData.user) {
      const { error: saveError } = await supabase
        .from("business_profiles")
        .upsert({ ...pending, user_id: sessionData.user.id }, { onConflict: "user_id" });
      if (!saveError) {
        await supabase.from("profiles").update({ onboarding_completed: true }).eq("user_id", sessionData.user.id);
        clearPendingProfile();
        toast.success("Account created — your system is ready!");
        navigate("/onboarding/complete");
        return;
      }
    }

    if (pending && !sessionData.user) {
      // Email confirmation is required before a session exists. The answers
      // stay saved locally and will be applied the moment they log in.
      toast.success("Check your email to confirm your account, then log in.");
      navigate("/login");
      return;
    }

    toast.success("Account created!");
    navigate(fromQuiz ? "/dashboard" : "/onboarding");
  };

  return (
    <AuthCard
      title={fromQuiz ? "Almost there" : "Build my system"}
      description={
        fromQuiz
          ? "Create your account to save your answers and see your personalized system."
          : "Create your account, then tell us about your business."
      }
      footer={
        <>
          Already have an account?{" "}
          <Link to={fromQuiz ? "/login?fromQuiz=true" : "/login"} className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="Alex" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="At least 6 characters" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create my account"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
