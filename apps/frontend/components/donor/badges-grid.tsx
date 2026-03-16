import clsx from "clsx";

interface Badge {
  id: string;
  emoji: string;
  label: string;
  description: string;
  unlockedAt: string | null;
  unlocked: boolean;
  color: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function BadgesGrid({ badges }: { badges: Badge[] }) {
  const unlocked = badges.filter((b) => b.unlocked);
  const locked = badges.filter((b) => !b.unlocked);

  return (
    <div className="bg-white rounded-2xl border border-gray-100">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Badges</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          {unlocked.length}/{badges.length} débloqués
        </p>
      </div>

      <div className="px-5 py-4 space-y-6">
        {/* Badges débloqués */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Obtenus
          </p>
          <div className="space-y-2">
            {unlocked.map((badge) => (
              <div
                key={badge.id}
                className={clsx(
                  "flex items-center gap-3 p-3 rounded-xl border",
                  badge.color
                )}
              >
                <span className="text-2xl">{badge.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {badge.label}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {badge.description}
                  </p>
                  {badge.unlockedAt && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(badge.unlockedAt)}
                    </p>
                  )}
                </div>
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6L5 9L10 3"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges verrouillés */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            À débloquer
          </p>
          <div className="space-y-2">
            {locked.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 opacity-60"
              >
                <span className="text-2xl grayscale">{badge.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-500">
                    {badge.label}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {badge.description}
                  </p>
                </div>
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="3" y="5" width="6" height="5" rx="1" fill="#9ca3af" />
                    <path
                      d="M4 5V4a2 2 0 014 0v1"
                      stroke="#9ca3af"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}