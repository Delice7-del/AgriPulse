"use client";

import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DataQualityCard } from "@/components/management/DataQualityCard";
import { ManagementPanel } from "@/components/management/ManagementPanel";
import { ProductivityOutlookCard } from "@/components/management/ProductivityOutlookCard";

export default function ManagementPage() {
  return (
    <AppShell>
      <Suspense fallback={<p className="text-ap-muted">Loading management…</p>}>
        <ManagementPanel />
      </Suspense>

      <div className="grid gap-5 lg:grid-cols-2">
        <ProductivityOutlookCard />
        <DataQualityCard />
      </div>
    </AppShell>
  );
}
