import { AppShell } from "@/components/layout/AppShell";
import { CropForm } from "@/components/management/CropForm";

export default function NewCropPage() {
  return (
    <AppShell>
      <CropForm mode="create" />
    </AppShell>
  );
}
