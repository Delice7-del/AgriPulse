import { AppShell } from "@/components/layout/AppShell";
import Link from "next/link";

export default function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <AppShell>
      <div className="flex flex-1 items-center justify-center py-10">
        <div className="max-w-md rounded-2xl border border-ap-line bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-ap-muted">{description}</p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-xl bg-ap-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-ap-green-deep"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
