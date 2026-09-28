import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { PLANS } from "@/config/plans";
import { SUPPORT_EMAIL } from "@/config/app";

export default function Settings() {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();

  const [firstName, setFirstName] = useState(profile?.first_name ?? "");
  const [savingName, setSavingName] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const plan = profile?.plan === "pro" ? "pro" : "free";

  const handleSaveName = async () => {
    setSavingName(true);
    try {
      await updateProfile.mutateAsync({ first_name: firstName });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update profile");
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setNewPassword("");
    toast.success("Password updated");
  };

  const handleDeleteRequest = async () => {
    toast.info(`We've noted your request. Email ${SUPPORT_EMAIL} to confirm account deletion.`);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and subscription.</p>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold">Profile</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email ?? ""} disabled />
          </div>
        </div>
        <Button onClick={handleSaveName} disabled={savingName}>
          Save changes
        </Button>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold">Password</h2>
        <div className="space-y-1.5 max-w-xs">
          <Label htmlFor="newPassword">New password</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
        </div>
        <Button onClick={handleChangePassword} disabled={savingPassword}>
          Update password
        </Button>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold">Business profile</h2>
        <p className="text-sm text-muted-foreground">
          Your business profile drives every personalized prompt. Update it any time it changes.
        </p>
        <Button variant="outline" asChild>
          <Link to="/dashboard/business">Go to My Business</Link>
        </Button>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Subscription</h2>
          <Badge variant={plan === "pro" ? "default" : "secondary"} className="capitalize">
            {PLANS[plan].name}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{PLANS[plan].tagline}</p>
        {plan === "free" ? (
          <Button asChild>
            <Link to="/pricing">Upgrade to Pro</Link>
          </Button>
        ) : (
          <Button variant="outline" disabled>
            Manage billing (Stripe portal — coming soon)
          </Button>
        )}
      </Card>

      <Separator />

      <Card className="p-6 space-y-4 border-destructive/30">
        <h2 className="font-semibold text-destructive">Danger zone</h2>
        <p className="text-sm text-muted-foreground">
          Deleting your account permanently removes your business profile, favorites and history.
        </p>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={handleDeleteRequest}>
            Delete my account
          </Button>
          <Button variant="ghost" onClick={() => signOut()}>
            Log out
          </Button>
        </div>
      </Card>
    </div>
  );
}
