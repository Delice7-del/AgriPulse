import type { Metadata } from "next";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingNav } from "@/components/landing/LandingNav";
import { OfficersSection } from "@/components/landing/OfficersSection";
import { ValueProps } from "@/components/landing/ValueProps";

export const metadata: Metadata = {
  title: "AgriPulse — Fair prices & AI advice on any phone",
  description:
    "Real-time crop market prices and Sell now / Wait advice for Rwandan farmers via USSD (*384*1#). Officers manage prices in the admin dashboard.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-ap-ink">
      <LandingNav />
      <main>
        <LandingHero />
        <HowItWorks />
        <ValueProps />
        <OfficersSection />
      </main>
      <LandingFooter />
    </div>
  );
}
