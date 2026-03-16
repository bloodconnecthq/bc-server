interface NextDonationBannerProps {
    isEligible: boolean;
    daysLeft: number;
    nextDate: string;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export function NextDonationBanner({
    isEligible,
    daysLeft,
    nextDate,
}: NextDonationBannerProps) {
    if (isEligible) {
        return (
            <div className="bg-green-600 rounded-2xl p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                        🩸
                    </div>
                    <div>
                        <p className="font-bold text-base">Vous êtes éligible au don !</p>
                        <p className="text-sm text-green-100">
                            Trouvez un centre de collecte près de chez vous
                        </p>
                    </div>
                </div>
                <a
                    href="/donor/centers"
                    className="shrink-0 px-4 py-2 bg-white text-green-700 text-sm font-bold rounded-xl hover:bg-green-50 transition-colors"
                >
                    Trouver un centre
                </a>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-xl">
                    ⏳
                </div>
                <div>
                    <p className="font-bold text-base text-gray-900">
                        Prochain don possible dans{" "}
                        <span className="text-red-600">{daysLeft} jours</span>
                    </p>
                    <p className="text-sm text-gray-500">
                        Date d'éligibilité : {formatDate(nextDate)}
                    </p>
                </div>
            </div>
            <div className="shrink-0 w-14 h-14 relative">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle
                        cx="18" cy="18" r="15.9"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="3"
                    />
                    <circle
                        cx="18" cy="18" r="15.9"
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth="3"
                        strokeDasharray={`${100 - Math.min((daysLeft / 90) * 100, 100)} 100`}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-700">{daysLeft}j</span>
                </div>
            </div>
        </div>
    );
}