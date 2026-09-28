import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
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

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { signIn } = useAuth();
  const fromQuiz = searchParams.get("fromQuiz") === "true";

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);

    if (error) {
      setIsLoading(false);
      toast.error(error);
      return;
    }

    // Quiz answers taken before logging in (e.g. an existing user retook the
    // quiz signed out, or had to confirm their email first) get saved now.
    const pending = getPendingProfile();
    if (pending) {
      const { data: sessionData } = await supabase.auth.getUser();
      if (sessionData.user) {
        const { error: saveError } = await supabase
          .from("business_profiles")
          .upsert({ ...pending, user_id: sessionData.user.id }, { onConflict: "user_id" });
        if (!saveError) {
          await supabase.from("profiles").update({ onboarding_completed: true }).eq("user_id", sessionData.user.id);
          clearPendingProfile();
        }
      }
    }

    setIsLoading(false);
    toast.success("Welcome back!");
    const redirectTo = (location.state as { from?: string } | null)?.from ?? "/dashboard";
    navigate(redirectTo);
  };

  return (
    <AuthCard
      title="Welcome back"
      description="Log in to your workspace."
      footer={
        <>
          New here?{" "}
          <Link to={fromQuiz ? "/signup?fromQuiz=true" : "/signup"} className="text-primary font-medium hover:underline">
            Build my system
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log in"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
