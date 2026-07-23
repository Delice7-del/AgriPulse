import { performanceBars } from "@/lib/dashboard-data";

const toneClass = {
  green: "bg-ap-green",
  "green-soft": "bg-emerald-500",
  "green-deep": "bg-ap-green-deep",
  "green-light": "bg-emerald-300",
  "green-mid": "bg-emerald-600",
  orange: "bg-ap-orange",
};

export function SystemPerformance() {
  return (
    <section className="rounded-2xl border border-ap-line/60 bg-[#f7f4ee] p-5 shadow-[0_1px_2px_rgba(26,31,28,0.03)]">
      <h2 className="text-lg font-semibold tracking-tight">System Performance</h2>

      <div className="mt-8 flex h-44 items-end justify-between gap-3 px-1 sm:gap-4">
        {performanceBars.map((bar) => (
          <div key={bar.day} className="flex flex-1 flex-col items-center gap-3">
            <div className="flex h-36 w-full items-end justify-center">
              <div
                className={`w-full max-w-[42px] rounded-t-lg ${toneClass[bar.tone]} transition-all duration-500`}
                style={{ height: `${bar.value}%` }}
                title={`${bar.day}: ${bar.value}`}
              />
            </div>
            <span className="text-xs font-medium text-ap-muted">{bar.day}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
