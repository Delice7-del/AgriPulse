"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { MostQueriedCropsCard } from "@/components/analytics/MostQueriedCropsCard";
import { PredictionAccuracyCard } from "@/components/analytics/PredictionAccuracyCard";
import { RegionalHotspotsCard } from "@/components/analytics/RegionalHotspotsCard";
import { SystemHealthCard } from "@/components/analytics/SystemHealthCard";
import {
  AnalyticsHeader,
  UssdSessionsChart,
  type AnalyticsRange,
} from "@/components/analytics/UssdSessionsChart";

export default function AnalyticsPage() {
  const [range, setRange] = useState<AnalyticsRange>("weekly");

  return (
    <AppShell>
      <AnalyticsHeader range={range} onRangeChange={setRange} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.75fr)]">
        <UssdSessionsChart range={range} />
        <PredictionAccuracyCard />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <MostQueriedCropsCard />
        <RegionalHotspotsCard />
      </div>

      <SystemHealthCard />
    </AppShell>
  );
}
