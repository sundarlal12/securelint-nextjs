/**
 * userCache — localStorage helpers for fast dashboard loading.
 *
 * Keys stored:
 *   user_token, user_refresh_token          (auth)
 *   user_email, user_full_name              (identity)
 *   user_plan_id, user_plan_status          (quick access)
 *   user_profile    JSON  full /api/user/me response
 *   user_settings   JSON  settings object from /api/user/me
 *   user_plans      JSON  array from /api/plans
 */

const API_BASE = () =>
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_BASE) ||
  "https://securelint-api.vercel.app";

/* ── Cache keys that belong to a user session ── */
const SESSION_KEYS = [
  "user_token",
  "user_refresh_token",
  "user_email",
  "user_full_name",
  "user_plan_id",
  "user_plan_status",
  "user_profile",
  "user_settings",
  "user_plans",
  "billing_plan_id",
  "billing_plan_name",
  "billing_price",
];

/* ── Typed cache shapes ── */
export interface CachedProfile {
  user_id:    string;
  email:      string;
  full_name:  string;
  created_at: string;
  plan:       { id: string; name: string; price_monthly: number };
  plan_status: string;
  settings?:  Record<string, unknown>;
}

export interface CachedPlan {
  id:             string;
  name:           string;
  price_monthly:  number | null;
}

/* ── Read helpers ── */
export function getCachedProfile(): CachedProfile | null {
  try {
    const raw = localStorage.getItem("user_profile");
    return raw ? (JSON.parse(raw) as CachedProfile) : null;
  } catch { return null; }
}

export function getCachedSettings(): Record<string, unknown> {
  try {
    const raw = localStorage.getItem("user_settings");
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  } catch { return {}; }
}

export function getCachedPlans(): CachedPlan[] {
  try {
    const raw = localStorage.getItem("user_plans");
    return raw ? (JSON.parse(raw) as CachedPlan[]) : [];
  } catch { return []; }
}

/* ── Write helper — called after login and after revalidation ── */
export function saveProfile(data: CachedProfile) {
  localStorage.setItem("user_profile",   JSON.stringify(data));
  if (data.settings !== undefined) {
    localStorage.setItem("user_settings", JSON.stringify(data.settings));
  }
  localStorage.setItem("user_email",     data.email      || "");
  localStorage.setItem("user_full_name", data.full_name  || "");
  localStorage.setItem("user_plan_id",   data.plan?.id   || "free");
  localStorage.setItem("user_plan_status", data.plan_status || "inactive");
}

export function savePlans(plans: CachedPlan[]) {
  localStorage.setItem("user_plans", JSON.stringify(plans));
}

/* ── Clear all user data on logout ── */
export function clearUserCache() {
  SESSION_KEYS.forEach(k => localStorage.removeItem(k));
}

/* ── Fetch fresh profile from server and update cache ── */
export async function revalidateProfile(token: string): Promise<CachedProfile | null> {
  try {
    const res = await fetch(`${API_BASE()}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json() as CachedProfile;
    if (data && !("error" in data && data.error)) {
      saveProfile(data);
      return data;
    }
    return null;
  } catch { return null; }
}

/* ── Fetch fresh plans and update cache ── */
export async function revalidatePlans(): Promise<CachedPlan[]> {
  try {
    const res  = await fetch(`${API_BASE()}/api/plans`);
    const data = await res.json() as { plans?: CachedPlan[] };
    const plans = (data.plans || []).map((p: CachedPlan) => ({
      ...p,
      name: p.id === "free" ? "Basic" : p.name,
    }));
    if (plans.length) savePlans(plans);
    return plans;
  } catch { return []; }
}

/**
 * Warm the full cache right after login/signup.
 * Call this once with the access_token immediately after auth succeeds.
 */
export async function warmCache(token: string): Promise<void> {
  await Promise.all([
    revalidateProfile(token),
    revalidatePlans(),
  ]);
}
