import Link from "next/link";
import { AlertTriangle, Cloud, Share2 } from "lucide-react";
import { systemHealthLogs } from "@/lib/analytics-data";

export function SystemHealthCard() {
  return (
    <section
      id="system-health"
      className="overflow-hidden rounded-2xl border border-ap-line bg-white shadow-[0_1px_2px_rgba(26,31,28,0.04)]"
    >
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-lg font-semibold tracking-tight">
          System Health &amp; Anomalies
        </h2>
        <Link
          href="/analytics#system-health"
          className="text-sm font-semibold text-ap-green hover:text-ap-green-deep"
        >
          View All Logs
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-y border-ap-line text-xs font-semibold uppercase tracking-wide text-ap-muted">
              <th className="px-5 py-3">Event Source</th>
              <th className="px-5 py-3">Message</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {systemHealthLogs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-ap-line/70 last:border-b-0"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={[
                        "flex h-9 w-9 items-center justify-center rounded-lg",
                        log.icon === "alert"
                          ? "bg-ap-orange-soft text-ap-orange"
                          : "bg-ap-green-soft text-ap-green",
                      ].join(" ")}
                    >
                      {log.icon === "cloud" ? (
                        <Cloud className="h-4 w-4" />
                      ) : log.icon === "alert" ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <Share2 className="h-4 w-4" />
                      )}
                    </span>
                    <span className="font-semibold text-ap-ink">
                      {log.source}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-ap-muted">
                  {log.message}
                </td>
                <td className="px-5 py-4">
                  {log.status === "optimal" ? (
                    <span className="inline-flex rounded-full bg-ap-green-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-ap-green-deep">
                      Optimal
                    </span>
                  ) : log.status === "wait" ? (
                    <span className="inline-flex rounded-full bg-ap-orange-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#b86412]">
                      Wait
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-ap-green px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                      Sell Now
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-sm text-ap-muted">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
