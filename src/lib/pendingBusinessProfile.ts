import type { BusinessProfileFormData } from "@/components/onboarding/schema";

// Holds quiz answers between "finished the quiz, not logged in yet" and
// "just created an account" — so the quiz can run before signup without
// losing the answers. Browser-local only, cleared once saved to Supabase.
const STORAGE_KEY = "launchstack:pending-business-profile";

export function savePendingProfile(data: BusinessProfileFormData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage failures (private browsing, quota, etc.) — worst case
    // the user re-answers the quiz after signing up.
  }
}

export function getPendingProfile(): BusinessProfileFormData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BusinessProfileFormData) : null;
  } catch {
    return null;
  }
}

export function clearPendingProfile() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore.
  }
}
