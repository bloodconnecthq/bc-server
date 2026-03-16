"use client";

interface HistoryEntry {
    date: string;
    in: number;
    out: number;
}

export function StocksHistory({ history }: { history: HistoryEntry[] }) {
    const maxVal = Math.max(...history.flatMap((h) => [h.in, h.out]));

    return (
        <div className="bg-white rounded-2xl border border-gray-100 h-full">
            <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">
                    Mouvements — 7 derniers jours
                </h2>
                <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 bg-green-500 rounded-sm" />
                        <span className="text-xs text-gray-500">Entrées</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 bg-red-400 rounded-sm" />
                        <span className="text-xs text-gray-500">Sorties</span>
                    </div>
                </div>
            </div>

            <div className="px-6 py-5">
                { }
                <div className="flex items-end justify-between gap-2 h-40">
                    {history.map((entry) => (
                        <div
                            key={entry.date}
                            className="flex-1 flex flex-col items-center gap-1"
                        >
                            <div className="w-full flex gap-0.5 items-end h-32">
                                { }
                                <div
                                    className="flex-1 bg-green-500 rounded-t-md transition-all"
                                    style={{
                                        height: `${Math.round((entry.in / maxVal) * 100)}%`,
                                        minHeight: "4px",
                                    }}
                                    title={`Entrées: ${entry.in}`}
                                />
                                { }
                                <div
                                    className="flex-1 bg-red-400 rounded-t-md transition-all"
                                    style={{
                                        height: `${Math.round((entry.out / maxVal) * 100)}%`,
                                        minHeight: "4px",
                                    }}
                                    title={`Sorties: ${entry.out}`}
                                />
                            </div>
                            <span className="text-xs text-gray-400 text-center leading-tight">
                                {entry.date.split(" ")[0]}
                            </span>
                        </div>
                    ))}
                </div>

                { }
                <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="bg-green-50 rounded-xl p-3">
                        <p className="text-lg font-bold text-green-700">
                            +{history.reduce((sum, h) => sum + h.in, 0)}
                        </p>
                        <p className="text-xs text-green-600">poches reçues</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-3">
                        <p className="text-lg font-bold text-red-600">
                            -{history.reduce((sum, h) => sum + h.out, 0)}
                        </p>
                        <p className="text-xs text-red-500">poches utilisées</p>
                    </div>
                </div>

                { }
                <p className="text-xs text-gray-400 text-center mt-4">
                    Dernière synchronisation : aujourd'hui à 10h00
                </p>
            </div>
        </div>
    );
}