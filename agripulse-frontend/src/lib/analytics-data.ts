export const ussdSessionSeries = [
  { day: "Mon", value: 42 },
  { day: "Tue", value: 55 },
  { day: "Wed", value: 48 },
  { day: "Thu", value: 68 },
  { day: "Fri", value: 74 },
  { day: "Sat", value: 86 },
  { day: "Sun", value: 98 },
];

export const ussdSessionSeriesMonthly = [
  { day: "Feb", value: 820 },
  { day: "Mar", value: 940 },
  { day: "Apr", value: 1010 },
  { day: "May", value: 1180 },
  { day: "Jun", value: 1320 },
  { day: "Jul", value: 1460 },
];

export const ussdSessionSeriesYearly = [
  { day: "2022", value: 9200 },
  { day: "2023", value: 11400 },
  { day: "2024", value: 13800 },
  { day: "2025", value: 16200 },
  { day: "2026", value: 9800 },
];

export const topQueriedCrops = [
  { name: "Maize", valueLabel: "12.4k", percent: 92, tone: "green" as const },
  { name: "Beans", valueLabel: "9.8k", percent: 72, tone: "orange" as const },
  { name: "Potatoes", valueLabel: "7.2k", percent: 54, tone: "green" as const },
  { name: "Coffee", valueLabel: "4.1k", percent: 32, tone: "orange" as const },
];

export const regionalHotspots = [
  { province: "Northern Province", level: "High" as const },
  { province: "Eastern Province", level: "Medium" as const },
];

export const systemHealthLogs = [
  {
    id: "1",
    source: "Gateway #104",
    message: "High volume USSD traffic from Musanze detected.",
    status: "optimal" as const,
    time: "2 mins ago",
    icon: "cloud" as const,
  },
  {
    id: "2",
    source: "Predictor Node",
    message: "Potato price variance exceeded 15% in Kayonza.",
    status: "wait" as const,
    time: "14 mins ago",
    icon: "alert" as const,
  },
  {
    id: "3",
    source: "Price Oracle",
    message: "Market data sync completed for 12 local sectors.",
    status: "sell_now" as const,
    time: "1 hour ago",
    icon: "network" as const,
  },
];
