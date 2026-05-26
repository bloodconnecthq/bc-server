"use client";

import { People, TickCircle, CloseCircle, ShieldTick, User, Stethoscope, Firstaid } from "iconsax-reactjs";
import type { UserStatsAPI } from "@/lib/api/consoleApi";

const ROLE_CFG: Record<string, { label: string; color: string }> = {
  donneur:      { label: "Donneurs",        color: "text-red-600"    },
  medecin:      { label: "Médecins",        color: "text-blue-600"   },
  infirmier:    { label: "Infirmiers",      color: "text-teal-600"   },
  admin_hopital:{ label: "Admins hôpital",  color: "text-purple-600" },
  super_admin:  { label: "Super admins",    color: "text-gray-700"   },
};

interface Props { stats: UserStatsAPI | null; loading: boolean }

export function UsersStats({ stats, loading }: Props) {
  const kpis = [
    { label: "Total utilisateurs",  value: stats?.total ?? 0,    icon: People,      color: "text-gray-900",   bg: "bg-gray-50"    },
    { label: "Comptes actifs",       value: stats?.actifs ?? 0,   icon: TickCircle,  color: "text-green-600",  bg: "bg-green-50"   },
    { label: "Comptes inactifs",     value: stats?.inactifs ?? 0, icon: CloseCircle, color: "text-red-600",    bg: "bg-red-50"     },
    { label: "Personnels hôpitaux",  value: (stats?.parRole?.medecin ?? 0) + (stats?.parRole?.infirmier ?? 0) + (stats?.parRole?.admin_hopital ?? 0),
      icon: ShieldTick, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-2xl border border-gray-100 p-5">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-8 w-16 bg-gray-100 rounded-lg animate-pulse" />
                  <div className="h-4 w-24 bg-gray-100 rounded-lg animate-pulse" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
                    <div className={`w-9 h-9 ${k.bg} rounded-xl flex items-center justify-center`}>
                      <Icon size={17} className={k.color} variant="Bold" />
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-500">{k.label}</p>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Role breakdown */}
      {!loading && stats && (
        <div className="bg-white rounded-2xl border border-gray-100 px-6 py-4">
          <div className="flex items-center gap-6 flex-wrap">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0">Par rôle</p>
            {Object.entries(ROLE_CFG).map(([role, cfg]) => {
              const count = stats.parRole?.[role] ?? 0;
              return (
                <div key={role} className="flex items-center gap-2">
                  <span className={`text-sm font-black ${cfg.color}`}>{count}</span>
                  <span className="text-xs text-gray-500">{cfg.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
