import { NavCategory } from "@/types/sidebar"

import {
    Home,
    Box,
    ShoppingCart,
    People,
    Star,
    Chart,
    Wallet,
    Setting2,
    Bag,
    Card,
    Verify,
    Key,
    LogoutCurve,
} from "iconsax-reactjs";

 export const NAV_ITEMS: NavCategory[] = [
    {
        title: "Gestion",
        items: [
            { label: "Aperçu", icon: <Home size={20} />, href: "/console" },
            { label: "Collections", icon: <Box size={20} />, href: "/collections" },
            { label: "Produits", icon: <ShoppingCart size={20} />, href: "/products" },
            { label: "Commandes", icon: <Bag size={20} />, href: "/orders" },
            { label: "Paniers", icon: <ShoppingCart size={20} />, href: "/carts" },
            { label: "Clients", icon: <People size={20} />, href: "/clients" },
            { label: "Avis", icon: <Star size={20} />, href: "/reviews" },
        ],
    },
    {
        title: "Croissance",
        items: [
            { label: "Analytique", icon: <Chart size={20} />, href: "/analytics" },
            { label: "Portefeuille", icon: <Wallet size={20} />, href: "/wallet" },
            { label: "Sponsoring", icon: <Card size={20} />, href: "/sponsoring" },
            { label: "Marketing", icon: <Verify size={20} />, href: "/marketing" },
        ],
    },
    {
        title: "Système",
        items: [
            { label: "Api", icon: <Key size={20} />, href: "/api" },
            { label: "Paramètre", icon: <Setting2 size={20} />, href: "/settings" },
            { label: "Déconnexion", icon: <LogoutCurve size={20} />, href: "/logout" },
        ],
    },
];



export const BRAND_COLORS = [
    "#1B7A6B", "#2D9E47", "#F5C518", "#1A1A1A", "#D93025"
];

export const ACTIVITY_CATEGORIES = [
    "Technologie",
    "Commerce",
    "Santé",
    "Éducation",
    "Finance",
    "Restauration",
    "Mode & Beauté",
    "Transport",
    "Immobilier",
    "Agriculture",
    "Autre",
];

export const CURRENCIES = ["XOF", "EUR", "USD", "GBP", "CAD"];
