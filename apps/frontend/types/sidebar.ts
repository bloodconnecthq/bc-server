
type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};


type NavItem = {
    label: string;
    icon: React.ReactNode;
    href: string;
};

type NavCategory = {
    title: string;
    items: NavItem[];
};

export type {SidebarProps, NavCategory, NavItem}