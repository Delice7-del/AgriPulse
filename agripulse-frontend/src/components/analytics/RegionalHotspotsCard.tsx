import { regionalHotspots } from "@/lib/analytics-data";

export function RegionalHotspotsCard() {
  return (
    <section className="rounded-2xl border border-ap-line bg-white p-5 shadow-[0_1px_2px_rgba(26,31,28,0.04)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Regional Hotspots
          </h2>
          <p className="text-sm text-ap-muted">
            Live query density by province.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-red-600">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          Live
        </span>
      </div>

      <div className="relative mb-4 overflow-hidden rounded-xl bg-[#eef2ea]">
        <svg
          viewBox="0 0 360 180"
          className="h-40 w-full"
          role="img"
          aria-label="Rwanda query density map"
        >
          <rect width="360" height="180" fill="#e8eee4" />
          <path
            d="M48 72 C90 40, 150 28, 210 38 C270 48, 320 70, 330 110 C300 150, 230 168, 160 160 C100 154, 58 120, 48 72 Z"
            fill="#d7e2d2"
            stroke="#b7c8b0"
            strokeWidth="2"
          />
          <circle cx="150" cy="70" r="18" fill="#f08a24" opacity="0.35" />
          <circle cx="150" cy="70" r="8" fill="#f08a24" opacity="0.7" />
          <circle cx="230" cy="100" r="22" fill="#ef4444" opacity="0.25" />
          <circle cx="230" cy="100" r="9" fill="#ef4444" opacity="0.55" />
          <circle cx="190" cy="120" r="14" fill="#f08a24" opacity="0.3" />
        </svg>
      </div>

      <ul className="space-y-2">
        {regionalHotspots.map((spot) => (
          <li
            key={spot.province}
            className="flex items-center justify-between rounded-xl border border-ap-line bg-ap-bg/50 px-3.5 py-2.5"
          >
            <span className="text-sm font-semibold text-ap-ink">
              {spot.province}
            </span>
            {spot.level === "High" ? (
              <span className="rounded-full bg-ap-green px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                High
              </span>
            ) : (
              <span className="rounded-full bg-ap-orange-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#b86412]">
                Medium
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
