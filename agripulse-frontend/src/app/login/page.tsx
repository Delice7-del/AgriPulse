"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { AgriPulseLogo } from "@/components/brand/AgriPulseLogo";
import {
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
  setAdminSession,
} from "@/lib/admin-session";
import { ApiError } from "@/lib/api/client";
import { loginApi } from "@/lib/api/auth";
import { useAppData } from "@/lib/app-data";

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAppData();
  const [email, setEmail] = useState(DEMO_ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginApi(email.trim(), password);
      setAdminSession(result.accessToken, result.user);
      await refresh();
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(
          "Cannot reach the API. Start the backend on NEXT_PUBLIC_API_URL.",
        );
      }
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-ap-bg">
      <header className="border-b border-ap-line/80 bg-ap-bg/90 px-4 py-4 sm:px-6">
        <AgriPulseLogo href="/" wordmark="AgriPulse" size="sm" />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <section className="w-full max-w-md rounded-2xl border border-ap-line bg-white p-6 shadow-[0_1px_2px_rgba(26,31,28,0.04)] sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ap-orange-soft text-ap-orange">
              <LockKeyhole className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-ap-ink">
                Admin Login
              </h1>
              <p className="text-sm text-ap-muted">
                Sign in against the AgriPulse NestJS API.
              </p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                className="w-full rounded-xl border border-ap-line bg-ap-bg/40 px-3.5 py-3 text-sm outline-none focus:border-ap-green focus:bg-white"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter password"
                className="w-full rounded-xl border border-ap-line bg-ap-bg/40 px-3.5 py-3 text-sm outline-none focus:border-ap-green focus:bg-white"
                required
              />
            </label>

            {error ? (
              <p className="text-sm font-medium text-red-600">{error}</p>
            ) : (
              <p className="text-xs text-ap-muted">
                Seeded account: {DEMO_ADMIN_EMAIL} / {DEMO_ADMIN_PASSWORD}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-ap-green px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-ap-green-deep disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in to Dashboard"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-ap-muted">
            Looking for farmer prices?{" "}
            <Link
              href="/#how-it-works"
              className="font-semibold text-ap-green hover:text-ap-green-deep"
            >
              Dial *384*1# on any phone
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
