"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import Link from "next/link";
import {
  BarChart3,
  CircleHelp,
  ClipboardPen,
  LayoutDashboard,
  Settings2,
} from "lucide-react";
import { AgriPulseLogo } from "@/components/brand/AgriPulseLogo";
import { DashboardFooter } from "@/components/layout/DashboardFooter";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { navItems } from "@/lib/dashboard-data";

type ShellContextValue = {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
};

const ShellContext = createContext<ShellContextValue | null>(null);

const icons = {
  dashboard: LayoutDashboard,
  "price-entry": ClipboardPen,
  management: Settings2,
  analytics: BarChart3,
};

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) {
    throw new Error("useShell must be used within AppShell");
  }
  return ctx;
}

export function AppShell({
  children,
  showFooter = true,
}: {
  children: ReactNode;
  showFooter?: boolean;
}) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const value = useMemo(
    () => ({
      mobileNavOpen,
      setMobileNavOpen,
      toggleMobileNav: () => setMobileNavOpen((open) => !open),
    }),
    [mobileNavOpen],
  );

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileNavOpen]);

  return (
    <ShellContext.Provider value={value}>
      <div className="flex min-h-screen bg-ap-bg">
        <Sidebar />

        {mobileNavOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/35"
              aria-label="Close menu overlay"
              onClick={() => setMobileNavOpen(false)}
            />
            <aside className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col border-r border-ap-line bg-ap-sidebar shadow-xl">
              <div className="flex items-center justify-between px-5 pb-3 pt-6">
                <AgriPulseLogo href="/dashboard" wordmark="AgriPulse" size="sm" />
                <button
                  type="button"
                  className="rounded-lg p-2 text-ap-muted hover:bg-white/70 hover:text-ap-ink"
                  aria-label="Close menu"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-1 px-3 pt-2">
                {navItems.map((item) => {
                  const Icon = icons[item.id];
                  const active =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={[
                        "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] font-medium transition-colors",
                        active
                          ? "bg-ap-orange text-white shadow-sm"
                          : "text-ap-ink/80 hover:bg-white/60",
                      ].join(" ")}
                    >
                      <Icon
                        className="h-[18px] w-[18px]"
                        strokeWidth={active ? 2.4 : 2}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto space-y-3 px-3 pb-5">
                <Link
                  href="/support"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] font-medium text-ap-ink/80 transition hover:bg-white/60"
                >
                  <CircleHelp className="h-[18px] w-[18px]" />
                  Support Center
                </Link>
              </div>
            </aside>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <TopNav />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-6">
              {children}
              {showFooter ? <DashboardFooter /> : null}
            </div>
          </main>
        </div>
      </div>
    </ShellContext.Provider>
  );
}
