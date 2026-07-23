const TOKEN_KEY = "agripulse-access-token";
const USER_KEY = "agripulse-admin-user";

export type AdminRole = "OFFICER" | "SYSTEM_ADMIN";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
};

export const DEMO_ADMIN_EMAIL = "admin@agripulse.rw";
export const DEMO_ADMIN_PASSWORD = "ChangeMe123!";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setAdminSession(accessToken: string, user: AuthUser) {
  window.localStorage.setItem(TOKEN_KEY, accessToken);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  // legacy flag used by older UI checks
  window.localStorage.setItem("agripulse-admin-session", "1");
}

export function clearAdminSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem("agripulse-admin-session");
}

export function hasAdminSession() {
  return Boolean(getAccessToken());
}
