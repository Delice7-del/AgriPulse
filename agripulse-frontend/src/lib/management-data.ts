export type CropIndex = "high_demand" | "stable" | "new_entry";

export type ManagedCrop = {
  id: string;
  name: string;
  variety: string;
  index: CropIndex;
  iconTone: "green" | "orange" | "deep";
};

export type ManagedMarket = {
  id: string;
  name: string;
  region: string;
  status: "active" | "seasonal" | "new";
};

export const managedCrops: ManagedCrop[] = [
  {
    id: "1",
    name: "Irish Potato",
    variety: "Kinigi Special",
    index: "high_demand",
    iconTone: "green",
  },
  {
    id: "2",
    name: "Upland Rice",
    variety: "Long Grain White",
    index: "stable",
    iconTone: "orange",
  },
  {
    id: "3",
    name: "Maize",
    variety: "Hybrid SC637",
    index: "new_entry",
    iconTone: "deep",
  },
];

export const managedMarkets: ManagedMarket[] = [
  {
    id: "1",
    name: "Kigali Central",
    region: "Kigali City",
    status: "active",
  },
  {
    id: "2",
    name: "Nyabugogo",
    region: "Kigali City",
    status: "active",
  },
  {
    id: "3",
    name: "Musanze",
    region: "Northern Province",
    status: "seasonal",
  },
  {
    id: "4",
    name: "Huye Market",
    region: "Southern Province",
    status: "new",
  },
];
