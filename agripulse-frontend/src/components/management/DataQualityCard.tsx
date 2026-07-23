import Link from "next/link";
import { BarChart3 } from "lucide-react";

export function DataQualityCard() {
  return (
    <aside className="flex min-h-[240px] flex-col justify-between rounded-2xl bg-ap-green-deep p-6 text-white shadow-[0_8px_24px_rgba(21,77,50,0.18)]">
      <div>
        <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
          <BarChart3 className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <h2 className="text-xl font-semibold tracking-tight">Data Quality</h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85">
          98.5% of crop entries verified through satellite ground-truth imaging
          this week.
        </p>
      </div>

      <Link
        href="/analytics"
        className="mt-6 inline-flex w-fit items-center justify-center rounded-full bg-ap-orange px-5 py-2.5 text-sm font-semibold text-ap-ink shadow-sm transition hover:brightness-95"
      >
        View Report
      </Link>
    </aside>
  );
}
