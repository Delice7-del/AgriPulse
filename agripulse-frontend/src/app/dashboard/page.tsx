"use client";

import Link from "next/link";
import { CalendarDays, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { LivePricesTable } from "@/components/dashboard/LivePricesTable";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { StatCards } from "@/components/dashboard/StatCards";
import { SystemPerformance } from "@/components/dashboard/SystemPerformance";

function todayLabel() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(new Date());
}

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ap-ink sm:text-4xl">
            Officer Overview
          </h1>
          <p className="mt-1 text-ap-muted">
            Real-time agricultural market intelligence for Rwanda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() =>
              window.alert(
                `Reporting window: Today (${todayLabel()}). Filter by date will connect to live analytics next.`,
              )
            }
            className="inline-flex items-center gap-2 rounded-xl border border-ap-line bg-white px-3.5 py-2.5 text-sm font-medium text-ap-ink shadow-sm"
          >
            <CalendarDays className="h-4 w-4 text-ap-muted" />
            Today: {todayLabel()}
          </button>
          <Link
            href="/price-entry"
            className="inline-flex items-center gap-2 rounded-xl bg-ap-green px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-ap-green-deep"
          >
            <Plus className="h-4 w-4" />
            New Report
          </Link>
        </div>
      </div>

      <StatCards />
      <LivePricesTable />

      <div className="grid gap-4 lg:grid-cols-2">
        <SystemPerformance />
        <RecentActivity />
      </div>
    </AppShell>
  );
}
