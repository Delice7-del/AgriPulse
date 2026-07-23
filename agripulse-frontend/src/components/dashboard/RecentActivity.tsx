import Link from "next/link";
import { recentActivity } from "@/lib/dashboard-data";

export function RecentActivity() {
  return (
    <section className="rounded-2xl border border-ap-line/60 bg-[#f7f4ee] p-5 shadow-[0_1px_2px_rgba(26,31,28,0.03)]">
      <h2 className="text-lg font-semibold tracking-tight">
        Recent Officer Activity
      </h2>

      <ul className="mt-5 space-y-5">
        {recentActivity.map((item) => (
          <li key={item.id} className="flex gap-3">
            <span
              className={[
                "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                item.tone === "green" ? "bg-ap-green" : "bg-ap-orange",
              ].join(" ")}
            />
            <div>
              <p className="font-semibold text-ap-ink">{item.title}</p>
              <p className="mt-1 text-sm text-ap-muted">{item.meta}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-center">
        <Link
          href="/analytics#system-health"
          className="text-sm font-semibold text-ap-green hover:text-ap-green-deep"
        >
          View All Logs
        </Link>
      </div>
    </section>
  );
}
