"use client";

import { useEffect, useRef, useState } from "react";
import { Download, MoreVertical, RefreshCw } from "lucide-react";
import { topQueriedCrops } from "@/lib/analytics-data";

export function MostQueriedCropsCard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  function exportCsv() {
    const rows = [
      "Crop,Queries,Share",
      ...topQueriedCrops.map(
        (crop) => `${crop.name},${crop.valueLabel},${crop.percent}%`,
      ),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "most-queried-crops.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setMenuOpen(false);
  }

  return (
    <section className="rounded-2xl border border-ap-line bg-white p-5 shadow-[0_1px_2px_rgba(26,31,28,0.04)]">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">
          Most Queried Crops
        </h2>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            className="rounded-lg p-1.5 text-ap-muted hover:bg-ap-bg hover:text-ap-ink"
            aria-label="More options"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen ? (
            <div className="absolute right-0 top-full z-10 mt-1 w-44 overflow-hidden rounded-xl border border-ap-line bg-white shadow-lg">
              <button
                type="button"
                onClick={exportCsv}
                className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm font-medium hover:bg-ap-bg"
              >
                <Download className="h-4 w-4 text-ap-muted" />
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  window.alert("Crop rankings refreshed with latest mock data.");
                }}
                className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm font-medium hover:bg-ap-bg"
              >
                <RefreshCw className="h-4 w-4 text-ap-muted" />
                Refresh
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <ul className="space-y-4">
        {topQueriedCrops.map((crop) => (
          <li key={crop.name}>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-ap-ink">
                {crop.name}
              </span>
              <span
                className={[
                  "text-sm font-bold tabular-nums",
                  crop.tone === "green" ? "text-ap-green" : "text-ap-orange",
                ].join(" ")}
              >
                {crop.valueLabel}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-ap-bg">
              <div
                className={[
                  "h-full rounded-full transition-all",
                  crop.tone === "green" ? "bg-ap-green" : "bg-ap-orange",
                ].join(" ")}
                style={{ width: `${crop.percent}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
