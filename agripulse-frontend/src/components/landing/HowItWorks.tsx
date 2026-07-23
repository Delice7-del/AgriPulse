import { Coins, Phone, Tractor } from "lucide-react";

const steps = [
  {
    icon: Phone,
    title: "1. Dial the code",
    body: "Simple USSD access via *384*1#. No data plan or smartphone required for your device.",
  },
  {
    icon: Tractor,
    title: "2. Select your crop",
    body: "Choose from local Rwandan crops including Maize, Beans, Irish Potato, Cassava, and more.",
  },
  {
    icon: Coins,
    title: "3. Get price & advice",
    body: "Receive instant market pricing and AI-driven recommendations on whether to sell now or wait.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ap-ink sm:text-4xl">
            How it Works
          </h2>
          <span className="mx-auto mt-3 block h-1 w-12 rounded-full bg-ap-orange" />
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article
                key={step.title}
                className="rounded-2xl border border-ap-line bg-white p-6 shadow-[0_1px_2px_rgba(26,31,28,0.04)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ap-green text-white">
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-ap-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ap-muted">
                  {step.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
