import type { ComponentType } from "react";

interface ActivityItem {
  id: string;
  type: string;
  text: string;
  time: string;
  icon: ComponentType<{ size?: number; color?: string; variant?: string }>;
  iconColor: string;
  color: string;
}

interface Props {
  activities: ActivityItem[];
  isLoading: boolean;
}

export function RecentActivity({ activities, isLoading }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-full">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Activité récente</h2>
        <a href="/console/donations" className="text-xs text-red-600 font-medium hover:underline">
          Voir tout
        </a>
      </div>

      <div className="divide-y divide-gray-50 max-h-120 overflow-y-auto">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-5 py-3.5 flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-xl shrink-0 animate-pulse" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-100 rounded animate-pulse w-4/5" />
                <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/3" />
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-400">
            Aucune activité récente
          </div>
        ) : (
          activities.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.id}
                className="px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50 transition-colors"
              >
                <div className={`w-8 h-8 ${a.color} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon size={15} color={a.iconColor} variant="Bold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 leading-relaxed">{a.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
