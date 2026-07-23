"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { CropForm } from "@/components/management/CropForm";
import { useAppData } from "@/lib/app-data";

export default function EditCropPage() {
  const params = useParams<{ id: string }>();
  const { ready, getCrop } = useAppData();
  const crop = getCrop(params.id);

  return (
    <AppShell>
      {!ready ? (
        <p className="text-ap-muted">Loading crop…</p>
      ) : crop ? (
        <CropForm mode="edit" cropId={crop.id} />
      ) : (
        <div className="rounded-2xl border border-ap-line bg-white p-8 text-center">
          <p className="font-semibold">Crop not found.</p>
          <Link
            href="/management?tab=crops"
            className="mt-4 inline-flex text-sm font-semibold text-ap-green"
          >
            Back to Management
          </Link>
        </div>
      )}
    </AppShell>
  );
}
