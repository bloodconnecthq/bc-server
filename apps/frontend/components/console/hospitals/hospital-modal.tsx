"use client";

import { useEffect, useState } from "react";
import { CloseCircle, Hospital } from "iconsax-reactjs";
import clsx from "clsx";
import type { HopitalAPI, HospitalPayload } from "@/lib/api/consoleApi";

// ── Type config ─────────────────────────────────────────────────────────────

type HospitalType = "cnts" | "chu" | "antenne" | "hopital" | "centre" | "mobile";

const TYPE_OPTIONS: {
  value: HospitalType;
  label: string;
  desc: string;
  bg: string;
  text: string;
  ring: string;
}[] = [
  { value: "cnts",    label: "CNTS",    desc: "Centre National",     bg: "bg-red-50",    text: "text-red-700",    ring: "ring-red-400"    },
  { value: "chu",     label: "CHU",     desc: "Univ. Hospitalier",   bg: "bg-blue-50",   text: "text-blue-700",   ring: "ring-blue-400"   },
  { value: "antenne", label: "Antenne", desc: "Antenne régionale",   bg: "bg-purple-50", text: "text-purple-700", ring: "ring-purple-400" },
  { value: "hopital", label: "Hôpital", desc: "Hôpital général",     bg: "bg-green-50",  text: "text-green-700",  ring: "ring-green-400"  },
  { value: "centre",  label: "Centre",  desc: "Centre de collecte",  bg: "bg-amber-50",  text: "text-amber-700",  ring: "ring-amber-400"  },
  { value: "mobile",  label: "Mobile",  desc: "Unité mobile",        bg: "bg-gray-100",  text: "text-gray-600",   ring: "ring-gray-400"   },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function emptyForm(): HospitalPayload {
  return {
    nom: "", type: "hopital", adresse: "", commune: "",
    departement: "", telephone: "", email: "",
    latitude: null, longitude: null,
  };
}

function fromApi(h: HopitalAPI): HospitalPayload {
  return {
    nom:         h.nom,
    type:        h.type ?? "hopital",
    adresse:     h.adresse    ?? "",
    commune:     h.commune    ?? "",
    departement: h.departement ?? "",
    telephone:   h.telephone  ?? "",
    email:       h.email      ?? "",
    latitude:    null,
    longitude:   null,
  };
}

// ── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all placeholder:text-gray-300";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-500">{label}</label>
      {children}
    </div>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────

interface HospitalModalProps {
  /** null = create mode, object = edit mode */
  hospital: HopitalAPI | null | "new";
  onClose: () => void;
  onSave: (data: HospitalPayload, id?: string) => Promise<void>;
}

export function HospitalModal({ hospital, onClose, onSave }: HospitalModalProps) {
  const isEdit = hospital !== null && hospital !== "new";
  const [form, setForm]   = useState<HospitalPayload>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    if (hospital === "new" || hospital === null) {
      setForm(emptyForm());
    } else {
      setForm(fromApi(hospital));
    }
    setError(null);
  }, [hospital]);

  if (hospital === null) return null;

  const set = (field: keyof HospitalPayload) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async () => {
    if (!form.nom.trim()) { setError("Le nom de l'établissement est requis."); return; }
    setSaving(true);
    setError(null);
    try {
      // Strip empty strings to null for optional fields
      const payload: HospitalPayload = {
        ...form,
        adresse:     form.adresse     || undefined,
        commune:     form.commune     || undefined,
        departement: form.departement || undefined,
        telephone:   form.telephone   || undefined,
        email:       form.email       || undefined,
        latitude:    form.latitude    || null,
        longitude:   form.longitude   || null,
      };
      await onSave(payload, isEdit ? (hospital as HopitalAPI).id : undefined);
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "Une erreur est survenue");
    } finally {
      setSaving(false);
    }
  };

  const selectedType = TYPE_OPTIONS.find((t) => t.value === form.type)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center", selectedType.bg)}>
              <Hospital size={20} className={selectedType.text} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {isEdit ? "Modifier l'établissement" : "Ajouter un établissement"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {isEdit
                  ? `Mise à jour des informations · ${(hospital as HopitalAPI).nom}`
                  : "Remplissez les informations de base et le contact"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <CloseCircle size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 space-y-6 flex-1">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Type selector */}
          <Section title="Type d'établissement">
            <div className="grid grid-cols-3 gap-2">
              {TYPE_OPTIONS.map((t) => {
                const active = form.type === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                    className={clsx(
                      "flex flex-col items-start gap-0.5 px-3.5 py-3 rounded-xl border-2 text-left transition-all",
                      active
                        ? `border-current ring-0 ${t.bg} ${t.text}`
                        : "border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <span className="text-xs font-bold">{t.label}</span>
                    <span className="text-xs opacity-70">{t.desc}</span>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Nom */}
          <Section title="Informations générales">
            <Field label="Nom de l'établissement *">
              <input
                type="text"
                className={inputClass}
                placeholder="ex: Hôpital de Zone de Calavi"
                value={form.nom}
                onChange={set("nom")}
              />
            </Field>
          </Section>

          {/* Localisation */}
          <Section title="Localisation">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Commune">
                <input
                  type="text"
                  className={inputClass}
                  placeholder="ex: Abomey-Calavi"
                  value={form.commune ?? ""}
                  onChange={set("commune")}
                />
              </Field>
              <Field label="Département">
                <input
                  type="text"
                  className={inputClass}
                  placeholder="ex: Atlantique"
                  value={form.departement ?? ""}
                  onChange={set("departement")}
                />
              </Field>
            </div>
            <Field label="Adresse complète">
              <input
                type="text"
                className={inputClass}
                placeholder="ex: 12 Rue de l'Indépendance, Cotonou"
                value={form.adresse ?? ""}
                onChange={set("adresse")}
              />
            </Field>
          </Section>

          {/* Contact */}
          <Section title="Contact">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Téléphone">
                <input
                  type="tel"
                  className={inputClass}
                  placeholder="+229 ..."
                  value={form.telephone ?? ""}
                  onChange={set("telephone")}
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  className={inputClass}
                  placeholder="contact@hopital.bj"
                  value={form.email ?? ""}
                  onChange={set("email")}
                />
              </Field>
            </div>
          </Section>

          {/* GPS */}
          <Section title="Coordonnées GPS (optionnel)">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Latitude">
                <input
                  type="number"
                  step="any"
                  className={inputClass}
                  placeholder="6.3654"
                  value={form.latitude ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      latitude: e.target.value ? parseFloat(e.target.value) : null,
                    }))
                  }
                />
              </Field>
              <Field label="Longitude">
                <input
                  type="number"
                  step="any"
                  className={inputClass}
                  placeholder="2.4183"
                  value={form.longitude ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      longitude: e.target.value ? parseFloat(e.target.value) : null,
                    }))
                  }
                />
              </Field>
            </div>
            <p className="text-xs text-gray-400">
              Utilisées pour afficher l'établissement sur la carte des centres proches.
            </p>
          </Section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0 rounded-b-2xl">
          <p className="text-xs text-gray-400">* Champ obligatoire</p>
          <div className="flex gap-3">
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
              className={clsx(
                "px-5 py-2 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2",
                isEdit ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"
              )}
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  {isEdit ? "Modification..." : "Création..."}
                </>
              ) : (
                isEdit ? "Enregistrer" : "Créer l'établissement"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
