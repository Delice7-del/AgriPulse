import {
  ArrowUpRight,
  Leaf,
  RadioTower,
  Store,
  TrendingUp,
} from "lucide-react";
import { stats } from "@/lib/dashboard-data";

const iconMap = {
  leaf: Leaf,
  market: Store,
  signal: RadioTower,
  trend: TrendingUp,
};

const iconToneClass = {
  green: "bg-ap-green-soft text-ap-green",
  orange: "bg-ap-orange-soft text-ap-orange",
  "green-deep": "bg-ap-green text-white",
  muted: "bg-stone-200 text-stone-600",
};

const metaToneClass = {
  green: "text-ap-green",
  orange: "text-ap-orange",
  muted: "text-ap-muted",
};

export function StatCards() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon];
        return (
          <article
            key={stat.label}
            className="rounded-2xl border border-ap-line/70 bg-ap-surface p-5 shadow-[0_1px_2px_rgba(26,31,28,0.04)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ap-muted">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-ap-ink">
                  {stat.value}
                </p>
                <p
                  className={`mt-2 flex items-center gap-1 text-sm font-medium ${metaToneClass[stat.metaTone]}`}
                >
                  {stat.metaTone === "green" ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : null}
                  {stat.meta}
                </p>
              </div>
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconToneClass[stat.iconTone]}`}
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
