"use client";

import { useEffect, useState } from "react";
import { CloseCircle } from "iconsax-reactjs";
import clsx from "clsx";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

interface EditDonorData {
  prenom: string;
  nom: string;
  groupeSanguin: string;
  telephone: string;
  commune: string;
  departement: string;
  dateNaissance: string;
}

interface EditDonorModalProps {
  donor: {
    _id?: string;
    id: string;
    firstName: string;
    lastName: string;
    bloodGroup: string;
    phone: string;
    commune: string;
    department: string;
    registeredAt?: string;
  } | null;
  onClose: () => void;
  onSave: (id: string, data: EditDonorData) => Promise<void>;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all placeholder:text-gray-300";

export function EditDonorModal({ donor, onClose, onSave }: EditDonorModalProps) {
  const [form, setForm] = useState<EditDonorData>({
    prenom: "",
    nom: "",
    groupeSanguin: "",
    telephone: "",
    commune: "",
    departement: "",
    dateNaissance: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (donor) {
      setForm({
        prenom: donor.firstName,
        nom: donor.lastName,
        groupeSanguin: donor.bloodGroup === "?" ? "" : donor.bloodGroup,
        telephone: donor.phone,
        commune: donor.commune,
        departement: donor.department,
        dateNaissance: "",
      });
      setError(null);
    }
  }, [donor]);

  if (!donor) return null;

  const realId = donor._id ?? donor.id;

  const set = (field: keyof EditDonorData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSave(realId, form);
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "Une erreur est survenue");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Modifier le donneur
            </h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{donor.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <CloseCircle size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prénom">
              <input
                type="text"
                className={inputClass}
                placeholder="Prénom"
                value={form.prenom}
                onChange={set("prenom")}
              />
            </Field>
            <Field label="Nom">
              <input
                type="text"
                className={inputClass}
                placeholder="Nom de famille"
                value={form.nom}
                onChange={set("nom")}
              />
            </Field>
          </div>

          {/* Blood group + phone */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Groupe sanguin">
              <select
                className={clsx(inputClass, "cursor-pointer")}
                value={form.groupeSanguin}
                onChange={set("groupeSanguin")}
              >
                <option value="">— Sélectionner —</option>
                {BLOOD_GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Téléphone">
              <input
                type="tel"
                className={inputClass}
                placeholder="+229 ..."
                value={form.telephone}
                onChange={set("telephone")}
              />
            </Field>
          </div>

          {/* Commune + Department */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Commune">
              <input
                type="text"
                className={inputClass}
                placeholder="Commune"
                value={form.commune}
                onChange={set("commune")}
              />
            </Field>
            <Field label="Département">
              <input
                type="text"
                className={inputClass}
                placeholder="Département"
                value={form.departement}
                onChange={set("departement")}
              />
            </Field>
          </div>

          {/* Date of birth */}
          <Field label="Date de naissance">
            <input
              type="date"
              className={inputClass}
              value={form.dateNaissance}
              onChange={set("dateNaissance")}
            />
          </Field>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
