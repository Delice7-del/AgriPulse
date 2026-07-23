import Link from "next/link";
import { AgriPulseLogo } from "@/components/brand/AgriPulseLogo";

export function LandingFooter() {
  return (
    <footer
      id="contact"
      className="scroll-mt-20 border-t border-ap-line bg-[#f7f5f0] text-ap-ink"
    >
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr]">
        <div>
          <AgriPulseLogo href="/" wordmark="AgriPulse" size="sm" />
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ap-muted">
            Real-time crop market prices and AI selling advice for Rwandan
            smallholders — delivered by USSD, stewarded by agricultural
            officers.
          </p>
          <p className="mt-4 text-sm text-ap-muted">
            Contact:{" "}
            <a
              href="mailto:support@agripulse.rw"
              className="font-semibold text-ap-green hover:text-ap-green-deep"
            >
              support@agripulse.rw
            </a>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:justify-items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ap-muted">
              Explore
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#about" className="text-ap-ink/80 hover:text-ap-green">
                  About
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-ap-ink/80 hover:text-ap-green"
                >
                  How it Works
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-ap-ink/80 hover:text-ap-green"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ap-muted">
              Officers
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/login" className="text-ap-ink/80 hover:text-ap-green">
                  Admin Login
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-ap-ink/80 hover:text-ap-green"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-ap-ink/80 hover:text-ap-green"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-ap-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-ap-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} AgriPulse · Rwanda</p>
          <p>Built for the JA Competition · Farmers first, officers ready</p>
        </div>
      </div>
    </footer>
  );
}
