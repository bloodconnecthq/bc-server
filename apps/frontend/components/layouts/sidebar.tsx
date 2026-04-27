import { usePathname } from "next/navigation";
import clsx from "clsx";
import { CloseSquare } from "iconsax-reactjs";
import Link from "next/link";
import { NavCategory, NavItem, SidebarProps } from "@/types/sidebar"
import { NAV_ITEMS } from "@/config/constant";
import SelectShopModal from "../console/select-active-shop";
import { useEffect } from "react";
import { useShopStore } from "@/stores/use-active-shop";

export default function Sidebar({ isOpen, onClose }: SidebarProps) {

    const pathname = usePathname();
    const isActive = (href: string): boolean => {
        return pathname === href || pathname.startsWith(href);
    };


    return (
        <>
            { }
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed lg:static z-50 top-0 left-0 h-screen w-64 bg-white border-r 
                    transition-transform duration-300 overflow-y-auto overscroll-contain no-scrollbar
                    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                {/* <div className="flex items-center py-5 px-4 justify-between border-b sticky top-0 bg-white">
                    <XedoBusinessIcon />
                </div> */}

                <nav className="p-4 space-y-2 overflow-y-auto">
                    <div className="">
                        <SelectShopModal />
                    </div>
                    {NAV_ITEMS.map((category: NavCategory) => (
                        <div key={category.title}>
                            { }
                            <div className={clsx("space-y-1", category.title !== "Gestion" && " pt-2 border-t")}>
                                {category.items.map((item: NavItem) => {
                                    const active = isActive(item.href);

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-3 p-2 rounded-lg text-sm font-medium transition-colors
                                            ${active
                                                    ? "bg-secondary/10"
                                                    : "hover:bg-gray-100 text-black"
                                                }`}
                                        >
                                            <span
                                                className={`transition-colors ${active ? "text-secondary" : "text-black"
                                                    }`}
                                            >
                                                {item.icon}
                                            </span>

                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>
        </>
    );
}