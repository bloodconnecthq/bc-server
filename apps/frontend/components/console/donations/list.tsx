"use client";

import { useState } from "react";
import { Button, Chip, Alert } from "@heroui/react";
import { SearchNormal1 } from "iconsax-reactjs";
import clsx from "clsx";

type DonationStatus = "validated" | "pending" | "rejected";

interface Tests {
  hiv: boolean;
  hepatiteB: boolean;
  hepatiteC: boolean;
  syphilis: boolean;
}

interface Donation {
  id: string;
  donorName: string;
  donorId: string;
  bloodGroup: string;
  volume: number;
  date: string;
  center: string;
  department: string;
  agent: string;
  status: DonationStatus;
  tests: Tests;
  expiresAt: string;
}

const statusConfig: {
  [key in DonationStatus]: {
    label: string;
    color: "success" | "warning" | "danger";
  };
} = {
  validated: { label: "Validée",    color: "success" },
  pending:   { label: "En attente", color: "warning" },
  rejected:  { label: "Rejetée",    color: "danger"  },
};

const filters = ["Toutes", "Validées", "En attente", "Rejetées"];

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatExpiry(dateStr: string) {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - new Date().getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return { label: "Expirée", danger: true };
  if (days <= 7) return { label: `Expire dans ${days}j`, danger: true };
  return { label: `Expire le ${new Date(dateStr).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}`, danger: false };
}

