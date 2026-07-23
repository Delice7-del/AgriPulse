import { AppShell } from "@/components/layout/AppShell";
import { MarketForm } from "@/components/management/MarketForm";

export default function NewMarketPage() {
  return (
    <AppShell>
      <MarketForm mode="create" />
    </AppShell>
  );
}
