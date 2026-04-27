"use client";

import { useState } from "react";
import { Button, Chip, Alert } from "@heroui/react";
import clsx from "clsx";

type AppointmentStatus = "planifie" | "confirme" | "annule" | "effectue";

interface Appointment {
  id: string;
  center: string;
  centerAddress: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  assignedTo: string | null;
  bloodGroup: string;
}

interface Center {
  id: string;
  name: string;
  address: string;
  commune: string;
  availableSlots: string[];
}

const statusConfig: {
  [key in AppointmentStatus]: {
    label: string;
    color: "warning" | "success" |  "primary" | "accent";
    emoji: string;
  };
} = {
  planifie:  { label: "Planifié",  color: "warning", emoji: "⏳" },
  confirme:  { label: "Confirmé",  color: "success", emoji: "✅" },
  annule:    { label: "Annulé",    color: "accent", emoji: "❌" },
  effectue:  { label: "Effectué",  color: "primary", emoji: "🩸" },
};

export function DonorAppointments({
  appointments,
  centers,
}: {
  appointments: Appointment[];
  centers: Center[];
}) {
  const [items, setItems] = useState(appointments);
  const [showForm, setShowForm] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handleBook = () => {
    if (!selectedCenter || !selectedDate || !selectedSlot) return;

    const newAppt: Appointment = {
      id: `RDV-${Math.floor(Math.random() * 9000) + 1000}`,
      center: selectedCenter.name,
      centerAddress: selectedCenter.address,
      date: selectedDate,
      time: selectedSlot,
      status: "planifie",
      assignedTo: null,
      bloodGroup: "O+",
    };

    setItems((prev) => [newAppt, ...prev]);
    setShowForm(false);
    setSelectedCenter(null);
    setSelectedDate("");
    setSelectedSlot("");
    setStep(1);
    setLastAction(`Rendez-vous pris au ${newAppt.center} le ${new Date(newAppt.date).toLocaleDateString("fr-FR")} à ${newAppt.time}.`);
    setTimeout(() => setLastAction(null), 4000);
  };

  const handleCancel = (id: string) => {
    setItems((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "annule" as AppointmentStatus } : a
      )
    );
    setLastAction("Rendez-vous annulé.");
    setTimeout(() => setLastAction(null), 3000);
  };

  // Générer les 14 prochains jours
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date("2026-04-28");
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split("T")[0];
  });

  return (
    <div className="space-y-6">
      {lastAction && (
        <Alert status="success">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{lastAction}</Alert.Title>
          </Alert.Content>
        </Alert>
      )}

      {/* Bouton prendre RDV */}
      {!showForm && (
        <Button
          variant="primary"
          fullWidth
          onPress={() => setShowForm(true)}
          className="bg-red-600 text-white rounded-2xl py-3 font-semibold"
        >
          + Prendre un rendez-vous
        </Button>
      )}

      {/* Formulaire de prise de RDV en 3 étapes */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Nouveau rendez-vous
            </h3>
            <Button
              size="sm"
              variant="ghost"
              onPress={() => { setShowForm(false); setStep(1); }}
              className="text-gray-400 text-xs"
            >
              Annuler
            </Button>
          </div>

          {/* Indicateur d'étapes */}
          <div className="flex border-b border-gray-100">
            {[
              { n: 1, label: "Centre" },
              { n: 2, label: "Date" },
              { n: 3, label: "Horaire" },
            ].map((s) => (
              <div
                key={s.n}
                className={clsx(
                  "flex-1 py-3 text-center text-xs font-semibold border-b-2",
                  step === s.n
                    ? "border-red-600 text-red-600"
                    : step > s.n
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-400"
                )}
              >
                {step > s.n ? "✓ " : `${s.n}. `}{s.label}
              </div>
            ))}
          </div>

          <div className="px-6 py-5 space-y-3">
            {/* Étape 1 — Choisir le centre */}
            {step === 1 && (
              <>
                <p className="text-sm text-gray-600 mb-3">
                  Choisissez un centre de collecte :
                </p>
                {centers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCenter(c)}
                    className={clsx(
                      "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                      selectedCenter?.id === c.id
                        ? "border-red-400 bg-red-50 ring-1 ring-red-200"
                        : "border-gray-100 hover:border-gray-200"
                    )}
                  >
                    <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center text-lg shrink-0">
                      🏥
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {c.name}
                      </p>
                      <p className="text-xs text-gray-400">{c.address}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {c.availableSlots.length} créneaux disponibles
                      </p>
                    </div>
                  </div>
                ))}
                <Button
                  variant="primary"
                  fullWidth
                  isDisabled={!selectedCenter}
                  onPress={() => setStep(2)}
                  className="bg-red-600 text-white rounded-xl mt-2 font-semibold"
                >
                  Continuer →
                </Button>
              </>
            )}

            {/* Étape 2 — Choisir la date */}
            {step === 2 && (
              <>
                <p className="text-sm text-gray-600 mb-3">
                  Choisissez une date :
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {availableDates.map((d) => {
                    const date = new Date(d);
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    return (
                      <button
                        key={d}
                        disabled={isWeekend}
                        onClick={() => setSelectedDate(d)}
                        className={clsx(
                          "p-3 rounded-xl border text-center transition-all",
                          isWeekend
                            ? "opacity-30 cursor-not-allowed bg-gray-50"
                            : selectedDate === d
                            ? "border-red-400 bg-red-50 ring-1 ring-red-200"
                            : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        <p className="text-xs text-gray-400">
                          {date.toLocaleDateString("fr-FR", { weekday: "short" })}
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                          {date.getDate()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {date.toLocaleDateString("fr-FR", { month: "short" })}
                        </p>
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onPress={() => setStep(1)}
                    className="rounded-xl text-xs flex-1"
                  >
                    ← Retour
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    isDisabled={!selectedDate}
                    onPress={() => setStep(3)}
                    className="bg-red-600 text-white rounded-xl text-xs flex-1"
                  >
                    Continuer →
                  </Button>
                </div>
              </>
            )}

            {/* Étape 3 — Choisir l'horaire */}
            {step === 3 && selectedCenter && (
              <>
                <p className="text-sm text-gray-600 mb-3">
                  Choisissez un créneau horaire :
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {selectedCenter.availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={clsx(
                        "py-3 rounded-xl border text-sm font-semibold transition-all",
                        selectedSlot === slot
                          ? "border-red-400 bg-red-50 text-red-700 ring-1 ring-red-200"
                          : "border-gray-100 text-gray-700 hover:border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                {/* Récapitulatif */}
                {selectedSlot && (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200 mt-2">
                    <p className="text-xs font-semibold text-green-700 mb-2">
                      Récapitulatif
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {selectedCenter.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(selectedDate).toLocaleDateString("fr-FR", {
                        weekday: "long", day: "2-digit", month: "long"
                      })} à {selectedSlot}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onPress={() => setStep(2)}
                    className="rounded-xl text-xs flex-1"
                  >
                    ← Retour
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    isDisabled={!selectedSlot}
                    onPress={handleBook}
                    className="bg-red-600 text-white rounded-xl text-xs flex-1 font-semibold"
                  >
                    Confirmer le RDV
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Liste des RDV existants */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">
          Mes rendez-vous ({items.length})
        </h3>
        {items.length === 0 && (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
            <p className="text-2xl mb-2">📅</p>
            <p className="text-sm text-gray-400">
              Vous n'avez pas encore de rendez-vous
            </p>
          </div>
        )}
        {items.map((appt) => {
          const sConfig = statusConfig[appt.status];
          return (
            <div
              key={appt.id}
              className="bg-white rounded-2xl border border-gray-100 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-lg shrink-0">
                    🏥
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-gray-900">
                        {appt.center}
                      </p>
                      <Chip size="sm" color={sConfig.color}>
                        {sConfig.label}
                      </Chip>
                    </div>
                    <p className="text-xs text-gray-400">{appt.centerAddress}</p>
                    <p className="text-sm font-semibold text-gray-700 mt-1">
                      {new Date(appt.date).toLocaleDateString("fr-FR", {
                        weekday: "long", day: "2-digit", month: "long"
                      })} · {appt.time}
                    </p>
                    {appt.assignedTo && (
                      <p className="text-xs text-green-600 mt-0.5">
                        Agent : {appt.assignedTo}
                      </p>
                    )}
                  </div>
                </div>

                {appt.status === "planifie" && (
                  <Button
                    size="sm"
                    variant="danger"
                    onPress={() => handleCancel(appt.id)}
                    className="rounded-xl text-xs shrink-0"
                  >
                    Annuler
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}