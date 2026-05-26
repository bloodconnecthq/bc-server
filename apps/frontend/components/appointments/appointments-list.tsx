"use client";

import { useState } from "react";
import { Button, Chip, Alert } from "@heroui/react";
import { SearchNormal1 } from "iconsax-reactjs";
import clsx from "clsx";

type AppointmentStatus = "planifie" | "confirme" | "annule" | "effectue";
type MemberRole = "medecin" | "infirmier";

interface Appointment {
  id: string;
  donorName: string;
  donorId: string;
  bloodGroup: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  assignedTo: string | null;
  assignedId: string | null;
  note: string;
}

interface Member {
  id: string;
  name: string;
  role: MemberRole;
}

const statusConfig: {
  [key in AppointmentStatus]: {
    label: string;
    color: "warning" | "success" | "default";
  };
} = {
  planifie:  { label: "Planifié",  color: "warning" },
  confirme:  { label: "Confirmé",  color: "success" },
  annule:    { label: "Annulé",    color: "default" },
  effectue:  { label: "Effectué",  color: "default" },
};

const filters = ["Tous", "Planifiés", "Confirmés", "Non assignés", "Annulés"];

export function AppointmentsList({
  appointments,
  members,
}: {
  appointments: Appointment[];
  members: Member[];
}) {
  const [items, setItems] = useState(appointments);
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const filtered = items.filter((a) => {
    const matchSearch =
      a.donorName.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.bloodGroup.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      activeFilter === "Tous" ||
      (activeFilter === "Planifiés" && a.status === "planifie") ||
      (activeFilter === "Confirmés" && a.status === "confirme") ||
      (activeFilter === "Non assignés" && !a.assignedTo && a.status !== "annule") ||
      (activeFilter === "Annulés" && a.status === "annule");

    return matchSearch && matchFilter;
  });

  const handleAssign = (apptId: string, member: Member) => {
    setItems((prev) =>
      prev.map((a) =>
        a.id === apptId
          ? { ...a, assignedTo: member.name, assignedId: member.id, status: "confirme" as AppointmentStatus }
          : a
      )
    );
    setAssigningId(null);
    setSelected(null);
    setLastAction(`${member.name} assigné(e) au rendez-vous ${apptId}.`);
    setTimeout(() => setLastAction(null), 3000);
  };

  const handleCancel = (apptId: string) => {
    setItems((prev) =>
      prev.map((a) =>
        a.id === apptId
          ? { ...a, status: "annule" as AppointmentStatus, assignedTo: null, assignedId: null }
          : a
      )
    );
    setSelected(null);
    setLastAction(`Rendez-vous ${apptId} annulé.`);
    setTimeout(() => setLastAction(null), 3000);
  };

  const handleMarkDone = (apptId: string) => {
    setItems((prev) =>
      prev.map((a) =>
        a.id === apptId ? { ...a, status: "effectue" as AppointmentStatus } : a
      )
    );
    setSelected(null);
    setLastAction(`Rendez-vous ${apptId} marqué comme effectué.`);
    setTimeout(() => setLastAction(null), 3000);
  };

  return (
    <div className="space-y-4">
      {lastAction && (
        <Alert status="success">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{lastAction}</Alert.Title>
          </Alert.Content>
        </Alert>
      )}

      {/* Recherche + filtres */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <SearchNormal1
            size={15}
            color="#9ca3af"
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Rechercher un RDV..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
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

      <div className="flex gap-6">
        {/* Tableau */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-1">Groupe</div>
            <div className="col-span-2">ID RDV</div>
            <div className="col-span-3">Donneur</div>
            <div className="col-span-2">Date & Heure</div>
            <div className="col-span-2">Agent assigné</div>
            <div className="col-span-1">Statut</div>
            <div className="col-span-1"></div>
          </div>

          <div className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">
                Aucun rendez-vous trouvé
              </div>
            )}
            {filtered.map((appt) => {
              const sConfig = statusConfig[appt.status];
              return (
                <div
                  key={appt.id}
                  onClick={() => { setSelected(appt); setAssigningId(null); }}
                  className={clsx(
                    "grid grid-cols-12 px-6 py-4 items-center cursor-pointer transition-colors hover:bg-gray-50",
                    selected?.id === appt.id && "bg-red-50"
                  )}
                >
                  <div className="col-span-1">
                    <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                      <span className="text-xs font-bold text-red-600">
                        {appt.bloodGroup}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-mono font-semibold text-gray-700">
                      {appt.id}
                    </p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {appt.donorName}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">
                      {appt.donorId}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(appt.date).toLocaleDateString("fr-FR", {
                        day: "2-digit", month: "short"
                      })}
                    </p>
                    <p className="text-xs text-gray-400">{appt.time}</p>
                  </div>
                  <div className="col-span-2">
                    {appt.assignedTo ? (
                      <span className="text-xs font-medium text-green-700">
                        {appt.assignedTo}
                      </span>
                    ) : appt.status !== "annule" ? (
                      <span className="text-xs text-amber-600 font-medium">
                        Non assigné
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>
                  <div className="col-span-1">
                    <Chip size="sm" color={sConfig.color}>
                      {sConfig.label}
                    </Chip>
                  </div>
                  <div className="col-span-1" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Panneau détail */}
        {selected && (
          <div className="w-72 shrink-0 bg-white rounded-2xl border border-gray-100 self-start">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Détail RDV
              </h3>
              <button
                onClick={() => { setSelected(null); setAssigningId(null); }}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >×</button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* ID + statut */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-mono font-bold text-gray-900">
                  {selected.id}
                </p>
                <Chip size="sm" color={statusConfig[selected.status].color}>
                  {statusConfig[selected.status].label}
                </Chip>
              </div>

              {/* Groupe sanguin */}
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {selected.bloodGroup}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {selected.donorName}
                  </p>
                  <p className="text-xs text-gray-400 font-mono">
                    {selected.donorId}
                  </p>
                </div>
              </div>

              {/* Infos */}
              {[
                {
                  label: "Date",
                  value: new Date(selected.date).toLocaleDateString("fr-FR", {
                    weekday: "long", day: "2-digit", month: "long", year: "numeric"
                  }),
                },
                { label: "Heure", value: selected.time },
                {
                  label: "Agent assigné",
                  value: selected.assignedTo ?? "Non assigné",
                },
                {
                  label: "Note",
                  value: selected.note || "—",
                },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {item.value}
                  </p>
                </div>
              ))}

              {/* Assigner un agent */}
              {selected.status !== "annule" && selected.status !== "effectue" && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                    Assigner un agent
                  </p>
                  {assigningId === selected.id ? (
                    <div className="space-y-2">
                      {members.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => handleAssign(selected.id, m)}
                          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all text-left"
                        >
                          <div className={clsx(
                            "w-2 h-2 rounded-full",
                            m.role === "medecin" ? "bg-green-500" : "bg-amber-500"
                          )} />
                          <span className="text-sm font-medium text-gray-900">
                            {m.name}
                          </span>
                          <span className="text-xs text-gray-400 ml-auto">
                            {m.role === "medecin" ? "Médecin" : "Infirmier"}
                          </span>
                        </button>
                      ))}
                      <Button
                        size="sm"
                        variant="ghost"
                        fullWidth
                        onPress={() => setAssigningId(null)}
                        className="rounded-xl text-xs text-gray-500"
                      >
                        Annuler
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      fullWidth
                      onPress={() => setAssigningId(selected.id)}
                      className="rounded-xl text-xs"
                    >
                      {selected.assignedTo
                        ? "Changer l'agent"
                        : "Assigner un agent"}
                    </Button>
                  )}
                </div>
              )}

              {/* Actions */}
              {selected.status !== "annule" && selected.status !== "effectue" && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    fullWidth
                    onPress={() => handleMarkDone(selected.id)}
                    className="rounded-xl text-xs bg-green-600 text-white hover:bg-green-700"
                  >
                    ✓ Effectué
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    fullWidth
                    onPress={() => handleCancel(selected.id)}
                    className="rounded-xl text-xs"
                  >
                    Annuler
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