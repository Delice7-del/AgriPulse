import { apiRequest } from "@/lib/api/client";

export type ApiCrop = {
  id: string;
  name: string;
  nameRw: string | null;
  unit: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiMarket = {
  id: string;
  name: string;
  region: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiPrice = {
  id: string;
  cropId: string;
  marketId: string;
  price: string | number;
  recordedAt: string;
  createdAt: string;
  crop?: ApiCrop;
  market?: ApiMarket;
};

export type PaginatedPrices = {
  items: ApiPrice[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export function listCrops(isActive = true) {
  return apiRequest<ApiCrop[]>("/crops", {
    query: { isActive },
  });
}

export function createCrop(input: {
  name: string;
  nameRw?: string;
  unit?: string;
}) {
  return apiRequest<ApiCrop>("/crops", { method: "POST", body: input });
}

export function updateCrop(
  id: string,
  input: { name?: string; nameRw?: string; unit?: string; isActive?: boolean },
) {
  return apiRequest<ApiCrop>(`/crops/${id}`, { method: "PATCH", body: input });
}

export function deleteCrop(id: string) {
  return apiRequest<ApiCrop>(`/crops/${id}`, { method: "DELETE" });
}

export function listMarkets(isActive = true) {
  return apiRequest<ApiMarket[]>("/markets", {
    query: { isActive },
  });
}

export function createMarket(input: { name: string; region?: string }) {
  return apiRequest<ApiMarket>("/markets", { method: "POST", body: input });
}

export function updateMarket(
  id: string,
  input: { name?: string; region?: string; isActive?: boolean },
) {
  return apiRequest<ApiMarket>(`/markets/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export function deleteMarket(id: string) {
  return apiRequest<ApiMarket>(`/markets/${id}`, { method: "DELETE" });
}

export function listPrices(page = 1, limit = 20) {
  return apiRequest<PaginatedPrices>("/prices", {
    query: { page, limit },
  });
}

export function createPrice(input: {
  cropId: string;
  marketId: string;
  price: number;
}) {
  return apiRequest<{ message: string; data: ApiPrice }>("/prices", {
    method: "POST",
    body: input,
  });
}

export function dashboardOverview() {
  return apiRequest<{
    stats: {
      activeCrops: number;
      activeMarkets: number;
      todaySessions: number;
      topQueriedCrop: { name: string; queryCount: number } | null;
    };
    livePrices: Array<{
      id: string;
      crop: string;
      market: string;
      price: number;
      recordedAt: string;
      unit: string;
    }>;
    predictionAccuracy: {
      gradedCount: number;
      successfulCount: number;
      accuracyPercent: number | null;
    };
  }>("/dashboard/overview");
}

export function analyticsSessionsPerDay(days = 7) {
  return apiRequest<Array<{ date: string; count: number }>>(
    "/analytics/sessions-per-day",
    { query: { days } },
  );
}

export function analyticsTopCrops(days = 30) {
  return apiRequest<
    Array<{
      cropId: string;
      name: string;
      nameRw: string | null;
      queryCount: number;
    }>
  >("/analytics/top-crops", { query: { days } });
}

export function analyticsPredictionAccuracy() {
  return apiRequest<{
    gradedCount: number;
    successfulCount: number;
    accuracyPercent: number | null;
  }>("/analytics/prediction-accuracy");
}
