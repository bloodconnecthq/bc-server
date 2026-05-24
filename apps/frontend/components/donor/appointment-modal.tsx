"use client";

import { useState } from "react";
import {
  Modal,
  Button,
  Select,
  ListBox,
  Label,
} from "@heroui/react";
import clsx from "clsx";
import type { CenterData } from "@/lib/api/hospitalApi";
import { createAppointment } from "@/lib/api/appointmentApi";

const SLOTS = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

function buildAvailableDates() {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split("T")[0];
  });
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  centers: CenterData[];
  token: string | null;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export function AppointmentModal({
  isOpen,
  onClose,
  centers,
  token,
  onSuccess,
  onError,
}: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCenterId, setSelectedCenterId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const selectedCenter = centers.find((c) => c.id === selectedCenterId);
  const availableDates = buildAvailableDates();

  const reset = () => {
    setStep(1);
    setSelectedCenterId("");
    setSelectedDate("");
    setSelectedSlot("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleBook = async () => {
    if (!selectedCenterId || !selectedDate || !selectedSlot || !token) return;
    setIsBooking(true);
    try {
      await createAppointment(
        { hopitalId: selectedCenterId, dateRdv: `${selectedDate}T${selectedSlot}:00` },
        token
      );
      handleClose();
      onSuccess(
        `RDV planifié au ${selectedCenter?.nom ?? "centre"} le ${new Date(selectedDate).toLocaleDateString("fr-FR")} à ${selectedSlot}.`
      );
    } catch (err) {
      onError(err instanceof Error ? err.message : "Erreur lors de la prise de rendez-vous");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <Modal.Container placement="center" size="md">
          <Modal.Dialog className="rounded-2xl">
            {/* Header */}
            <Modal.Header className="border-b border-gray-100 pb-4">
              <div>
                <Modal.Heading className="text-base font-bold text-gray-900">
                  Prendre un rendez-vous
                </Modal.Heading>
                <p className="text-xs text-gray-400 mt-0.5">Étape {step} sur 3</p>
              </div>
            </Modal.Header>

            {/* Body */}
            <Modal.Body className="py-6 space-y-5">
              {/* Barre de progression */}
              <div className="flex gap-1.5">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className={clsx(
                      "flex-1 h-1.5 rounded-full transition-all duration-300",
                      step >= n ? "bg-red-500" : "bg-gray-100"
                    )}
                  />
                ))}
              </div>

              {/* Étape 1 — Centre */}
              {step === 1 && (
                <div className="space-y-3">
                  <Select
                    fullWidth
                    placeholder="Sélectionner un centre..."
                    value={selectedCenterId || null}
                    onChange={(key) => setSelectedCenterId(key as string ?? "")}
                  >
                    <Label className="text-sm font-semibold text-gray-700">
                      Centre de collecte
                    </Label>
                    <Select.Trigger className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm shadow-none!">
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {centers.map((c) => (
                          <ListBox.Item key={c.id} id={c.id} textValue={c.nom}>
                            <div className="py-1">
                              <p className="text-sm font-medium text-gray-900">{c.nom}</p>
                              <p className="text-xs text-gray-400">
                                {c.commune}{c.adresse ? ` — ${c.adresse}` : ""}
                              </p>
                            </div>
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  {selectedCenter && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-3">
                      <span className="text-lg">🏥</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{selectedCenter.nom}</p>
                        {selectedCenter.telephone && (
                          <p className="text-xs text-gray-400">{selectedCenter.telephone}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Étape 2 — Date */}
              {step === 2 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-700">Choisissez une date</p>
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
                          <p className="text-sm font-bold text-gray-900">{date.getDate()}</p>
                          <p className="text-xs text-gray-400">
                            {date.toLocaleDateString("fr-FR", { month: "short" })}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Étape 3 — Créneau */}
              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-gray-700">Choisissez un créneau</p>
                  <div className="grid grid-cols-3 gap-2">
                    {SLOTS.map((slot) => (
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

                  {selectedSlot && (
                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                      <p className="text-xs font-semibold text-green-700 mb-1">Récapitulatif</p>
                      <p className="text-sm font-bold text-gray-900">{selectedCenter?.nom}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(selectedDate).toLocaleDateString("fr-FR", {
                          weekday: "long",
                          day: "2-digit",
                          month: "long",
                        })}{" "}
                        à {selectedSlot}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Modal.Body>

            {/* Footer */}
            <Modal.Footer className="border-t border-gray-100 gap-2">
              {step > 1 && (
                <Button
                  variant="outline"
                  onPress={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                  isDisabled={isBooking}
                  className="rounded-xl flex-1"
                >
                  ← Retour
                </Button>
              )}
              {step < 3 ? (
                <Button
                  isDisabled={
                    (step === 1 && !selectedCenterId) ||
                    (step === 2 && !selectedDate)
                  }
                  onPress={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
                  className="bg-red-600 text-white rounded-xl flex-1 font-semibold"
                >
                  Continuer →
                </Button>
              ) : (
                <Button
                  isDisabled={!selectedSlot || isBooking}
                  onPress={handleBook}
                  className="bg-red-600 text-white rounded-xl flex-1 font-semibold"
                >
                  {isBooking ? "Enregistrement..." : "Confirmer le RDV"}
                </Button>
              )}
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
