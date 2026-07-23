import { apiRequest } from "@/lib/api/client";
import type { AuthUser } from "@/lib/admin-session";

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export function loginApi(email: string, password: string) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    auth: false,
    body: { email, password },
  });
}

export function meApi() {
  return apiRequest<AuthUser>("/auth/me");
}
