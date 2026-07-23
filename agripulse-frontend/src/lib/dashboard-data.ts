export type NavItem = {
  label: string;
  href: string;
  id: "dashboard" | "price-entry" | "management" | "analytics";
};

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard" },
  { id: "price-entry", label: "Price Entry", href: "/price-entry" },
  { id: "management", label: "Management", href: "/management" },
  { id: "analytics", label: "Analytics", href: "/analytics" },
];

export const stats = [
  {
    label: "Active Crops",
    value: "12",
    meta: "+2 from last week",
    metaTone: "green" as const,
    icon: "leaf" as const,
    iconTone: "green" as const,
  },
  {
    label: "Active Markets",
    value: "24",
    meta: "Across all districts",
    metaTone: "orange" as const,
    icon: "market" as const,
    iconTone: "orange" as const,
  },
  {
    label: "Today's USSD Sessions",
    value: "1,240",
    meta: "12% higher than avg.",
    metaTone: "green" as const,
    icon: "signal" as const,
    iconTone: "green-deep" as const,
  },
  {
    label: "Top Queried Crop",
    value: "Maize",
    meta: "Kigali Central Market",
    metaTone: "muted" as const,
    icon: "trend" as const,
    iconTone: "muted" as const,
  },
];

export type PriceRow = {
  id: string;
  crop: string;
  market: string;
  price: number;
  trend: "up" | "down";
  advice: "sell_now" | "wait";
  icon: "maize" | "potato" | "beans" | "tomato";
};

export const livePrices: PriceRow[] = [
  {
    id: "1",
    crop: "Maize",
    market: "Kigali Central",
    price: 550,
    trend: "up",
    advice: "sell_now",
    icon: "maize",
  },
  {
    id: "2",
    crop: "Irish Potatoes",
    market: "Musanze",
    price: 320,
    trend: "down",
    advice: "wait",
    icon: "potato",
  },
  {
    id: "3",
    crop: "Beans (Yellow)",
    market: "Nyabugogo",
    price: 850,
    trend: "up",
    advice: "sell_now",
    icon: "beans",
  },
  {
    id: "4",
    crop: "Tomatoes",
    market: "Huye Market",
    price: 450,
    trend: "down",
    advice: "wait",
    icon: "tomato",
  },
];

export const performanceBars = [
  { day: "Mon", value: 62, tone: "green" as const },
  { day: "Tue", value: 48, tone: "green-soft" as const },
  { day: "Wed", value: 78, tone: "green-deep" as const },
  { day: "Thu", value: 36, tone: "green-light" as const },
  { day: "Fri", value: 92, tone: "orange" as const },
  { day: "Sat", value: 58, tone: "green" as const },
  { day: "Sun", value: 54, tone: "green-mid" as const },
];

export const recentActivity = [
  {
    id: "1",
    tone: "green" as const,
    title: "Price update: Maize at Kigali Central",
    meta: "Officer: Jean-Paul M. • 12 mins ago",
  },
  {
    id: "2",
    tone: "orange" as const,
    title: "New farmer registration surge in Musanze",
    meta: "Officer: Diane U. • 45 mins ago",
  },
  {
    id: "3",
    tone: "green" as const,
    title: "Price update: Beans at Nyabugogo",
    meta: "Officer: Emmanuel K. • 1 hour ago",
  },
];
