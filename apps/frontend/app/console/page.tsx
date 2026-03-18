import { RecentActivity } from "@/components/console/recent-activity";
import { NationalStats } from "@/components/console/stats/national-stats";
import { NationalStocksMap } from "@/components/console/stats/national-stocks-maps";
import { TopHospitals } from "@/components/console/stats/top-hospital";
import { Button } from "@heroui/react";

export default function ConsoleDashboard() {
    return (
        <div className="space-y-8 max-w-7xl">
            { }
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Vue d'ensemble nationale
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Centre National de Transfusion Sanguine — Bénin · 16 mars 2026
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-green-700">
                            Système opérationnel
                        </span>
                    </div>
                    <Button className="px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors">
                        + Nouvelle campagne
                    </Button>
                </div>
            </div>

            { }
            <NationalStats />

            { }
            <div className="grid grid-cols-5 gap-6">
                <div className="col-span-3">
                    <NationalStocksMap />
                </div>
                <div className="col-span-2">
                    <RecentActivity />
                </div>
            </div>

            { }
            <TopHospitals />
        </div>
    );
}