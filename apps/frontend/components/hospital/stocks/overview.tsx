interface StocksOverviewProps {
    total: number;
    critical: number;
    low: number;
    expiring: number;
}

export function StocksOverview({
    total,
    critical,
    low,
    expiring,
}: StocksOverviewProps) {
    const stats = [
        {
            label: "Total poches disponibles",
            value: total,
            sub: "tous groupes confondus",
            bg: "bg-red-50",
            text: "text-red-600",
            emoji: "🩸",
        },
        {
            label: "Groupes en état critique",
            value: critical,
            sub: "stock < 10 poches",
            bg: "bg-red-50",
            text: "text-red-600",
            emoji: "⚠️",
        },
        {
            label: "Groupes en stock faible",
            value: low,
            sub: "stock < 20 poches",
            bg: "bg-amber-50",
            text: "text-amber-600",
            emoji: "📉",
        },
        {
            label: "Poches expirant sous 7j",
            value: expiring,
            sub: "à utiliser en priorité",
            bg: "bg-orange-50",
            text: "text-orange-600",
            emoji: "⏰",
        },
    ];

    return (
        <div className="grid grid-cols-4 gap-4">
            {stats.map((s) => (
                <div
                    key={s.label}
                    className="bg-white rounded-2xl p-5 border border-gray-100"
                >
                    <div
                        className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center text-lg mb-3`}
                    >
                        {s.emoji}
                    </div>
                    <p className={`text-2xl font-black ${s.text}`}>{s.value}</p>
                    <p className="text-xs font-medium text-gray-700 mt-1">{s.label}</p>
                    <p className="text-xs text-gray-400">{s.sub}</p>
                </div>
            ))}
        </div>
    );
}