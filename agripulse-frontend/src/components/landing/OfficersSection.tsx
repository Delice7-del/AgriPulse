"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, MoreVertical } from "lucide-react";
import {
  fallbackLandingStats,
  fetchLandingStats,
  type LandingStats,
} from "@/lib/api/landing";

const officerPoints = [
  "Real-time market price updates",
  "Crop & market catalog management",
  "Historical trend visualizers",
];

function AnalyticsSnapshotCard({
  snapshot,
}: {
  snapshot: LandingStats["snapshot"];
}) {
  const max = Math.max(...snapshot.chartValues, 1);
  const bars = useMemo(() => {
    const values = snapshot.chartValues.slice(-5);
    while (values.length < 5) values.unshift(Math.max(8, max * 0.35));
    return values;
  }, [snapshot.chartValues, max]);

  const peakIndex = bars.indexOf(Math.max(...bars));

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ap-green/40 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">Analytics Snapshot</h3>
        <button
          type="button"
          className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Snapshot options"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-white/85">
          {snapshot.districtLabel}
        </span>
        <span className="font-semibold text-ap-orange">
          {snapshot.growthPercent >= 0 ? "+" : ""}
          {snapshot.growthPercent}% Growth
        </span>
      </div>

      <div className="flex h-36 items-end justify-between gap-2 rounded-xl bg-black/10 px-3 pb-3 pt-4">
        {bars.map((value, index) => {
          const height = Math.max(18, Math.round((value / max) * 100));
          const peak = index === peakIndex;
          return (
            <div
              key={`${value}-${index}`}
              className="flex flex-1 items-end justify-center"
            >
              <div
                className={[
                  "w-full max-w-[2.25rem] rounded-t-md transition-all",
                  peak ? "bg-ap-orange" : "bg-[#c4a35a]",
                ].join(" ")}
                style={{ height: `${height}%` }}
                title={`${value} sessions`}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-white/60">
            Active Crops
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-white">
            {snapshot.activeCrops.toLocaleString("en-US")}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-white/60">
            Daily Requests
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-white">
            {snapshot.todaySessions.toLocaleString("en-US")}
          </p>
        </div>
      </div>
    </div>
  );
}

export function OfficersSection() {
  const [stats, setStats] = useState<LandingStats>(fallbackLandingStats);

  useEffect(() => {
    let cancelled = false;
    fetchLandingStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-ap-green-deep py-16 text-white sm:py-20">
      <div
        className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-ap-orange/35 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
        <div>
          <span className="inline-flex rounded-full bg-ap-orange/25 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
            District Admin
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Empower Your District.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/80">
            Agricultural officers can manage prices, monitor local market
            health, and view analytics in real time. Gain bird&apos;s-eye
            insights to support regional agricultural decisions.
          </p>

          <ul className="mt-7 space-y-3.5">
            {officerPoints.map((point) => (
              <li key={point} className="flex items-center gap-3 text-sm font-medium">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ap-orange text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>

          <Link
            href="/login"
            className="mt-8 inline-flex rounded-xl bg-ap-orange px-5 py-3.5 text-sm font-semibold text-ap-ink shadow-sm transition hover:brightness-95"
          >
            Enter Admin Dashboard
          </Link>
        </div>

        <AnalyticsSnapshotCard snapshot={stats.snapshot} />
      </div>
    </section>
  );
}
