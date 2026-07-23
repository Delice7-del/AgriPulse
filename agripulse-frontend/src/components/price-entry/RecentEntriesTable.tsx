"use client";

import Link from "next/link";
import { ArrowRight, Leaf, Sprout, Tractor } from "lucide-react";
import { useAppData } from "@/lib/app-data";
import type { RecentEntry } from "@/lib/price-entry-data";

function CropIcon({ icon }: { icon: RecentEntry["icon"] }) {
  if (icon === "maize") {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ap-green text-white">
        <Tractor className="h-4 w-4" strokeWidth={2.2} />
      </span>
    );
  }

  if (icon === "beans") {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3d4b5] text-[#8a5a2b]">
        <Sprout className="h-4 w-4" strokeWidth={2.2} />
      </span>
    );
  }

  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-white">
      <Leaf className="h-4 w-4" strokeWidth={2.2} />
    </span>
  );
}

export function RecentEntriesTable() {
  const { priceEntries } = useAppData();

  return (
    <section className="overflow-hidden rounded-2xl border border-ap-line bg-white shadow-[0_1px_2px_rgba(26,31,28,0.04)]">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-xl font-semibold tracking-tight text-ap-ink">
          Recent Entries
        </h2>
        <Link
          href="/price-entry#recent-entries"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ap-green hover:text-ap-green-deep"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div id="recent-entries" className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-[#eceae4] text-xs font-semibold uppercase tracking-wide text-ap-muted">
              <th className="px-5 py-3 font-semibold">Crop</th>
              <th className="px-5 py-3 font-semibold">Market</th>
              <th className="px-5 py-3 font-semibold">Price (RWF)</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>
            {priceEntries.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-8 text-center text-sm text-ap-muted"
                >
                  No price entries yet. Submit one above.
                </td>
              </tr>
            ) : (
              priceEntries.map((entry, index) => (
                <tr
                  key={entry.id}
                  className={[
                    "border-t border-ap-line/80",
                    index % 2 === 0 ? "bg-[#f7f5f0]" : "bg-white",
                  ].join(" ")}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <CropIcon icon={entry.icon} />
                      <span className="font-semibold text-ap-ink">
                        {entry.crop}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-ap-muted">{entry.market}</td>
                  <td className="px-5 py-4 text-base font-bold tabular-nums text-ap-ink">
                    {entry.price.toLocaleString("en-US")}
                  </td>
                  <td className="px-5 py-4">
                    {entry.status === "verified" ? (
                      <span className="inline-flex rounded-full bg-ap-green-soft px-3 py-1 text-xs font-semibold text-ap-green-deep">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-ap-orange-soft px-3 py-1 text-xs font-semibold text-[#b86412]">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-ap-muted">
                    {entry.time}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
