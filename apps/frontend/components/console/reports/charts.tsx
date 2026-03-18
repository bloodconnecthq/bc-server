"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import clsx from "clsx";

const monthlyDonations = [
  { month: "Oct", donations: 2841, donors: 1240 },
  { month: "Nov", donations: 2654, donors: 1180 },
  { month: "Déc", donations: 2490, donors: 1090 },
  { month: "Jan", donations: 2201, donors: 980  },
  { month: "Fév", donations: 2980, donors: 1320 },
  { month: "Mar", donations: 3241, donors: 1450 },
];

const bloodGroupDistrib = [
  { group: "O+",  pct: 45, color: "bg-red-500"    },
  { group: "A+",  pct: 25, color: "bg-blue-500"   },
  { group: "B+",  pct: 20, color: "bg-green-500"  },
  { group: "AB+", pct: 4,  color: "bg-amber-500"  },
  { group: "O-",  pct: 3,  color: "bg-red-300"    },
  { group: "A-",  pct: 1,  color: "bg-blue-300"   },
  { group: "B-",  pct: 1,  color: "bg-green-300"  },
  { group: "AB-", pct: 1,  color: "bg-amber-300"  },
];

const topDepartments = [
  { dept: "Littoral",   donations: 1240, pct: 100 },
  { dept: "Atlantique", donations: 687,  pct: 55  },
  { dept: "Borgou",     donations: 523,  pct: 42  },
  { dept: "Ouémé",      donations: 398,  pct: 32  },
  { dept: "Atacora",    donations: 187,  pct: 15  },
  { dept: "Collines",   donations: 206,  pct: 17  },
];

const donorsByAge = [
  { range: "18-25", count: 3840, pct: 30 },
  { range: "26-35", count: 5138, pct: 40 },
  { range: "36-50", count: 2954, pct: 23 },
  { range: "51-60", count: 915,  pct: 7  },
];

type ChartView = "donations" | "groups" | "departments" | "age";

export function ReportsCharts() {
  const [activeView, setActiveView] = useState<ChartView>("donations");

  const maxDonations = Math.max(...monthlyDonations.map((m) => m.donations));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          Analyses & Tendances
        </h2>
        <div className="flex gap-2">
          {(
            [
              { key: "donations",   label: "Évolution dons"     },
              { key: "groups",      label: "Groupes sanguins"   },
              { key: "departments", label: "Par département"     },
              { key: "age",         label: "Tranche d'âge"      },
            ] as { key: ChartView; label: string }[]
          ).map((v) => (
            <Button
              key={v.key}
              size="sm"
              variant={activeView === v.key ? "primary" : "ghost"}
              onPress={() => setActiveView(v.key)}
              className={clsx(
                "rounded-xl text-xs",
                activeView === v.key && "bg-red-600 text-white"
              )}
            >
              {v.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Évolution mensuelle */}
        {activeView === "donations" && (
          <div>
            <p className="text-xs text-gray-400 mb-6">
              Dons collectés par mois — 6 derniers mois
            </p>
            <div className="flex items-end gap-4 h-48">
              {monthlyDonations.map((m) => {
                const pct = Math.round((m.donations / maxDonations) * 100);
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                    <p className="text-xs font-bold text-gray-700">{m.donations.toLocaleString()}</p>
                    <div className="w-full flex gap-1 items-end h-36">
                      {/* Dons */}
                      <div
                        className="flex-1 bg-red-500 rounded-t-lg transition-all"
                        style={{ height: `${pct}%`, minHeight: "8px" }}
                        title={`Dons: ${m.donations}`}
                      />
                      {/* Donneurs */}
                      <div
                        className="flex-1 bg-red-200 rounded-t-lg transition-all"
                        style={{
                          height: `${Math.round((m.donors / maxDonations) * 100)}%`,
                          minHeight: "8px",
                        }}
                        title={`Donneurs: ${m.donors}`}
                      />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">{m.month}</p>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-sm" />
                <span className="text-xs text-gray-500">Dons</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-200 rounded-sm" />
                <span className="text-xs text-gray-500">Donneurs uniques</span>
              </div>
            </div>
          </div>
        )}

        {/* Répartition groupes sanguins */}
        {activeView === "groups" && (
          <div>
            <p className="text-xs text-gray-400 mb-6">
              Distribution des donneurs par groupe sanguin
            </p>
            <div className="space-y-3">
              {bloodGroupDistrib.map((g) => (
                <div key={g.group} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-red-600">{g.group}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">{g.group}</span>
                      <span className="text-xs font-bold text-gray-900">{g.pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${g.color}`}
                        style={{ width: `${g.pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    <p className="text-xs text-gray-500">
                      ~{Math.round((g.pct / 100) * 12847).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Par département */}
        {activeView === "departments" && (
          <div>
            <p className="text-xs text-gray-400 mb-6">
              Top 6 départements par volume de dons — mars 2026
            </p>
            <div className="space-y-3">
              {topDepartments.map((d, i) => (
                <div key={d.dept} className="flex items-center gap-4">
                  <div className="w-7 h-7 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-gray-600">{i + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">{d.dept}</span>
                      <span className="text-xs font-bold text-gray-900">
                        {d.donations.toLocaleString()} dons
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-red-500"
                        style={{ width: `${d.pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tranche d'âge */}
        {activeView === "age" && (
          <div>
            <p className="text-xs text-gray-400 mb-6">
              Répartition des donneurs actifs par tranche d'âge
            </p>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {donorsByAge.map((a) => (
                <div
                  key={a.range}
                  className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100"
                >
                  <p className="text-3xl font-black text-red-600">{a.pct}%</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{a.range} ans</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {a.count.toLocaleString()} donneurs
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-end gap-3 h-32">
              {donorsByAge.map((a) => (
                <div key={a.range} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-red-500 rounded-t-xl"
                    style={{ height: `${a.pct * 3}px` }}
                  />
                  <p className="text-xs text-gray-500">{a.range}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}