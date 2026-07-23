export function ProductivityOutlookCard() {
  return (
    <aside className="relative min-h-[240px] overflow-hidden rounded-2xl shadow-[0_1px_2px_rgba(26,31,28,0.04)]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1400&q=80')",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-white">Productivity Outlook</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-white/90">
          Harvest projections are up 12% for the Kinigi Irish Potato varieties
          this season.
        </p>
      </div>
    </aside>
  );
}
