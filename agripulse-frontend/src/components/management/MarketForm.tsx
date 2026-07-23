"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, MapPin } from "lucide-react";
import { useAppData } from "@/lib/app-data";
import type { ManagedMarket } from "@/lib/management-data";

type Props = {
  mode: "create" | "edit";
  marketId?: string;
};

export function MarketForm({ mode, marketId }: Props) {
  const router = useRouter();
  const { addMarket, updateMarket, getMarket } = useAppData();
  const existing = marketId ? getMarket(marketId) : undefined;

  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState<ManagedMarket["status"]>("new");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!existing) return;
    setName(existing.name);
    setRegion(existing.region);
    setStatus(existing.status);
  }, [existing]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !region.trim()) {
      setError("Market name and region are required.");
      return;
    }

    try {
      if (mode === "edit" && marketId) {
        await updateMarket(marketId, { name, region, status });
      } else {
        await addMarket({ name, region, status });
      }

      setSaved(true);
      window.setTimeout(() => {
        router.push("/management?tab=markets");
      }, 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save market.");
    }
  }

  if (mode === "edit" && marketId && !existing) {
    return (
      <div className="rounded-2xl border border-ap-line bg-white p-8 text-center">
        <p className="font-semibold">Market not found</p>
        <p className="mt-1 text-sm text-ap-muted">
          It may have been deleted or the link is invalid.
        </p>
        <Link
          href="/management?tab=markets"
          className="mt-4 inline-flex rounded-xl bg-ap-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-ap-green-deep"
        >
          Back to Management
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Link
        href="/management?tab=markets"
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-ap-green hover:text-ap-green-deep"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Management
      </Link>

      <section className="rounded-2xl border border-ap-line bg-white p-6 shadow-[0_1px_2px_rgba(26,31,28,0.04)]">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ap-green-soft text-ap-green">
            <MapPin className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {mode === "edit" ? "Edit Market" : "Register New Market"}
            </h1>
            <p className="text-sm text-ap-muted">
              Add a trading location used for USSD and price entry.
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Market Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nyabugogo"
              className="w-full rounded-xl border border-ap-line bg-ap-bg/40 px-3.5 py-3 text-sm outline-none focus:border-ap-green focus:bg-white"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Region</span>
            <input
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. Kigali City"
              className="w-full rounded-xl border border-ap-line bg-ap-bg/40 px-3.5 py-3 text-sm outline-none focus:border-ap-green focus:bg-white"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Status</span>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as ManagedMarket["status"])
              }
              className="w-full rounded-xl border border-ap-line bg-ap-bg/40 px-3.5 py-3 text-sm outline-none focus:border-ap-green focus:bg-white"
            >
              <option value="active">Active</option>
              <option value="seasonal">Seasonal</option>
              <option value="new">New</option>
            </select>
          </label>

          {error ? (
            <p className="text-sm font-medium text-red-600">{error}</p>
          ) : null}

          {saved ? (
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-ap-green">
              <CheckCircle2 className="h-4 w-4" />
              Saved successfully. Redirecting…
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex rounded-xl bg-ap-green px-5 py-3 text-sm font-semibold text-white hover:bg-ap-green-deep"
            >
              {mode === "edit" ? "Save Changes" : "Register Market"}
            </button>
            <Link
              href="/management?tab=markets"
              className="inline-flex rounded-xl border border-ap-line bg-white px-5 py-3 text-sm font-semibold text-ap-ink hover:bg-ap-bg"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
