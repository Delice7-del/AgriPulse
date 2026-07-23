"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Leaf,
  MapPin,
  Pencil,
  Plus,
  Tractor,
  Trash2,
} from "lucide-react";
import { useAppData } from "@/lib/app-data";
import type { CropIndex, ManagedCrop } from "@/lib/management-data";

type Tab = "crops" | "markets";

function CropGlyph({ crop }: { crop: ManagedCrop }) {
  const tone =
    crop.iconTone === "green"
      ? "bg-ap-green-soft text-ap-green"
      : crop.iconTone === "orange"
        ? "bg-ap-orange-soft text-ap-orange"
        : "bg-ap-green text-white";

  return (
    <span
      className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}
    >
      {crop.iconTone === "deep" ? (
        <Tractor className="h-4 w-4" strokeWidth={2.2} />
      ) : (
        <Leaf className="h-4 w-4" strokeWidth={2.2} />
      )}
    </span>
  );
}

function IndexBadge({ index }: { index: CropIndex }) {
  if (index === "high_demand") {
    return (
      <span className="inline-flex rounded-full bg-ap-green px-3 py-1 text-xs font-semibold text-white">
        High Demand
      </span>
    );
  }
  if (index === "stable") {
    return (
      <span className="inline-flex rounded-full bg-stone-200 px-3 py-1 text-xs font-semibold text-stone-600">
        Stable
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-ap-orange px-3 py-1 text-xs font-semibold text-white">
      New Entry
    </span>
  );
}

export function ManagementPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { crops, markets, deleteCrop, deleteMarket } = useAppData();
  const [tab, setTab] = useState<Tab>("crops");

  useEffect(() => {
    const next = searchParams.get("tab");
    if (next === "markets" || next === "crops") {
      setTab(next);
    }
  }, [searchParams]);

  function switchTab(next: Tab) {
    setTab(next);
    router.replace(`/management?tab=${next}`);
  }

  function onDeleteCrop(id: string, name: string) {
    if (window.confirm(`Delete crop "${name}"? This cannot be undone.`)) {
      void deleteCrop(id);
    }
  }

  function onDeleteMarket(id: string, name: string) {
    if (window.confirm(`Delete market "${name}"? This cannot be undone.`)) {
      void deleteMarket(id);
    }
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ap-ink sm:text-4xl">
            Crops &amp; Markets Management
          </h1>
          <p className="mt-2 max-w-3xl text-ap-muted">
            Organize regional agricultural assets and commodity definitions for
            Rwanda&apos;s digital trade pulse.
          </p>
        </div>

        <div className="inline-flex rounded-full border border-ap-line bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => switchTab("crops")}
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              tab === "crops"
                ? "bg-ap-orange text-white"
                : "text-ap-muted hover:text-ap-ink",
            ].join(" ")}
          >
            Crops
          </button>
          <button
            type="button"
            onClick={() => switchTab("markets")}
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              tab === "markets"
                ? "bg-ap-orange text-white"
                : "text-ap-muted hover:text-ap-ink",
            ].join(" ")}
          >
            Markets
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ap-line bg-white shadow-[0_1px_2px_rgba(26,31,28,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ap-line px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ap-green-soft text-ap-green">
              {tab === "crops" ? (
                <Leaf className="h-4 w-4" strokeWidth={2.3} />
              ) : (
                <MapPin className="h-4 w-4" strokeWidth={2.3} />
              )}
            </span>
            <h2 className="text-lg font-semibold tracking-tight">
              {tab === "crops" ? "Active Crop Varieties" : "Active Markets"}
            </h2>
          </div>

          <Link
            href={
              tab === "crops"
                ? "/management/crops/new"
                : "/management/markets/new"
            }
            className="inline-flex items-center gap-2 rounded-xl bg-ap-green px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-ap-green-deep"
          >
            <Plus className="h-4 w-4" />
            {tab === "crops" ? "Add New Crop" : "Add New Market"}
          </Link>
        </div>

        {tab === "crops" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-ap-line text-sm font-semibold text-ap-ink/80">
                  <th className="px-5 py-3">Crop Name</th>
                  <th className="px-5 py-3">Variety</th>
                  <th className="px-5 py-3">Market Price Index</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {crops.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-8 text-center text-sm text-ap-muted"
                    >
                      No crops yet. Add your first crop to get started.
                    </td>
                  </tr>
                ) : (
                  crops.map((crop) => (
                  <tr
                    key={crop.id}
                    className="border-b border-ap-line/70 last:border-b-0"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <CropGlyph crop={crop} />
                        <span className="font-semibold">{crop.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-ap-muted">{crop.variety}</td>
                    <td className="px-5 py-4">
                      <IndexBadge index={crop.index} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/management/crops/${crop.id}/edit`}
                          className="rounded-lg p-2 text-ap-muted transition hover:bg-ap-bg hover:text-ap-ink"
                          aria-label={`Edit ${crop.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => onDeleteCrop(crop.id, crop.name)}
                          className="rounded-lg p-2 text-ap-muted transition hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete ${crop.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-ap-line text-sm font-semibold text-ap-ink/80">
                  <th className="px-5 py-3">Market Name</th>
                  <th className="px-5 py-3">Region</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {markets.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-8 text-center text-sm text-ap-muted"
                    >
                      No markets yet. Add your first market to get started.
                    </td>
                  </tr>
                ) : (
                  markets.map((market) => (
                  <tr
                    key={market.id}
                    className="border-b border-ap-line/70 last:border-b-0"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ap-green-soft text-ap-green">
                          <MapPin className="h-4 w-4" strokeWidth={2.2} />
                        </span>
                        <span className="font-semibold">{market.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-ap-muted">{market.region}</td>
                    <td className="px-5 py-4">
                      {market.status === "active" ? (
                        <span className="inline-flex rounded-full bg-ap-green px-3 py-1 text-xs font-semibold text-white">
                          Active
                        </span>
                      ) : market.status === "seasonal" ? (
                        <span className="inline-flex rounded-full bg-stone-200 px-3 py-1 text-xs font-semibold text-stone-600">
                          Seasonal
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-ap-orange px-3 py-1 text-xs font-semibold text-white">
                          New
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/management/markets/${market.id}/edit`}
                          className="rounded-lg p-2 text-ap-muted transition hover:bg-ap-bg hover:text-ap-ink"
                          aria-label={`Edit ${market.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => onDeleteMarket(market.id, market.name)}
                          className="rounded-lg p-2 text-ap-muted transition hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete ${market.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
