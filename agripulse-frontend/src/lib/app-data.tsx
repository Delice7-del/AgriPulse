"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createCrop,
  createMarket,
  createPrice,
  deleteCrop,
  deleteMarket,
  listCrops,
  listMarkets,
  listPrices,
  updateCrop,
  updateMarket,
  type ApiCrop,
  type ApiMarket,
  type ApiPrice,
} from "@/lib/api/admin";
import { hasAdminSession } from "@/lib/admin-session";
import {
  managedCrops as seedCrops,
  managedMarkets as seedMarkets,
  type CropIndex,
  type ManagedCrop,
  type ManagedMarket,
} from "@/lib/management-data";
import {
  recentEntries as seedEntries,
  type RecentEntry,
} from "@/lib/price-entry-data";

type CropInput = {
  name: string;
  variety: string;
  index: CropIndex;
  iconTone?: ManagedCrop["iconTone"];
};

type MarketInput = {
  name: string;
  region: string;
  status: ManagedMarket["status"];
};

type PriceInput = {
  cropId: string;
  marketId: string;
  crop: string;
  market: string;
  price: number;
};

type AppDataContextValue = {
  ready: boolean;
  usingApi: boolean;
  error: string | null;
  crops: ManagedCrop[];
  markets: ManagedMarket[];
  priceEntries: RecentEntry[];
  refresh: () => Promise<void>;
  addCrop: (input: CropInput) => Promise<ManagedCrop>;
  updateCrop: (id: string, input: CropInput) => Promise<void>;
  deleteCrop: (id: string) => Promise<void>;
  getCrop: (id: string) => ManagedCrop | undefined;
  addMarket: (input: MarketInput) => Promise<ManagedMarket>;
  updateMarket: (id: string, input: MarketInput) => Promise<void>;
  deleteMarket: (id: string) => Promise<void>;
  getMarket: (id: string) => ManagedMarket | undefined;
  addPriceEntry: (input: PriceInput) => Promise<void>;
};

const STORAGE_KEY = "agripulse-admin-data-v1";

const AppDataContext = createContext<AppDataContextValue | null>(null);

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function mapCrop(crop: ApiCrop): ManagedCrop {
  return {
    id: crop.id,
    name: crop.name,
    variety: crop.nameRw?.trim() || crop.unit || "Standard",
    index: crop.isActive ? "stable" : "new_entry",
    iconTone: "green",
  };
}

function mapMarket(market: ApiMarket): ManagedMarket {
  return {
    id: market.id,
    name: market.name,
    region: market.region?.trim() || "Rwanda",
    status: market.isActive ? "active" : "new",
  };
}

function mapPrice(row: ApiPrice): RecentEntry {
  const cropName = row.crop?.name ?? "Crop";
  const icon = cropName.toLowerCase().includes("bean")
    ? ("beans" as const)
    : cropName.toLowerCase().includes("cassava")
      ? ("cassava" as const)
      : ("maize" as const);

  const recorded = new Date(row.recordedAt);
  const mins = Math.max(
    0,
    Math.round((Date.now() - recorded.getTime()) / 60_000),
  );
  const time =
    mins < 1
      ? "Just now"
      : mins < 60
        ? `${mins} mins ago`
        : `${Math.round(mins / 60)} hour${Math.round(mins / 60) === 1 ? "" : "s"} ago`;

  return {
    id: row.id,
    crop: cropName,
    market: row.market?.name ?? "Market",
    price: Number(row.price),
    status: "verified",
    time,
    icon,
  };
}

