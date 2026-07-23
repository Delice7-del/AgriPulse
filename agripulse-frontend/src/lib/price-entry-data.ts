export const priceEntryCrops = [
  { id: "maize", name: "Maize" },
  { id: "beans", name: "Beans" },
  { id: "cassava", name: "Cassava" },
  { id: "irish-potatoes", name: "Irish Potatoes" },
  { id: "tomatoes", name: "Tomatoes" },
];

export const priceEntryMarkets = [
  { id: "kigali-central", name: "Kigali Central" },
  { id: "nyabugogo", name: "Nyabugogo" },
  { id: "musanze", name: "Musanze" },
  { id: "huye", name: "Huye Market" },
];

export type RecentEntry = {
  id: string;
  crop: string;
  market: string;
  price: number;
  status: "verified" | "pending";
  time: string;
  icon: "maize" | "beans" | "cassava";
};

export const recentEntries: RecentEntry[] = [
  {
    id: "1",
    crop: "Maize",
    market: "Kigali Central",
    price: 750,
    status: "verified",
    time: "2 mins ago",
    icon: "maize",
  },
  {
    id: "2",
    crop: "Beans",
    market: "Nyabugogo",
    price: 1100,
    status: "pending",
    time: "15 mins ago",
    icon: "beans",
  },
  {
    id: "3",
    crop: "Cassava",
    market: "Musanze",
    price: 450,
    status: "verified",
    time: "1 hour ago",
    icon: "cassava",
  },
];
