import { create } from "zustand";

export type Shop = {
    id: string;
    name: string;
    category: string;
};

type ShopStore = {
    userShops: Shop[];
    activeShop: Shop;
    setActiveShop: (shop: Shop) => void;
    setUserShops: (shop: Shop[]) => void;
};

export const useShopStore = create<ShopStore>((set) => ({
    userShops: [
        { id: "1", name: "Eurekka Studio", category: "Technologie & Innovation" },
        { id: "2", name: "Xedo Shop", category: "Commerce & Marketing" }
    ],
    activeShop: { id: "1", name: "Eurekka Studio", category: "Technologie & Innovation" },
    setActiveShop: (shop) => set({ activeShop: shop }),
    setUserShops: (shops) => set({ userShops: shops }),
}));