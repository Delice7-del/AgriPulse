"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CircleHelp,
  ClipboardPen,
  LayoutDashboard,
  Settings2,
} from "lucide-react";
import { AgriPulseLogo } from "@/components/brand/AgriPulseLogo";
import { navItems } from "@/lib/dashboard-data";

const icons = {
  dashboard: LayoutDashboard,
  "price-entry": ClipboardPen,
  management: Settings2,
  analytics: BarChart3,
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-svh w-[240px] shrink-0 flex-col self-start overflow-y-auto border-r border-ap-line bg-ap-sidebar lg:flex">
      <div className="px-5 pb-4 pt-7">
        <AgriPulseLogo href="/dashboard" wordmark="AgriPulse" size="sm" />
        <p className="mt-1.5 pl-[2.65rem] text-[11px] font-semibold uppercase tracking-[0.12em] text-ap-muted">
          Admin
        </p>
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
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] font-medium text-ap-ink/80 transition hover:bg-white/60"
        >
          <CircleHelp className="h-[18px] w-[18px]" />
          Support Center
        </Link>
        <p className="px-3 text-xs text-ap-muted">v2.4.0 Stabilized</p>
      </div>
    </aside>
  );
}