export function ConsoleDonationsList({
  donations,
}: {
  donations: Donation[];
}) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Toutes");
  const [deptFilter, setDeptFilter] = useState("Tous");
  const [selected, setSelected] = useState<Donation | null>(null);
  const [items, setItems] = useState(donations);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const departments = ["Tous", ...Array.from(new Set(donations.map((d) => d.department)))];

  const filtered = items.filter((d) => {
    const matchSearch =
      d.donorName.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.bloodGroup.toLowerCase().includes(search.toLowerCase()) ||
      d.center.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      activeFilter === "Toutes" ||
      (activeFilter === "Validées" && d.status === "validated") ||
      (activeFilter === "En attente" && d.status === "pending") ||
      (activeFilter === "Rejetées" && d.status === "rejected");

    const matchDept =
      deptFilter === "Tous" || d.department === deptFilter;

    return matchSearch && matchFilter && matchDept;
  });

  const handleValidate = (id: string) => {
    setItems((prev) =>
      prev.map((d) => d.id === id ? { ...d, status: "validated" as DonationStatus } : d)
    );
    setLastAction("Poche validée avec succès.");
    setSelected(null);
    setTimeout(() => setLastAction(null), 3000);
  };

  const handleReject = (id: string) => {
    setItems((prev) =>
      prev.map((d) => d.id === id ? { ...d, status: "rejected" as DonationStatus } : d)
    );
    setLastAction("Poche rejetée.");
    setSelected(null);
    setTimeout(() => setLastAction(null), 3000);
  };

  return (
    <div className="space-y-4">
      {}
      {lastAction && (
        <Alert status="success">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{lastAction}</Alert.Title>
          </Alert.Content>
        </Alert>
      )}

      {}
      <div className="space-y-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <SearchNormal1
              size={15}
              color="#9ca3af"
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Rechercher une poche..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400"
            />
          </div>

          {}
          <div className="flex gap-2">
            {filters.map((f) => (
              <Button
                key={f}
                size="sm"
                variant={activeFilter === f ? "primary" : "outline"}
                onPress={() => setActiveFilter(f)}
                className={clsx(
                  "rounded-full text-xs",
                  activeFilter === f && "bg-red-600 border-red-600 text-white"
                )}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        {}
        <div className="flex gap-2 flex-wrap">
          {departments.map((d) => (
            <Button
              key={d}
              size="sm"
              variant={deptFilter === d ? "secondary" : "ghost"}
              onPress={() => setDeptFilter(d)}
              className={clsx(
                "rounded-full text-xs",
                deptFilter === d
                  ? "bg-gray-900 text-white"
                  : "text-gray-500"
              )}
            >
              {d}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {}
          <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-1">Groupe</div>
            <div className="col-span-2">ID Don</div>
            <div className="col-span-2">Donneur</div>
            <div className="col-span-2">Centre</div>
            <div className="col-span-1">Dept.</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1">Expiration</div>
            <div className="col-span-1">Statut</div>
          </div>

          <div className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">
                Aucune poche trouvée
              </div>
            )}

            {filtered.map((donation) => {
              const sConfig = statusConfig[donation.status];
              const expiry = formatExpiry(donation.expiresAt);

              return (
                <div
                  key={donation.id}
                  onClick={() => setSelected(donation)}
                  className={clsx(
                    "grid grid-cols-12 px-6 py-4 items-center cursor-pointer transition-colors hover:bg-gray-50",
                    selected?.id === donation.id && "bg-red-50"
                  )}
                >
                  {}
                  <div className="col-span-1">
                    <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                      <span className="text-xs font-bold text-red-600">
                        {donation.bloodGroup}
                      </span>
                    </div>
                  </div>

                  {}
                  <div className="col-span-2">
                    <p className="text-xs font-mono font-semibold text-gray-700">
                      {donation.id}
                    </p>
                  </div>

                  {}
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-gray-900">
                      {donation.donorName}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">
                      {donation.donorId}
                    </p>
                  </div>

                  {}
                  <div className="col-span-2">
                    <p className="text-xs text-gray-600 truncate">
                      {donation.center}
                    </p>
                  </div>

                  {}
                  <div className="col-span-1">
                    <p className="text-xs text-gray-400">{donation.department}</p>
                  </div>

                  {}
                  <div className="col-span-2">
                    <p className="text-xs text-gray-600">
                      {formatDate(donation.date)}
                    </p>
                  </div>

                  {}
                  <div className="col-span-1">
                    {expiry && (
                      <span className={clsx(
                        "text-xs font-medium",
                        expiry.danger ? "text-red-500" : "text-gray-400"
                      )}>
                        {expiry.danger && "⚠️ "}
                        {expiry.label}
                      </span>
                    )}
                  </div>

                  {}
                  <div className="col-span-1">
                    <Chip size="sm" color={sConfig.color}>
                      {sConfig.label}
                    </Chip>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {}
        {selected && (
          <div className="w-72 shrink-0 bg-white rounded-2xl border border-gray-100 self-start">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Détail poche
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >×</button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {}
              <div className="flex items-center justify-between">
                <p className="text-xs font-mono font-bold text-gray-900">
                  {selected.id}
                </p>
                <Chip size="sm" color={statusConfig[selected.status].color}>
                  {statusConfig[selected.status].label}
                </Chip>
              </div>

              {}
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {selected.bloodGroup}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {selected.bloodGroup}
                  </p>
                  <p className="text-xs text-gray-500">{selected.volume} ml</p>
                  {selected.expiresAt && (
                    <p className="text-xs text-gray-400">
                      Exp. {new Date(selected.expiresAt).toLocaleDateString("fr-FR")}
                    </p>
                  )}
                </div>
              </div>

              {}
              {[
                { label: "Donneur", value: selected.donorName },
                { label: "ID Donneur", value: selected.donorId },
                { label: "Centre", value: selected.center },
                { label: "Département", value: selected.department },
                { label: "Agent", value: selected.agent },
                { label: "Date du don", value: formatDate(selected.date) },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-gray-900">{item.value}</p>
                </div>
              ))}

              {}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                  Résultats des tests
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { key: "hiv" as const, label: "VIH" },
                      { key: "hepatiteB" as const, label: "Hépatite B" },
                      { key: "hepatiteC" as const, label: "Hépatite C" },
                      { key: "syphilis" as const, label: "Syphilis" },
                    ]
                  ).map((test) => {
                    const positive = selected.tests[test.key];
                    return (
                      <div
                        key={test.key}
                        className={clsx(
                          "flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium",
                          positive
                            ? "bg-red-50 text-red-700"
                            : "bg-green-50 text-green-700"
                        )}
                      >
                        <span>{positive ? "✕" : "✓"}</span>
                        {test.label}
                      </div>
                    );
                  })}
                </div>
              </div>

              {}
              {selected.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    fullWidth
                    onPress={() => handleValidate(selected.id)}
                    className="rounded-xl text-xs bg-green-600 text-white hover:bg-green-700"
                  >
                    ✓ Valider
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    fullWidth
                    onPress={() => handleReject(selected.id)}
                    className="rounded-xl text-xs"
                  >
                    ✕ Rejeter
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}