function loadLocalState() {
  if (typeof window === "undefined") {
    return {
      crops: seedCrops,
      markets: seedMarkets,
      priceEntries: seedEntries,
    };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        crops: seedCrops,
        markets: seedMarkets,
        priceEntries: seedEntries,
      };
    }
    const parsed = JSON.parse(raw) as {
      crops?: ManagedCrop[];
      markets?: ManagedMarket[];
      priceEntries?: RecentEntry[];
    };
    return {
      crops: parsed.crops?.length ? parsed.crops : seedCrops,
      markets: parsed.markets?.length ? parsed.markets : seedMarkets,
      priceEntries: parsed.priceEntries?.length
        ? parsed.priceEntries
        : seedEntries,
    };
  } catch {
    return {
      crops: seedCrops,
      markets: seedMarkets,
      priceEntries: seedEntries,
    };
  }
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [usingApi, setUsingApi] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [crops, setCrops] = useState<ManagedCrop[]>(seedCrops);
  const [markets, setMarkets] = useState<ManagedMarket[]>(seedMarkets);
  const [priceEntries, setPriceEntries] = useState<RecentEntry[]>(seedEntries);

  const refresh = useCallback(async () => {
    setError(null);

    if (!hasAdminSession()) {
      const local = loadLocalState();
      setCrops(local.crops);
      setMarkets(local.markets);
      setPriceEntries(local.priceEntries);
      setUsingApi(false);
      setReady(true);
      return;
    }

    try {
      const [apiCrops, apiMarkets, prices] = await Promise.all([
        listCrops(true),
        listMarkets(true),
        listPrices(1, 20),
      ]);
      setCrops(apiCrops.map(mapCrop));
      setMarkets(apiMarkets.map(mapMarket));
      setPriceEntries(prices.items.map(mapPrice));
      setUsingApi(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load API data";
      setError(message);
      const local = loadLocalState();
      setCrops(local.crops);
      setMarkets(local.markets);
      setPriceEntries(local.priceEntries);
      setUsingApi(false);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!ready || usingApi) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ crops, markets, priceEntries }),
    );
  }, [crops, markets, priceEntries, ready, usingApi]);

  const addCropFn = useCallback(
    async (input: CropInput) => {
      if (usingApi) {
        const created = await createCrop({
          name: input.name.trim(),
          nameRw: input.variety.trim(),
          unit: "kg",
        });
        const mapped = mapCrop(created);
        setCrops((prev) => [mapped, ...prev]);
        return mapped;
      }

      const crop: ManagedCrop = {
        id: uid(),
        name: input.name.trim(),
        variety: input.variety.trim(),
        index: input.index,
        iconTone: input.iconTone ?? "green",
      };
      setCrops((prev) => [crop, ...prev]);
      return crop;
    },
    [usingApi],
  );

  const updateCropFn = useCallback(
    async (id: string, input: CropInput) => {
      if (usingApi) {
        const updated = await updateCrop(id, {
          name: input.name.trim(),
          nameRw: input.variety.trim(),
        });
        const mapped = mapCrop(updated);
        setCrops((prev) => prev.map((c) => (c.id === id ? mapped : c)));
        return;
      }

      setCrops((prev) =>
        prev.map((crop) =>
          crop.id === id
            ? {
                ...crop,
                name: input.name.trim(),
                variety: input.variety.trim(),
                index: input.index,
                iconTone: input.iconTone ?? crop.iconTone,
              }
            : crop,
        ),
      );
    },
    [usingApi],
  );

  const deleteCropFn = useCallback(
    async (id: string) => {
      if (usingApi) {
        await deleteCrop(id);
      }
      setCrops((prev) => prev.filter((crop) => crop.id !== id));
    },
    [usingApi],
  );

  const getCrop = useCallback(
    (id: string) => crops.find((crop) => crop.id === id),
    [crops],
  );

  const addMarketFn = useCallback(
    async (input: MarketInput) => {
      if (usingApi) {
        const created = await createMarket({
          name: input.name.trim(),
          region: input.region.trim(),
        });
        const mapped = mapMarket(created);
        setMarkets((prev) => [mapped, ...prev]);
        return mapped;
      }

      const market: ManagedMarket = {
        id: uid(),
        name: input.name.trim(),
        region: input.region.trim(),
        status: input.status,
      };
      setMarkets((prev) => [market, ...prev]);
      return market;
    },
    [usingApi],
  );

  const updateMarketFn = useCallback(
    async (id: string, input: MarketInput) => {
      if (usingApi) {
        const updated = await updateMarket(id, {
          name: input.name.trim(),
          region: input.region.trim(),
          isActive: input.status !== "new",
        });
        const mapped = mapMarket(updated);
        setMarkets((prev) => prev.map((m) => (m.id === id ? mapped : m)));
        return;
      }

      setMarkets((prev) =>
        prev.map((market) =>
          market.id === id
            ? {
                ...market,
                name: input.name.trim(),
                region: input.region.trim(),
                status: input.status,
              }
            : market,
        ),
      );
    },
    [usingApi],
  );

  const deleteMarketFn = useCallback(
    async (id: string) => {
      if (usingApi) {
        await deleteMarket(id);
      }
      setMarkets((prev) => prev.filter((market) => market.id !== id));
    },
    [usingApi],
  );

  const getMarket = useCallback(
    (id: string) => markets.find((market) => market.id === id),
    [markets],
  );

  const addPriceEntry = useCallback(
    async (input: PriceInput) => {
      if (usingApi) {
        await createPrice({
          cropId: input.cropId,
          marketId: input.marketId,
          price: input.price,
        });
        await refresh();
        return;
      }

      const icon = input.crop.toLowerCase().includes("bean")
        ? ("beans" as const)
        : input.crop.toLowerCase().includes("cassava")
          ? ("cassava" as const)
          : ("maize" as const);

      const entry: RecentEntry = {
        id: uid(),
        crop: input.crop,
        market: input.market,
        price: input.price,
        status: "pending",
        time: "Just now",
        icon,
      };
      setPriceEntries((prev) => [entry, ...prev]);
    },
    [refresh, usingApi],
  );

  const value = useMemo(
    () => ({
      ready,
      usingApi,
      error,
      crops,
      markets,
      priceEntries,
      refresh,
      addCrop: addCropFn,
      updateCrop: updateCropFn,
      deleteCrop: deleteCropFn,
      getCrop,
      addMarket: addMarketFn,
      updateMarket: updateMarketFn,
      deleteMarket: deleteMarketFn,
      getMarket,
      addPriceEntry,
    }),
    [
      ready,
      usingApi,
      error,
      crops,
      markets,
      priceEntries,
      refresh,
      addCropFn,
      updateCropFn,
      deleteCropFn,
      getCrop,
      addMarketFn,
      updateMarketFn,
      deleteMarketFn,
      getMarket,
      addPriceEntry,
    ],
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return ctx;
}
