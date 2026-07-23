import { apiRequest } from "@/lib/api/client";

export type LandingStats = {
  trend: {
    crop: string;
    changePercent: number;
    advice: "SELL NOW" | "WAIT";
  };
  snapshot: {
    districtLabel: string;
    growthPercent: number;
    activeCrops: number;
    activeMarkets: number;
    todaySessions: number;
    weeklySessions: number;
    chartValues: number[];
  };
};

export const fallbackLandingStats: LandingStats = {
  trend: {
    crop: "Maize",
    changePercent: 12,
    advice: "SELL NOW",
  },
  snapshot: {
    districtLabel: "Nyanza District",
    growthPercent: 4.2,
    activeCrops: 12,
    activeMarkets: 24,
    todaySessions: 1240,
    weeklySessions: 4812,
    chartValues: [18, 28, 22, 40, 30],
  },
};

export function fetchLandingStats() {
  return apiRequest<LandingStats>("/public/landing-stats", { auth: false });
}
