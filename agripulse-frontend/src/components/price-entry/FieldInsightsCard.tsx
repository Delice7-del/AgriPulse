export function FieldInsightsCard() {
  return (
    <aside className="relative min-h-[220px] overflow-hidden rounded-2xl shadow-[0_1px_2px_rgba(26,31,28,0.04)]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80')",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
      <p className="absolute inset-x-0 bottom-0 p-5 text-[15px] font-medium italic leading-snug text-white">
        Real-time market insights from the field.
      </p>
    </aside>
  );
}
