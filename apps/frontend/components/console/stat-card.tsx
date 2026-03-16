import { Button, Popover, Tooltip } from "@heroui/react";
import { Information } from "iconsax-reactjs";

type StatCardProps = {
    title: string;
    value: string;
    change: string;
    positive?: boolean;
    versus?: string;
}

export default function StatCard({ title, value, change, positive = true, versus = "la semaine passée" }: StatCardProps) {
    return (
        <div className="p-4 bg-white border border-gray-200 rounded-2xl">
            <div className="flex items-center justify-between">
                <p className="text-sm text-foreground/60">{title}</p>
                <Popover>
                    <Button variant="ghost" className="p-0 hover:bg-gray-100" isIconOnly>
                        <Information />
                    </Button>
                    <Popover.Content placement="top" className="max-w-md text-sm border border-gray-200 text-foreground/60 shadow-none rounded-xl p-0">
                        <Popover.Dialog className="p-2">
                            <p className="text-sm">
                                Montant total des revenus générés par vos ventes sur la période sélectionnée.
                            </p>
                        </Popover.Dialog>
                    </Popover.Content>

                </Popover>
            </div>


            <h3 className="text-xl font-semibold mt-1">{value}</h3>

            <p
                className={`text-xs mt-1 ${positive ? "text-secondary" : "text-red-500"
                    }`}
            >
                {change} <span className="text-foreground/60"> vs {versus}</span>
            </p>
        </div>
    );
}