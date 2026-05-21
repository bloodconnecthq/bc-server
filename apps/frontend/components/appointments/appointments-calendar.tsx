"use client";

import { useState } from "react";
import clsx from "clsx";

type AppointmentStatus = "planifie" | "confirme" | "annule" | "effectue";

interface Appointment {
  id: string;
  donorName: string;
  donorId: string;
  bloodGroup: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  assignedTo: string | null;
  note: string;
}

const statusColors: { [key in AppointmentStatus]: string } = {
  planifie:  "bg-amber-100 text-amber-800 border-amber-200",
  confirme:  "bg-green-100 text-green-800 border-green-200",
  annule:    "bg-gray-100 text-gray-500 border-gray-200",
  effectue:  "bg-blue-100 text-blue-800 border-blue-200",
};

const statusDot: { [key in AppointmentStatus]: string } = {
  planifie: "bg-amber-400",
  confirme: "bg-green-500",
  annule:   "bg-gray-300",
  effectue: "bg-blue-500",
};

export function AppointmentsCalendar({
  appointments,
}: {
  appointments: Appointment[];
}) {
  const [selectedDate, setSelectedDate] = useState("2026-04-28");

  // Générer les 7 prochains jours
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date("2026-04-28");
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const dayLabels = days.map((d, i) => ({
    date: d,
    label: dayNames[i],
    day: new Date(d).getDate(),
    count: appointments.filter((a) => a.date === d).length,
  }));

  const filtered = appointments
    .filter((a) => a.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">
          Calendrier de la semaine
        </h2>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {dayLabels.map((d) => (
          <button
            key={d.date}
            onClick={() => setSelectedDate(d.date)}
            className={clsx(
              "flex flex-col items-center py-4 gap-1 transition-all border-b-2",
              selectedDate === d.date
                ? "border-red-600 bg-red-50"
                : "border-transparent hover:bg-gray-50"
            )}
          >
            <span className="text-xs text-gray-400 font-medium">{d.label}</span>
            <span className={clsx(
              "text-lg font-black",
              selectedDate === d.date ? "text-red-600" : "text-gray-900"
            )}>
              {d.day}
            </span>
            {d.count > 0 ? (
              <span className={clsx(
                "text-xs font-bold px-2 py-0.5 rounded-full",
                selectedDate === d.date
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-600"
              )}>
                {d.count} RDV
              </span>
            ) : (
              <span className="text-xs text-gray-300">—</span>
            )}
          </button>
        ))}
      </div>

      {/* Timeline du jour sélectionné */}
      <div className="px-6 py-4">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            Aucun rendez-vous ce jour
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((appt) => (
              <div
                key={appt.id}
                className={clsx(
                  "flex items-center gap-4 p-4 rounded-xl border",
                  statusColors[appt.status]
                )}
              >
                {/* Heure */}
                <div className="shrink-0 text-center w-14">
                  <p className="text-base font-black text-gray-900">
                    {appt.time}
                  </p>
                </div>

                {/* Séparateur vertical */}
                <div className={clsx(
                  "w-1 h-10 rounded-full shrink-0",
                  statusDot[appt.status]
                )} />

                {/* Infos donneur */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {appt.donorName}
                    </p>
                    <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                      {appt.bloodGroup}
                    </span>
                    {appt.note && (
                      <span className="text-xs text-gray-500 italic truncate">
                        — {appt.note}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 font-mono">
                    {appt.donorId}
                  </p>
                </div>

                {/* Agent assigné */}
                <div className="shrink-0 text-right">
                  {appt.assignedTo ? (
                    <span className="text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                      {appt.assignedTo}
                    </span>
                  ) : appt.status !== "annule" ? (
                    <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      Non assigné
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Annulé</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}