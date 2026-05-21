import { StocksHistory } from "@/components/hospital/stocks/history";
import { StocksOverview } from "@/components/hospital/stocks/overview";
import { StocksTable } from "@/components/hospital/stocks/table";
import { Button } from "@heroui/react";
import { Add } from "iconsax-reactjs";

const stocks = [
    {
        group: "A+",
        available: 36,
        capacity: 50,
        lastUpdated: "2026-03-16T08:30:00",
        status: "ok" as const,
        expiringIn7Days: 4,
    },
    {
        group: "A-",
        available: 9,
        capacity: 50,
        lastUpdated: "2026-03-15T14:00:00",
        status: "low" as const,
        expiringIn7Days: 1,
    },
    {
        group: "B+",
        available: 42,
        capacity: 50,
        lastUpdated: "2026-03-16T09:00:00",
        status: "ok" as const,
        expiringIn7Days: 6,
    },
    {
        group: "B-",
        available: 4,
        capacity: 50,
        lastUpdated: "2026-03-14T11:00:00",
        status: "critical" as const,
        expiringIn7Days: 0,
    },
    {
        group: "AB+",
        available: 30,
        capacity: 50,
        lastUpdated: "2026-03-16T07:45:00",
        status: "ok" as const,
        expiringIn7Days: 3,
    },
    {
        group: "AB-",
        available: 2,
        capacity: 50,
        lastUpdated: "2026-03-13T16:00:00",
        status: "critical" as const,
        expiringIn7Days: 0,
    },
    {
        group: "O+",
        available: 22,
        capacity: 50,
        lastUpdated: "2026-03-16T10:00:00",
        status: "ok" as const,
        expiringIn7Days: 5,
    },
    {
        group: "O-",
        available: 6,
        capacity: 50,
        lastUpdated: "2026-03-15T09:30:00",
        status: "low" as const,
        expiringIn7Days: 2,
    },
];

const history = [
    { date: "16 mars", in: 12, out: 8 },
    { date: "15 mars", in: 6, out: 14 },
    { date: "14 mars", in: 18, out: 10 },
    { date: "13 mars", in: 8, out: 12 },
    { date: "12 mars", in: 14, out: 6 },
    { date: "11 mars", in: 10, out: 9 },
    { date: "10 mars", in: 16, out: 11 },
];

export default function StocksPage() {
    const total = stocks.reduce((sum, s) => sum + s.available, 0);
    const critical = stocks.filter((s) => s.status === "critical").length;
    const low = stocks.filter((s) => s.status === "low").length;
    const expiring = stocks.reduce((sum, s) => sum + s.expiringIn7Days, 0);

    return (
        <div className="space-y-8 max-w-5xl">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Stocks sanguins</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Suivi en temps réel des poches disponibles
                    </p>
                </div>
                <Button className="px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors">
                    <Add size="16"/>
                    Mise à jour manuelle
                </Button>
            </div>


            <StocksOverview
                total={total}
                critical={critical}
                low={low}
                expiring={expiring}
            />

            <div className="grid grid-cols-5 gap-6">

                <div className="col-span-3">
                    <StocksTable stocks={stocks} />
                </div>


                <div className="col-span-2">
                    <StocksHistory history={history} />
                </div>
            </div>
        </div>
    );
}