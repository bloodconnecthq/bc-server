"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import clsx from "clsx";

type DeptStatus = "ok" | "low" | "critical";

interface Department {
  department: string;
  capital: string;
  centers: number;
  stocks: Record<string, number>;
  total: number;
  status: DeptStatus;
}

const statusConfig: { [key in DeptStatus]: { label: string; badge: string; row: string } } = {
  ok:       { label: "Normal",   badge: "bg-green-50 text-green-700",  row: ""              },
  low:      { label: "Faible",   badge: "bg-amber-50 text-amber-700",  row: "bg-amber-50/30" },
  critical: { label: "Critique", badge: "bg-red-50 text-red-700",      row: "bg-red-50/30"  },
};

export function NationalStocksTable({
  departments,
  bloodGroups,
}: {
  departments: Department[];
  bloodGroups: string[];
}) {
  const [sortBy, setSortBy] = useState<"department" | "total" | "status">("status");
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  const sorted = [...departments].sort((a, b) => {
    if (sortBy === "total") return b.total - a.total;
    if (sortBy === "status") {
      const order = { critical: 0, low: 1, ok: 2 };
      return order[a.status] - order[b.status];
    }
    return a.department.localeCompare(b.department);
  });

  const getCellColor = (value: number) => {
    if (value === 0) return "bg-red-100 text-red-800 font-bold";
    if (value < 10) return "bg-red-50 text-red-700 font-semibold";
    if (value < 20) return "bg-amber-50 text-amber-700";
    return "text-gray-700";
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Détail par département
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Cliquez sur un département pour voir le détail par groupe
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Trier par</span>
          {(["status", "total", "department"] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={sortBy === s ? "primary" : "ghost"}
              onPress={() => setSortBy(s)}
              className={clsx(
                "rounded-full text-xs",
                sortBy === s && "bg-red-600 text-white"
              )}
            >
              {s === "status" ? "Statut" : s === "total" ? "Total" : "Département"}
            </Button>
          ))}
        </div>
      </div>

      {/* En-tête colonnes */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">
                Département
              </th>
              <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              {bloodGroups.map((g) => (
                <th
                  key={g}
                  className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {g}
                </th>
              ))}
              <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Centres
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.map((dept) => {
              const config = statusConfig[dept.status];
              const isExpanded = expandedDept === dept.department;

              return (
                <>
                  <tr
                    key={dept.department}
                    onClick={() =>
                      setExpandedDept(
                        isExpanded ? null : dept.department
                      )
                    }
                    className={clsx(
                      "cursor-pointer hover:bg-gray-50 transition-colors",
                      config.row
                    )}
                  >
                    {/* Département */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{isExpanded ? "▼" : "▶"}</span>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {dept.department}
                          </p>
                          <p className="text-xs text-gray-400">{dept.capital}</p>
                        </div>
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-3 py-4 text-center">
                      <p className="text-sm font-bold text-gray-900">
                        {dept.total.toLocaleString()}
                      </p>
                    </td>

                    {/* Statut */}
                    <td className="px-3 py-4 text-center">
                      <span className={clsx(
                        "text-xs font-medium px-2.5 py-1 rounded-full",
                        config.badge
                      )}>
                        {config.label}
                      </span>
                    </td>

                    {/* Stocks par groupe */}
                    {bloodGroups.map((g) => {
                      const val = dept.stocks[g] || 0;
                      return (
                        <td key={g} className="px-3 py-4 text-center">
                          <span className={clsx(
                            "text-xs px-2 py-0.5 rounded-lg",
                            getCellColor(val)
                          )}>
                            {val}
                          </span>
                        </td>
                      );
                    })}

                    {/* Centres */}
                    <td className="px-3 py-4 text-center">
                      <p className="text-xs text-gray-500">{dept.centers}</p>
                    </td>
                  </tr>

                  {/* Ligne expandée */}
                  {isExpanded && (
                    <tr key={`${dept.department}-expanded`}>
                      <td colSpan={bloodGroups.length + 4} className="px-6 py-4 bg-gray-50">
                        <div className="flex items-center gap-6">
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Détail {dept.department}
                          </p>
                          <div className="flex gap-3 flex-wrap">
                            {bloodGroups.map((g) => {
                              const val = dept.stocks[g] || 0;
                              const isLow = val < 10;
                              return (
                                <div
                                  key={g}
                                  className={clsx(
                                    "flex items-center gap-2 px-3 py-2 rounded-xl text-xs",
                                    isLow
                                      ? "bg-red-50 border border-red-200"
                                      : "bg-white border border-gray-200"
                                  )}
                                >
                                  <span className={clsx(
                                    "font-bold",
                                    isLow ? "text-red-700" : "text-gray-700"
                                  )}>
                                    {g}
                                  </span>
                                  <span className={clsx(
                                    "font-black text-sm",
                                    isLow ? "text-red-600" : "text-gray-900"
                                  )}>
                                    {val}
                                  </span>
                                  {isLow && (
                                    <span className="text-red-500">⚠️</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <Button
                            size="sm"
                            variant="danger"
                            className="ml-auto rounded-xl text-xs"
                          >
                            🚨 Lancer une alerte
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>

          {/* Ligne totaux */}
          <tfoot>
            <tr className="bg-gray-900 border-t-2 border-gray-200">
              <td className="px-6 py-4">
                <p className="text-sm font-bold text-white">TOTAL NATIONAL</p>
              </td>
              <td className="px-3 py-4 text-center">
                <p className="text-sm font-black text-white">
                  {departments.reduce((s, d) => s + d.total, 0).toLocaleString()}
                </p>
              </td>
              <td className="px-3 py-4" />
              {bloodGroups.map((g) => (
                <td key={g} className="px-3 py-4 text-center">
                  <p className="text-xs font-bold text-white">
                    {departments.reduce(
                      (s, d) => s + (d.stocks[g] || 0),
                      0
                    )}
                  </p>
                </td>
              ))}
              <td className="px-3 py-4 text-center">
                <p className="text-xs text-gray-400">
                  {departments.reduce((s, d) => s + d.centers, 0)}
                </p>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}