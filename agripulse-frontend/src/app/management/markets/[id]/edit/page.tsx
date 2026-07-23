"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { MarketForm } from "@/components/management/MarketForm";
import { useAppData } from "@/lib/app-data";

export default function EditMarketPage() {
  const params = useParams<{ id: string }>();
  const { ready, getMarket } = useAppData();
  const market = getMarket(params.id);

  return (
    <AppShell>
      {!ready ? (
        <p className="text-ap-muted">Loading market…</p>
      ) : market ? (
        <MarketForm mode="edit" marketId={market.id} />
      ) : (
        <div className="rounded-2xl border border-ap-line bg-white p-8 text-center">
          <p className="font-semibold">Market not found.</p>
          <Link
            href="/management?tab=markets"
            className="mt-4 inline-flex text-sm font-semibold text-ap-green"
          >
            Back to Management
          </Link>
        </div>
      )}
    </AppShell>
  );
}
