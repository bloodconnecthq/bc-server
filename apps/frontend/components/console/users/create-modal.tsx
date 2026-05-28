"use client";

import { useState } from "react";
import { Modal, Select, ListBox, DatePicker, DateField, Calendar } from "@heroui/react";
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";
import clsx from "clsx";
import {
  Drop, Hospital, Health, Shield, People,
  ArrowRight2, ArrowLeft2, TickCircle, Eye, EyeSlash,
} from "iconsax-reactjs";
import type { CreateUserPayload } from "@/lib/api/consoleApi";

/* ── Role definitions ────────────────────────────────────────────── */
const ROLES = [
  {
    value: "donneur",
    label: "Donneur",
    desc: "Peut s'inscrire pour effectuer des dons de sang",
    icon: Drop,
    bg: "bg-red-50", border: "border-red-200", activeBorder: "border-red-500",
    iconColor: "#dc2626", textColor: "text-red-700",
  },
  {
    value: "infirmier",
    label: "Infirmier(e)",
    desc: "Personnel soignant attaché à un établissement",
    icon: People,
    bg: "bg-teal-50", border: "border-teal-200", activeBorder: "border-teal-500",
    iconColor: "#0d9488", textColor: "text-teal-700",
  },
  {
    value: "medecin",
    label: "Médecin",
    desc: "Médecin prescripteur attaché à un hôpital",
    icon: Health,
    bg: "bg-blue-50", border: "border-blue-200", activeBorder: "border-blue-500",
    iconColor: "#2563eb", textColor: "text-blue-700",
  },
  {
    value: "admin_hopital",
    label: "Admin Hôpital",
    desc: "Administrateur d'un établissement affilié",
    icon: Hospital,
    bg: "bg-purple-50", border: "border-purple-200", activeBorder: "border-purple-500",
    iconColor: "#7c3aed", textColor: "text-purple-700",
  },
  {
    value: "super_admin",
    label: "Super Admin",
    desc: "Accès complet à toute la plateforme",
    icon: Shield,
    bg: "bg-gray-100", border: "border-gray-300", activeBorder: "border-gray-600",
    iconColor: "#374151", textColor: "text-gray-700",
  },
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const HOSPITAL_ROLES = ["medecin", "infirmier", "admin_hopital"];

const SELECT_CLS = "w-full rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400 font-medium text-gray-800 text-sm shadow-none!";
const TRIGGER_CLS = "px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white data-[focused]:border-red-400 shadow-none!";

interface Props {
  hospitals: { id: string; nom: string }[];
  onClose: () => void;
  onCreate: (data: CreateUserPayload) => Promise<void>;
}

type Step = "role" | "details";

interface FormState {
  prenom: string; nom: string; email: string; motDePasse: string;
  telephone: string; commune: string; departement: string;
  hopitalId: string; groupeSanguin: string;
}

const EMPTY: FormState = {
  prenom: "", nom: "", email: "", motDePasse: "",
  telephone: "", commune: "", departement: "",
  hopitalId: "", groupeSanguin: "",
};

const maxDOB = today(getLocalTimeZone()).subtract({ years: 18 });

export function CreateUserModal({ hospitals, onClose, onCreate }: Props) {
  const [step,         setStep]         = useState<Step>("role");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [form,         setForm]         = useState<FormState>(EMPTY);
  const [dateNaissance, setDateNaissance] = useState<CalendarDate | null>(null);
  const [showPwd,      setShowPwd]      = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  const roleCfg    = ROLES.find((r) => r.value === selectedRole);
  const needsHosp  = selectedRole ? HOSPITAL_ROLES.includes(selectedRole) : false;
  const isDonneur  = selectedRole === "donneur";

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const canSubmit =
    form.prenom.trim() && form.nom.trim() && form.email.trim() &&
    form.motDePasse.length >= 8 && (!needsHosp || form.hopitalId);

  const handleSubmit = async () => {
    if (!selectedRole || !canSubmit) return;
    setSaving(true); setError(null);
    try {
      const dateNaissanceStr = dateNaissance
        ? `${dateNaissance.year}-${String(dateNaissance.month).padStart(2, "0")}-${String(dateNaissance.day).padStart(2, "0")}`
        : undefined;
      await onCreate({
        prenom: form.prenom.trim(), nom: form.nom.trim(),
        email: form.email.trim(), motDePasse: form.motDePasse,
        role: selectedRole,
        telephone:    form.telephone.trim()    || undefined,
        commune:      form.commune.trim()      || undefined,
        departement:  form.departement.trim()  || undefined,
        hopitalId:    form.hopitalId           || undefined,
        groupeSanguin:form.groupeSanguin       || undefined,
        dateNaissance: dateNaissanceStr,
      });
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "Une erreur est survenue");
    } finally { setSaving(false); }
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen onOpenChange={(open) => !open && onClose()} className="bg-gray-900/30 backdrop-blur-sm">
        <Modal.Container placement="center" size={step === "role" ? "md" : "lg"}>
          <Modal.Dialog className="rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <Modal.Body className="p-0">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {step === "details" && (
                    <button onClick={() => setStep("role")}
                      className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                      <ArrowLeft2 size={16} />
                    </button>
                  )}
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Créer un utilisateur</h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {step === "role" ? "Étape 1 — Choisir un rôle" : `Étape 2 — Informations · ${roleCfg?.label}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {(["role", "details"] as Step[]).map((s) => (
                      <div key={s} className={clsx(
                        "h-1.5 rounded-full transition-all",
                        step === s ? "w-6 bg-red-500" : s === "role" ? "w-2 bg-red-200" : "w-2 bg-gray-200"
                      )} />
                    ))}
                  </div>
                  <button onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-lg leading-none">
                    ×
                  </button>
                </div>
              </div>

              {/* Step 1 — Role picker */}
              {step === "role" && (
                <div className="p-6 space-y-4">
                  <p className="text-sm text-gray-500">Sélectionnez le type de compte à créer.</p>
                  <div className="grid grid-cols-1 gap-2.5">
                    {ROLES.map((r) => {
                      const Icon = r.icon;
                      const active = selectedRole === r.value;
                      return (
                        <button key={r.value} onClick={() => setSelectedRole(r.value)}
                          className={clsx(
                            "flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all",
                            active ? `${r.activeBorder} ${r.bg} shadow-sm` : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                          )}>
                          <div className={clsx("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", active ? r.bg : "bg-gray-100")}>
                            <Icon size={20} color={active ? r.iconColor : "#9ca3af"} variant={active ? "Bold" : "Linear"} />
                          </div>
                          <div className="flex-1">
                            <p className={clsx("text-sm font-bold", active ? r.textColor : "text-gray-800")}>{r.label}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{r.desc}</p>
                          </div>
                          {active && <TickCircle size={20} color={r.iconColor} variant="Bold" className="shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-end pt-2">
                    <button onClick={() => setStep("details")} disabled={!selectedRole}
                      className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 disabled:opacity-40 transition-colors">
                      Suivant <ArrowRight2 size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 — Details */}
              {step === "details" && roleCfg && (
                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

                  {/* Role badge */}
                  <div className={clsx("flex items-center gap-2.5 px-4 py-2.5 rounded-xl border", roleCfg.bg, roleCfg.border)}>
                    <roleCfg.icon size={15} color={roleCfg.iconColor} variant="Bold" />
                    <span className={clsx("text-xs font-bold", roleCfg.textColor)}>{roleCfg.label}</span>
                    <span className="text-xs text-gray-400 ml-1">— rôle sélectionné</span>
                  </div>

                  {error && (
                    <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">{error}</div>
                  )}

                  {/* Identité */}
                  <section className="space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Identité</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Prénom *">
                        <input type="text" placeholder="Adda" value={form.prenom} onChange={set("prenom")}
                          className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400 font-medium text-gray-800" />
                      </Field>
                      <Field label="Nom *">
                        <input type="text" placeholder="Christine" value={form.nom} onChange={set("nom")}
                          className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400 font-medium text-gray-800" />
                      </Field>
                    </div>
                    <Field label="Email *">
                      <input type="email" placeholder="adda.christine@email.com" value={form.email} onChange={set("email")}
                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400 font-medium text-gray-800" />
                    </Field>
                    <Field label="Mot de passe * (min. 8 caractères)">
                      <div className="relative">
                        <input
                          type={showPwd ? "text" : "password"}
                          placeholder="••••••••"
                          value={form.motDePasse}
                          onChange={set("motDePasse")}
                          className="w-full px-3 py-2.5 pr-10 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400 font-medium text-gray-800"
                        />
                        <button type="button" onClick={() => setShowPwd((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPwd ? <EyeSlash size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      {form.motDePasse.length > 0 && form.motDePasse.length < 8 && (
                        <p className="text-xs text-red-500 mt-1">Mot de passe trop court</p>
                      )}
                    </Field>
                  </section>

                  {/* Contact */}
                  <section className="space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact & Localisation</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Téléphone">
                        <input type="tel" placeholder="+229 97 00 00 00" value={form.telephone} onChange={set("telephone")}
                          className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400 font-medium text-gray-800" />
                      </Field>
                      <Field label="Commune">
                        <input type="text" placeholder="Cotonou" value={form.commune} onChange={set("commune")}
                          className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400 font-medium text-gray-800" />
                      </Field>
                    </div>
                    <Field label="Département">
                      <input type="text" placeholder="Atlantique" value={form.departement} onChange={set("departement")}
                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400 font-medium text-gray-800" />
                    </Field>
                  </section>

                  {/* Donneur extras */}
                  {isDonneur && (
                    <section className="space-y-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Profil donneur</p>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Groupe sanguin">
                          <Select
                            placeholder="— Groupe —"
                            value={form.groupeSanguin || null}
                            onChange={(key) => setForm((f) => ({ ...f, groupeSanguin: (key as string) ?? "" }))}
                            className={SELECT_CLS}
                          >
                            <Select.Trigger className={TRIGGER_CLS}>
                              <Select.Value />
                              <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                              <ListBox>
                                {BLOOD_GROUPS.map((g) => (
                                  <ListBox.Item key={g} id={g} textValue={g}>
                                    {g}
                                    <ListBox.ItemIndicator />
                                  </ListBox.Item>
                                ))}
                              </ListBox>
                            </Select.Popover>
                          </Select>
                        </Field>
                        <Field label="Date de naissance">
                          <DatePicker.Root
                            value={dateNaissance}
                            onChange={(val) => setDateNaissance(val as CalendarDate | null)}
                            maxValue={maxDOB}
                            granularity="day"
                            className="w-full"
                          >
                            <DateField.Group className="flex w-full items-center rounded-xl border border-gray-200 bg-white focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-500/10 overflow-hidden">
                              <DateField.InputContainer className="flex-1 px-3 py-2.5">
                                <DateField.Input className="flex gap-0.5">
                                  {(segment) => (
                                    <DateField.Segment
                                      segment={segment}
                                      className="text-sm font-medium text-gray-800 outline-none rounded px-0.5 focus:bg-red-100 focus:text-red-700 data-[type=literal]:text-gray-400"
                                    />
                                  )}
                                </DateField.Input>
                              </DateField.InputContainer>
                              <DatePicker.Trigger className="px-2.5 py-2 text-gray-400 hover:text-red-500 border-l border-gray-200 transition-colors">
                                <DatePicker.TriggerIndicator />
                              </DatePicker.Trigger>
                            </DateField.Group>
                            <DatePicker.Popover className="z-50">
                              <Calendar.Root className="p-3 bg-white rounded-2xl shadow-xl border border-gray-100">
                                <Calendar.Header className="flex items-center justify-between mb-3">
                                  <Calendar.NavButton slot="previous" className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 text-sm">‹</Calendar.NavButton>
                                  <Calendar.Heading className="text-sm font-semibold text-gray-800" />
                                  <Calendar.NavButton slot="next" className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 text-sm">›</Calendar.NavButton>
                                </Calendar.Header>
                                <Calendar.Grid>
                                  <Calendar.GridHeader>
                                    {(day) => (
                                      <Calendar.HeaderCell className="text-[10px] font-semibold text-gray-400 w-8 h-7 text-center">{day}</Calendar.HeaderCell>
                                    )}
                                  </Calendar.GridHeader>
                                  <Calendar.GridBody>
                                    {(date) => (
                                      <Calendar.Cell date={date} className="w-8 h-8 flex items-center justify-center text-sm rounded-lg cursor-pointer hover:bg-red-50 data-selected:bg-red-600 data-selected:text-white data-outside-month:text-gray-300 data-disabled:opacity-40 data-disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-red-400">
                                        <Calendar.CellIndicator />
                                      </Calendar.Cell>
                                    )}
                                  </Calendar.GridBody>
                                </Calendar.Grid>
                              </Calendar.Root>
                            </DatePicker.Popover>
                          </DatePicker.Root>
                        </Field>
                      </div>
                    </section>
                  )}

                  {/* Hospital assignment */}
                  {needsHosp && (
                    <section className="space-y-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Établissement *</p>
                      <Select
                        placeholder="— Choisir un établissement —"
                        value={form.hopitalId || null}
                        onChange={(key) => setForm((f) => ({ ...f, hopitalId: (key as string) ?? "" }))}
                        className={SELECT_CLS}
                      >
                        <Select.Trigger className={TRIGGER_CLS}>
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            {hospitals.map((h) => (
                              <ListBox.Item key={h.id} id={h.id} textValue={h.nom}>
                                {h.nom}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                      {!form.hopitalId && (
                        <p className="text-xs text-amber-600">Un établissement est requis pour ce rôle</p>
                      )}
                    </section>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <button onClick={() => setStep("role")}
                      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium">
                      <ArrowLeft2 size={14} /> Retour
                    </button>
                    <button onClick={handleSubmit} disabled={!canSubmit || saving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 disabled:opacity-40 transition-colors">
                      {saving
                        ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <TickCircle size={16} variant="Bold" />}
                      {saving ? "Création…" : "Créer le compte"}
                    </button>
                  </div>
                </div>
              )}

            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

/* ── Field wrapper ───────────────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      {children}
    </div>
  );
}
