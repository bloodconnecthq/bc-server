"use client";

import { Modal } from "@heroui/react";
import { Trash, Warning2 } from "iconsax-reactjs";

interface Props {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
  variant?: "danger" | "warning";
}

export function ConfirmModal({
  isOpen, title, description,
  confirmLabel = "Supprimer",
  onConfirm, onClose,
  loading = false,
  variant = "danger",
}: Props) {
  const isDanger = variant === "danger";

  return (
    <Modal>
      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={(open) => !open && !loading && onClose()}
        className="bg-gray-900/30 backdrop-blur-sm"
      >
        <Modal.Container placement="center" size="sm">
          <Modal.Dialog className="rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <Modal.Body className="p-6 space-y-5">
              {/* Icon + Title */}
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isDanger ? "bg-red-100" : "bg-amber-100"}`}>
                  {isDanger
                    ? <Trash size={20} color="#dc2626" variant="Bold" />
                    : <Warning2 size={20} color="#d97706" variant="Bold" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Cette action est irréversible</p>
                </div>
              </div>

              {/* Body */}
              <p className="text-sm text-gray-600 leading-relaxed">{description}</p>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 ${isDanger ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"}`}
                >
                  {loading && (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {confirmLabel}
                </button>
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
