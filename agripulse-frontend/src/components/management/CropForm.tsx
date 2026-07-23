"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Leaf } from "lucide-react";
import { useAppData } from "@/lib/app-data";
import type { CropIndex } from "@/lib/management-data";

type Props = {
  mode: "create" | "edit";
  cropId?: string;
};

export function CropForm({ mode, cropId }: Props) {
  const router = useRouter();
  const { addCrop, updateCrop, getCrop } = useAppData();
  const existing = cropId ? getCrop(cropId) : undefined;

  const [name, setName] = useState("");
  const [variety, setVariety] = useState("");
  const [index, setIndex] = useState<CropIndex>("new_entry");
  const [iconTone, setIconTone] = useState<"green" | "orange" | "deep">("green");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!existing) return;
    setName(existing.name);
    setVariety(existing.variety);
    setIndex(existing.index);
    setIconTone(existing.iconTone);
  }, [existing]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !variety.trim()) {
      setError("Crop name and variety are required.");
      return;
    }

    try {
      if (mode === "edit" && cropId) {
        await updateCrop(cropId, { name, variety, index, iconTone });
      } else {
        await addCrop({ name, variety, index, iconTone });
      }

      setSaved(true);
      window.setTimeout(() => {
        router.push("/management?tab=crops");
      }, 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save crop.");
    }
  }

  if (mode === "edit" && cropId && !existing) {
    return (
      <div className="rounded-2xl border border-ap-line bg-white p-8 text-center">
        <p className="font-semibold">Crop not found</p>
        <p className="mt-1 text-sm text-ap-muted">
          It may have been deleted or the link is invalid.
        </p>
        <Link
          href="/management?tab=crops"
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
        href="/management?tab=crops"
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-ap-green hover:text-ap-green-deep"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Management
      </Link>

      <section className="rounded-2xl border border-ap-line bg-white p-6 shadow-[0_1px_2px_rgba(26,31,28,0.04)]">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ap-green-soft text-ap-green">
            <Leaf className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {mode === "edit" ? "Edit Crop" : "Register New Crop"}
            </h1>
            <p className="text-sm text-ap-muted">
              Define a crop variety for Rwanda&apos;s market listings.
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Crop Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Irish Potato"
              className="w-full rounded-xl border border-ap-line bg-ap-bg/40 px-3.5 py-3 text-sm outline-none focus:border-ap-green focus:bg-white"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Variety</span>
            <input
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              placeholder="e.g. Kinigi Special"
              className="w-full rounded-xl border border-ap-line bg-ap-bg/40 px-3.5 py-3 text-sm outline-none focus:border-ap-green focus:bg-white"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">
              Market Price Index
            </span>
            <select
              value={index}
              onChange={(e) => setIndex(e.target.value as CropIndex)}
              className="w-full rounded-xl border border-ap-line bg-ap-bg/40 px-3.5 py-3 text-sm outline-none focus:border-ap-green focus:bg-white"
            >
              <option value="high_demand">High Demand</option>
              <option value="stable">Stable</option>
              <option value="new_entry">New Entry</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Icon Style</span>
            <select
              value={iconTone}
              onChange={(e) =>
                setIconTone(e.target.value as "green" | "orange" | "deep")
              }
              className="w-full rounded-xl border border-ap-line bg-ap-bg/40 px-3.5 py-3 text-sm outline-none focus:border-ap-green focus:bg-white"
            >
              <option value="green">Green leaf</option>
              <option value="orange">Orange leaf</option>
              <option value="deep">Deep green tractor</option>
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
              {mode === "edit" ? "Save Changes" : "Register Crop"}
            </button>
            <Link
              href="/management?tab=crops"
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
