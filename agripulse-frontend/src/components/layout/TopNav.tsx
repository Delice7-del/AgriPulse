"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, UserRound } from "lucide-react";
import { AgriPulseLogo } from "@/components/brand/AgriPulseLogo";
import { useShell } from "@/components/layout/AppShell";
import {
  clearAdminSession,
  getStoredUser,
} from "@/lib/admin-session";
import { navItems } from "@/lib/dashboard-data";

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleMobileNav } = useShell();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const user = getStoredUser();

  useEffect(() => {
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!profileOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, [profileOpen]);

  return (
    <header className="sticky top-0 z-20 border-b border-ap-line/80 bg-ap-bg/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleMobileNav}
            className="rounded-lg p-2 text-ap-ink/70 transition hover:bg-white/70 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <AgriPulseLogo href="/dashboard" wordmark="AgriPulse" size="sm" />
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={[
                  "relative px-3 py-2 text-[15px] font-medium transition-colors",
                  active
                    ? "text-ap-green-deep"
                    : "text-ap-muted hover:text-ap-ink",
                ].join(" ")}
              >
                {item.label}
                {active ? (
                  <span className="absolute inset-x-3 -bottom-[13px] h-[3px] rounded-full bg-ap-green" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="relative flex items-center" ref={profileRef}>
          <button
            type="button"
            aria-label="Officer profile"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((open) => !open)}
            className="h-9 w-9 overflow-hidden rounded-full border-2 border-white shadow-sm ring-1 ring-ap-line"
            style={{
              background:
                "linear-gradient(135deg, #1f6b45 0%, #f08a24 100%)",
            }}
          />

          {profileOpen ? (
            <div className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-52 overflow-hidden rounded-xl border border-ap-line bg-white shadow-lg">
              <div className="border-b border-ap-line px-3.5 py-3">
                <p className="text-sm font-semibold text-ap-ink">
                  {user?.fullName ?? "Market Officer"}
                </p>
                <p className="text-xs text-ap-muted">
                  {user?.email ?? "admin@agripulse.rw"}
                </p>
              </div>
              <Link
                href="/support"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium text-ap-ink hover:bg-ap-bg"
              >
                <UserRound className="h-4 w-4 text-ap-muted" />
                Support Center
              </Link>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  clearAdminSession();
                  router.push("/login");
                }}
                className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm font-medium text-ap-ink hover:bg-ap-bg"
              >
                <LogOut className="h-4 w-4 text-ap-muted" />
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
