import { AppShell } from "@/components/layout/AppShell";
import { DataIntegrityCard } from "@/components/price-entry/DataIntegrityCard";
import { FieldInsightsCard } from "@/components/price-entry/FieldInsightsCard";
import { PriceSubmissionForm } from "@/components/price-entry/PriceSubmissionForm";
import { RecentEntriesTable } from "@/components/price-entry/RecentEntriesTable";

export default function PriceEntryPage() {
  return (
    <AppShell>
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-ap-ink sm:text-4xl">
          Market Price Entry
        </h1>
        <p className="mt-2 max-w-3xl text-ap-muted">
          Contribute to the real-time agricultural heartbeat of Rwanda. Enter
          accurate market rates to support our community.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
        <PriceSubmissionForm />

        <div className="flex flex-col gap-5">
          <DataIntegrityCard />
          <FieldInsightsCard />
        </div>
      </div>

      <RecentEntriesTable />
    </AppShell>
  );
}
