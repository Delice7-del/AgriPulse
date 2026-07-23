import { Banknote, Languages, Lightbulb, Smartphone } from "lucide-react";

export function ValueProps() {
  return (
    <section id="about" className="scroll-mt-20 bg-[#f3f1ec] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-2 lg:grid-rows-2 lg:gap-5">
          <article className="relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-2xl bg-ap-green-deep p-7 text-white shadow-[0_8px_24px_rgba(21,77,50,0.18)] sm:p-8 lg:row-span-2 lg:min-h-[420px]">
            <Banknote
              className="pointer-events-none absolute -right-4 -top-2 h-40 w-40 text-white/10"
              strokeWidth={1.2}
              aria-hidden
            />
            <h3 className="relative max-w-sm text-3xl font-bold tracking-tight sm:text-4xl">
              Fair Prices for Farmers
            </h3>
            <p className="relative mt-3 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
              Eliminate the middleman gap. Access direct market valuations and
              negotiate with confidence using verified daily data.
            </p>
          </article>

          <article className="rounded-2xl bg-[#e9e7e2] p-6 sm:p-7">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ap-orange text-white">
              <Languages className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <h3 className="mt-5 text-xl font-bold tracking-tight text-ap-ink">
              Kinyarwanda Support
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ap-muted">
              Designed for the local context. Fully accessible in Kinyarwanda so
              every farmer can benefit regardless of language barrier.
            </p>
          </article>

          <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
            <article className="rounded-2xl bg-ap-orange p-6 text-ap-ink shadow-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ap-ink/10 text-ap-ink">
                <Lightbulb className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <h3 className="mt-4 text-lg font-bold tracking-tight">
                AI-Powered Timing
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ap-ink/80">
                Predictive trends to maximize profit.
              </p>
            </article>

            <article className="rounded-2xl border border-ap-line bg-white p-6 shadow-[0_1px_2px_rgba(26,31,28,0.04)]">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ap-green-soft text-ap-green">
                <Smartphone className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <h3 className="mt-4 text-lg font-bold tracking-tight text-ap-ink">
                Works on Any Phone
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ap-muted">
                From basic buttons to the latest smartphone.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
