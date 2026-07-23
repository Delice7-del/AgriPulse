"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Search,
  Sheet,
} from "lucide-react";
import { livePrices, type PriceRow } from "@/lib/dashboard-data";

const PAGE_SIZE = 4;

function CropGlyph({ icon }: { icon: PriceRow["icon"] }) {
  const styles: Record<PriceRow["icon"], string> = {
    maize: "bg-amber-100 text-amber-700",
    potato: "bg-stone-200 text-stone-700",
    beans: "bg-yellow-100 text-yellow-800",
    tomato: "bg-red-100 text-red-700",
  };
  const labels: Record<PriceRow["icon"], string> = {
    maize: "MZ",
    potato: "PT",
    beans: "BN",
    tomato: "TM",
  };

  return (
    <span
      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${styles[icon]}`}
    >
      {labels[icon]}
    </span>
  );
}

export function LivePricesTable() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return livePrices;
    return livePrices.filter(
      (row) =>
        row.crop.toLowerCase().includes(q) ||
        row.market.toLowerCase().includes(q),
    );
  }, [query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const rows = filtered.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE,
  );
  const from = filtered.length === 0 ? 0 : safePage * PAGE_SIZE + 1;
  const to = Math.min(filtered.length, (safePage + 1) * PAGE_SIZE);

  return (
    <section className="rounded-2xl border border-ap-line/70 bg-ap-surface shadow-[0_1px_2px_rgba(26,31,28,0.04)]">
      <div className="flex flex-col gap-4 border-b border-ap-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ap-green-soft text-ap-green">
            <Sheet className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <h2 className="text-lg font-semibold tracking-tight">
            Live Market Prices
          </h2>
        </div>

        <label className="relative block w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ap-muted" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search crops or markets..."
            className="w-full rounded-xl border border-ap-line bg-ap-bg/60 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-ap-muted focus:border-ap-green focus:bg-white"
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-ap-line text-xs font-semibold uppercase tracking-wide text-ap-muted">
              <th className="px-5 py-3 font-semibold">Crop</th>
              <th className="px-5 py-3 font-semibold">Market</th>
              <th className="px-5 py-3 font-semibold">Price (RWF/kg)</th>
              <th className="px-5 py-3 font-semibold">Trend</th>
              <th className="px-5 py-3 font-semibold">AI Advice</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-8 text-center text-sm text-ap-muted"
                >
                  No crops match your search.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-ap-line/70 last:border-b-0"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <CropGlyph icon={row.icon} />
                      <span className="font-semibold text-ap-ink">
                        {row.crop}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-ap-muted">{row.market}</td>
                  <td className="px-5 py-4 text-lg font-semibold tabular-nums">
                    {row.price}
                  </td>
                  <td className="px-5 py-4">
                    {row.trend === "up" ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-ap-green">
                        <ArrowUpRight className="h-4 w-4" />
                        Up
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-ap-orange">
                        <ArrowDownRight className="h-4 w-4" />
                        Down
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {row.advice === "sell_now" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-ap-green px-3 py-1.5 text-sm font-semibold text-white">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Sell Now
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-ap-orange px-3 py-1.5 text-sm font-semibold text-white">
                        <Clock3 className="h-3.5 w-3.5" />
                        Wait
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-ap-line px-5 py-3 text-sm text-ap-muted">
        <p>
          Showing {from}-{to} of {filtered.length} crops
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={safePage <= 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-lg p-2 hover:bg-ap-bg disabled:opacity-40"
            aria-label="Previous page"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            className="rounded-lg p-2 hover:bg-ap-bg disabled:opacity-40"
            aria-label="Next page"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
