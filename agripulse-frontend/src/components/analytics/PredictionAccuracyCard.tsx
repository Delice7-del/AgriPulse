import { ArrowUpRight, ShieldCheck } from "lucide-react";

export function PredictionAccuracyCard() {
  return (
    <section className="flex h-full flex-col justify-between rounded-2xl bg-ap-green-deep p-6 text-white shadow-[0_8px_24px_rgba(21,77,50,0.18)]">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
          <ShieldCheck className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-100">
          Active Model V4.2
        </span>
      </div>

      <div className="mt-8">
        <p className="text-sm font-medium text-white/80">Prediction Accuracy</p>
        <p className="mt-1 text-5xl font-bold tracking-tight">94%</p>
      </div>

      <p className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-200">
        <ArrowUpRight className="h-4 w-4" />
        +2.4% from last harvest cycle
      </p>
    </section>
  );
}
