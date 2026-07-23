import Link from "next/link";

export function DashboardFooter() {
  return (
    <footer className="mt-8 border-t border-ap-line pt-4">
      <div className="flex flex-col gap-3 text-sm text-ap-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <span>v2.4.0 Stabilized</span>
          <span className="hidden sm:inline">&amp; Optimistic Data.</span>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          <Link href="/support" className="hover:text-ap-ink">
            Support
          </Link>
          <Link href="/privacy" className="hover:text-ap-ink">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-ap-ink">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
