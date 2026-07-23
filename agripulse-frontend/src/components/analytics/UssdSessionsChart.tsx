"use client";

import { useMemo } from "react";
import {
  ussdSessionSeries,
  ussdSessionSeriesMonthly,
  ussdSessionSeriesYearly,
} from "@/lib/analytics-data";

export type AnalyticsRange = "weekly" | "monthly" | "yearly";

export function AnalyticsHeader({
  range,
  onRangeChange,
}: {
  range: AnalyticsRange;
  onRangeChange: (range: AnalyticsRange) => void;
}) {
  const options: Array<{ id: AnalyticsRange; label: string }> = [
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
    { id: "yearly", label: "Yearly" },
  ];

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ap-green">
          Performance Overview
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-ap-ink sm:text-4xl">
          Data Intelligence Dashboard
        </h1>
      </div>

      <div className="inline-flex rounded-xl border border-ap-line bg-white p-1 shadow-sm">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onRangeChange(option.id)}
            className={[
              "rounded-lg px-3.5 py-2 text-sm font-semibold transition",
              range === option.id
                ? "bg-ap-bg text-ap-ink shadow-sm"
                : "text-ap-muted hover:text-ap-ink",
            ].join(" ")}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function UssdSessionsChart({ range }: { range: AnalyticsRange }) {
  const width = 560;
  const height = 220;
  const padding = { top: 20, right: 16, bottom: 28, left: 12 };

  const series = useMemo(() => {
    if (range === "monthly") return ussdSessionSeriesMonthly;
    if (range === "yearly") return ussdSessionSeriesYearly;
    return ussdSessionSeries;
  }, [range]);

  const path = useMemo(() => {
    const values = series.map((d) => d.value);
    const min = Math.min(...values) * 0.8;
    const max = Math.max(...values) * 1.05;
    const innerW = width - padding.left - padding.right;
    const innerH = height - padding.top - padding.bottom;

    const points = series.map((d, i) => {
      const x =
        padding.left +
        (series.length === 1 ? innerW / 2 : (i / (series.length - 1)) * innerW);
      const y =
        padding.top + innerH - ((d.value - min) / (max - min)) * innerH;
      return { x, y, day: d.day };
    });

    const line = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");
    const area = `${line} L ${points[points.length - 1].x} ${
      height - padding.bottom
    } L ${points[0].x} ${height - padding.bottom} Z`;

    return { points, line, area };
  }, [series]);

  const subtitle =
    range === "weekly"
      ? "Last 7 days"
      : range === "monthly"
        ? "Last 6 months"
        : "Last 5 years";

  return (
    <section className="rounded-2xl border border-ap-line bg-white p-5 shadow-[0_1px_2px_rgba(26,31,28,0.04)]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            USSD Sessions per Day
          </h2>
          <p className="text-sm text-ap-muted">{subtitle}</p>
        </div>
        <span className="flex items-center gap-2 text-sm font-medium text-ap-green">
          <span className="h-2.5 w-2.5 rounded-full bg-ap-green" />
          Sessions
        </span>
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-56 w-full"
          role="img"
          aria-label="USSD sessions line chart"
        >
          <defs>
            <linearGradient id="ussdFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1f6b45" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#1f6b45" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={path.area} fill="url(#ussdFill)" />
          <path
            d={path.line}
            fill="none"
            stroke="#1f6b45"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {path.points.map((p) => (
            <g key={p.day}>
              <circle cx={p.x} cy={p.y} r="3.5" fill="#1f6b45" />
              <text
                x={p.x}
                y={height - 8}
                textAnchor="middle"
                className="fill-ap-muted text-[11px]"
              >
                {p.day}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}
