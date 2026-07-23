"use client";

import { FormEvent, useMemo, useState } from "react";
import { ChevronDown, MapPin, Send, Sprout } from "lucide-react";
import { useAppData } from "@/lib/app-data";

export function PriceSubmissionForm() {
  const { crops, markets, addPriceEntry } = useAppData();
  const [cropId, setCropId] = useState("");
  const [marketId, setMarketId] = useState("");
  const [price, setPrice] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const cropOptions = useMemo(
    () =>
      crops.map((crop) => ({
        id: crop.id,
        name: crop.name,
      })),
    [crops],
  );

  const marketOptions = useMemo(
    () =>
      markets.map((market) => ({
        id: market.id,
        name: market.name,
      })),
    [markets],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const crop = cropOptions.find((c) => c.id === cropId);
    const market = marketOptions.find((m) => m.id === marketId);
    const amount = Number(price);

    if (!crop || !market || !Number.isFinite(amount) || amount <= 0) {
      setError("Select a crop, market, and enter a valid price.");
      return;
    }

    try {
      await addPriceEntry({
        cropId: crop.id,
        marketId: market.id,
        crop: crop.name,
        market: market.name,
        price: Math.round(amount),
      });

      setSubmitted(true);
      setCropId("");
      setMarketId("");
      setPrice("");
      window.setTimeout(() => setSubmitted(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit price.");
    }
  }

  return (
    <section className="rounded-2xl border border-ap-line bg-white p-5 shadow-[0_1px_2px_rgba(26,31,28,0.04)] sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ap-green-soft text-ap-green">
          <Sprout className="h-4 w-4" strokeWidth={2.3} />
        </span>
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ap-muted">
          New Price Submission
        </p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ap-ink">
            Crop
          </span>
          <div className="relative">
            <select
              value={cropId}
              onChange={(e) => setCropId(e.target.value)}
              className="w-full appearance-none rounded-xl border border-ap-line bg-ap-bg/40 px-3.5 py-3 pr-10 text-sm outline-none transition focus:border-ap-green focus:bg-white"
              required
            >
              <option value="">Select a crop</option>
              {cropOptions.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ap-muted" />
          </div>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ap-ink">
            Market
          </span>
          <div className="relative">
            <select
              value={marketId}
              onChange={(e) => setMarketId(e.target.value)}
              className="w-full appearance-none rounded-xl border border-ap-line bg-ap-bg/40 px-3.5 py-3 pr-10 text-sm outline-none transition focus:border-ap-green focus:bg-white"
              required
            >
              <option value="">Select a market</option>
              {marketOptions.map((market) => (
                <option key={market.id} value={market.id}>
                  {market.name}
                </option>
              ))}
            </select>
            <MapPin className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ap-muted" />
          </div>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ap-ink">
            Price (RWF/kg)
          </span>
          <div className="flex overflow-hidden rounded-xl border border-ap-line bg-ap-bg/40 focus-within:border-ap-green focus-within:bg-white">
            <span className="flex items-center border-r border-ap-line px-3.5 text-sm font-semibold text-ap-muted">
              RWF
            </span>
            <input
              type="number"
              min="1"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 850"
              className="w-full bg-transparent px-3.5 py-3 text-sm outline-none"
              required
            />
          </div>
        </label>

        {error ? (
          <p className="text-sm font-medium text-red-600">{error}</p>
        ) : null}

        <button
          type="submit"
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ap-green-deep px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-ap-green"
        >
          <Send className="h-4 w-4" strokeWidth={2.3} />
          {submitted ? "Price Submitted" : "Submit Price"}
        </button>
      </form>
    </section>
  );
}
