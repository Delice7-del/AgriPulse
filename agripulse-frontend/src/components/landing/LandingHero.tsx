import Link from "next/link";
import { Phone } from "lucide-react";

function UssdPhoneMock() {
  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      <div className="rounded-[2rem] border border-ap-line bg-ap-sidebar p-3 shadow-[0_8px_24px_rgba(21,77,50,0.12)]">
        <div className="overflow-hidden rounded-[1.4rem] border border-ap-line bg-ap-green-deep text-white">
          <div className="flex items-center justify-between bg-black/20 px-4 py-2 text-[11px] font-medium text-white/80">
            <span>MTN · RW</span>
            <span>USSD</span>
          </div>
          <div className="min-h-[220px] space-y-3 px-4 py-5 font-mono text-[13px] leading-relaxed">
            <p className="font-semibold tracking-wide">AgriPulse</p>
            <p>1. Check Prices</p>
            <p>2. AI Advice</p>
            <p>3. Language</p>
            <p className="pt-2 text-white/70">Enter option:</p>
            <div className="inline-flex rounded-lg bg-white/10 px-3 py-1.5 text-ap-orange-soft">
              _
            </div>
          </div>
          <div className="border-t border-white/10 px-4 py-3 text-center text-xs text-white/70">
            Dial <span className="font-semibold text-white">*384*1#</span>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-ap-orange text-white shadow-sm">
        <Phone className="h-5 w-5" strokeWidth={2.2} />
      </div>
    </div>
  );
}

export function LandingHero() {
  return (
    <section className="relative overflow-hidden border-b border-ap-line/70 bg-ap-bg">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 10% 0%, rgba(231,243,236,0.95), transparent 55%), radial-gradient(ellipse 60% 50% at 90% 20%, rgba(255,241,227,0.7), transparent 50%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ap-green">
            Rwanda agri-tech · USSD
          </p>
          <h1 className="mt-3 max-w-xl text-4xl font-bold tracking-tight text-ap-ink sm:text-5xl">
            Fair crop prices and AI selling advice — on any phone
          </h1>
          <p className="mt-4 max-w-lg text-lg text-ap-muted">
            AgriPulse brings live market prices and clear Sell now / Wait
            guidance to smallholder farmers via USSD. No smartphone. No data
            plan. Works in Kinyarwanda and English.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-ap-green px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-ap-green-deep"
            >
              Dial *384*1#
            </a>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-ap-line bg-white px-5 py-3.5 text-sm font-semibold text-ap-ink shadow-sm transition hover:bg-ap-sidebar"
            >
              For Agricultural Officers → Admin Login
            </Link>
          </div>
        </div>

        <UssdPhoneMock />
      </div>
    </section>
  );
}
