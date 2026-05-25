"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import {
  SearchNormal1, TickCircle, CloseCircle, ArrowRight2, ArrowLeft2,
  Drop, User, ClipboardText, Warning2,
} from "iconsax-reactjs";
import { getDonneurs, type DonneurAPI } from "@/lib/api/consoleApi";
import { createDon, type CreateDonPayload } from "@/lib/api/hospitalApi";

// ── Questionnaire definition ─────────────────────────────────────────────────

interface Question {
  id: string;
  label: string;
  sublabel?: string;
  type: "boolean" | "multi";
  options?: string[];
  bloquant: boolean;
  bloquantSi: boolean | string[];
  femme?: boolean;
}

const QUESTIONS: Question[] = [
  {
    id: "don_precedent",
    label: "Avez-vous déjà donné du sang ?",
    sublabel: "Si oui, votre dernier don s'est-il bien déroulé ?",
    type: "boolean",
    bloquant: false,
    bloquantSi: false,
  },
  {
    id: "transfusion",
    label: "Avez-vous reçu une transfusion, une greffe ou subi une opération récente ?",
    type: "boolean",
    bloquant: true,
    bloquantSi: true,
  },
  {
    id: "medicaments",
    label: "Prenez-vous actuellement des médicaments ?",
    type: "boolean",
    bloquant: false,
    bloquantSi: false,
  },
  {
    id: "vaccin_recent",
    label: "Avez-vous été vacciné il y a moins de 3 mois ?",
    type: "boolean",
    bloquant: true,
    bloquantSi: true,
  },
  {
    id: "soins_dentaires",
    label: "Avez-vous reçu des soins dentaires il y a moins de 3 mois ?",
    type: "boolean",
    bloquant: true,
    bloquantSi: true,
  },
  {
    id: "maladies_chroniques",
    label: "Souffrez-vous d'une des maladies suivantes ?",
    sublabel: "Sélectionnez tout ce qui s'applique",
    type: "multi",
    options: ["Épilepsie", "Diabète", "Hypertension", "Anémie", "Drépanocytose", "Maladie du cœur", "Aucune"],
    bloquant: true,
    bloquantSi: ["Épilepsie", "Diabète", "Hypertension", "Anémie", "Drépanocytose", "Maladie du cœur"],
  },
  {
    id: "symptomes_actuels",
    label: "Avez-vous des symptômes en ce moment ?",
    sublabel: "Sélectionnez tout ce qui s'applique",
    type: "multi",
    options: ["Fièvre", "Diarrhée", "Toux persistante", "Vertige", "Fatigue excessive", "Aucun"],
    bloquant: true,
    bloquantSi: ["Fièvre", "Diarrhée", "Toux persistante", "Vertige", "Fatigue excessive"],
  },
  {
    id: "comportements_risque",
    label: "Avez-vous eu des comportements à risque ces 3 derniers mois ?",
    sublabel: "Sélectionnez tout ce qui s'applique",
    type: "multi",
    options: ["Tatouage / piercing / scarification", "Partenaires multiples", "Blessure avec objet usagé", "Séjour à l'étranger", "Aucun"],
    bloquant: true,
    bloquantSi: ["Tatouage / piercing / scarification", "Partenaires multiples", "Blessure avec objet usagé", "Séjour à l'étranger"],
  },
  {
    id: "grossesse",
    label: "Êtes-vous enceinte ou avez-vous accouché il y a moins de 6 mois ?",
    sublabel: "Question réservée aux femmes",
    type: "boolean",
    bloquant: true,
    bloquantSi: true,
    femme: true,
  },
];

type Reponse = boolean | string[] | null;

// ── Helper ───────────────────────────────────────────────────────────────────

function isBloquant(q: Question, val: Reponse): boolean {
  if (!q.bloquant || val === null) return false;
  if (q.type === "boolean") return val === q.bloquantSi;
  if (q.type === "multi" && Array.isArray(val) && Array.isArray(q.bloquantSi)) {
    return val.some((v) => (q.bloquantSi as string[]).includes(v));
  }
  return false;
}

// ── Step 1 — Sélectionner le donneur ─────────────────────────────────────────

interface Step1Props {
  token: string;
  onSelect: (d: DonneurAPI) => void;
}

function Step1SelectDonor({ token, onSelect }: Step1Props) {
  const [donors, setDonors]   = useState<DonneurAPI[]>([]);
  const [query, setQuery]     = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDonneurs(token)
      .then(setDonors)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = donors.filter((d) => {
    const q = query.toLowerCase();
    return (
      d.codeDonneur?.toLowerCase().includes(q) ||
      d.utilisateur?.nomComplet?.toLowerCase().includes(q) ||
      d.utilisateur?.prenom?.toLowerCase().includes(q) ||
      d.utilisateur?.nom?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-gray-900">Sélectionner un donneur</h3>
        <p className="text-xs text-gray-400 mt-0.5">Recherchez par code ou nom</p>
      </div>

      <div className="relative">
        <SearchNormal1 size={16} color="#9ca3af" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Code donneur ou nom..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
        />
      </div>

      <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 rounded-xl border border-gray-100">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-3 animate-pulse">
              <div className="w-9 h-9 bg-gray-100 rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-100 rounded w-1/3" />
                <div className="h-2.5 bg-gray-100 rounded w-1/4" />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-gray-400">Aucun donneur trouvé</div>
        ) : filtered.slice(0, 50).map((d) => {
          const eligible = d.estEligible;
          return (
            <button
              key={d._id ?? d.id}
              disabled={!eligible}
              onClick={() => onSelect(d)}
              className={clsx(
                "w-full px-4 py-3 flex items-center gap-3 text-left transition-all",
                eligible
                  ? "hover:bg-red-50 cursor-pointer"
                  : "opacity-50 cursor-not-allowed bg-gray-50"
              )}
            >
              <div className={clsx(
                "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0",
                eligible ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-400"
              )}>
                {d.groupeSanguin ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {(d.utilisateur?.nomComplet ?? `${d.utilisateur?.prenom ?? ""} ${d.utilisateur?.nom ?? ""}`.trim()) || "—"}
                </p>
                <p className="text-xs text-gray-400">{d.codeDonneur} · {d.totalDons} don{d.totalDons !== 1 ? "s" : ""}</p>
              </div>
              {!eligible && (
                <span className="text-xs text-red-500 font-medium shrink-0">Non éligible</span>
              )}
              {eligible && (
                <ArrowRight2 size={14} color="#dc2626" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 2 — Questionnaire médical ────────────────────────────────────────────

interface Step2Props {
  donor: DonneurAPI;
  onBack: () => void;
  onNext: (reponses: Record<string, Reponse>) => void;
}

function Step2Questionnaire({ donor, onBack, onNext }: Step2Props) {
  const [reponses, setReponses] = useState<Record<string, Reponse>>({});
  const [step, setStep]         = useState(0);

  const questions = QUESTIONS;
  const current   = questions[step];
  if (!current) return null;

  const val    = reponses[current.id] ?? null;
  const bloque = isBloquant(current, val);
  const answered = val !== null && (Array.isArray(val) ? val.length > 0 : true);

  const setVal = (v: Reponse) => setReponses((r) => ({ ...r, [current.id]: v }));

  const toggleMulti = (opt: string) => {
    const prev = (reponses[current.id] as string[]) ?? [];
    if (opt === "Aucune" || opt === "Aucun") {
      setVal([opt]);
      return;
    }
    const filtered = prev.filter((x) => x !== "Aucune" && x !== "Aucun");
    setVal(filtered.includes(opt) ? filtered.filter((x) => x !== opt) : [...filtered, opt]);
  };

  const handleNext = () => {
    if (bloque) return;
    if (step < questions.length - 1) setStep(step + 1);
    else onNext(reponses);
  };

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-400">
            Question {step + 1} / {questions.length}
          </p>
          <p className="text-xs text-gray-400">
            {donor.utilisateur?.nomComplet ?? donor.codeDonneur}
          </p>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-500 rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="min-h-55 flex flex-col justify-center">
        <p className="text-base font-bold text-gray-900 leading-snug">{current.label}</p>
        {current.sublabel && (
          <p className="text-xs text-gray-400 mt-1">{current.sublabel}</p>
        )}

        <div className="mt-5 space-y-2.5">
          {current.type === "boolean" ? (
            <div className="flex gap-3">
              {[{ v: true, label: "Oui" }, { v: false, label: "Non" }].map(({ v, label }) => (
                <button
                  key={String(v)}
                  type="button"
                  onClick={() => setVal(v)}
                  className={clsx(
                    "flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all",
                    val === v
                      ? v
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-100 text-gray-600 hover:border-gray-200"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {current.options?.map((opt) => {
                const selected = ((reponses[current.id] as string[]) ?? []).includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleMulti(opt)}
                    className={clsx(
                      "py-2.5 px-3 rounded-xl border-2 text-xs font-semibold text-left transition-all",
                      selected
                        ? opt === "Aucune" || opt === "Aucun"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-red-400 bg-red-50 text-red-700"
                        : "border-gray-100 text-gray-600 hover:border-gray-200"
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Warning if blocking */}
        {bloque && answered && (
          <div className="mt-4 flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <Warning2 size={16} color="#dc2626" variant="Bold" className="shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 font-medium leading-relaxed">
              Cette réponse indique une contre-indication temporaire au don de sang.
              Le don ne peut pas être enregistré. Veuillez orienter le donneur vers un médecin.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={step === 0 ? onBack : () => setStep(step - 1)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
        >
          <ArrowLeft2 size={14} />
          {step === 0 ? "Retour" : "Précédent"}
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!answered || bloque}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {step < questions.length - 1 ? (
            <>Suivant <ArrowRight2 size={14} color="white" /></>
          ) : (
            <>Continuer <ArrowRight2 size={14} color="white" /></>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Step 3 — Infos du don ─────────────────────────────────────────────────────

interface DonInfo { typePoche: "DCL" | "PCL"; volume: number; dateDon: string; }

interface Step3Props {
  donor: DonneurAPI;
  hopitalId: string;
  reponses: Record<string, Reponse>;
  onBack: () => void;
  onSubmit: (info: DonInfo) => Promise<void>;
}

function Step3DonInfo({ donor, onBack, onSubmit }: Step3Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [info, setInfo] = useState<DonInfo>({ typePoche: "DCL", volume: 450, dateDon: today });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(info);
    } catch (err: any) {
      setError(err?.message ?? "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h3 className="text-base font-bold text-gray-900">Informations du don</h3>
        <p className="text-xs text-gray-400 mt-0.5">
          {donor.utilisateur?.nomComplet ?? donor.codeDonneur} · {donor.groupeSanguin}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Type de poche */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">Type de poche</label>
        <div className="grid grid-cols-2 gap-3">
          {(["DCL", "PCL"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setInfo((i) => ({ ...i, typePoche: t }))}
              className={clsx(
                "py-3 rounded-xl border-2 text-sm font-bold transition-all",
                info.typePoche === t
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-100 text-gray-600 hover:border-gray-200"
              )}
            >
              {t}
              <span className="block text-xs font-normal mt-0.5 text-current opacity-70">
                {t === "DCL" ? "Don de sang complet" : "Poche de concentré leucocytaire"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Volume */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">Volume (mL)</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setInfo((i) => ({ ...i, volume: Math.max(200, i.volume - 50) }))}
            className="w-10 h-10 rounded-xl border border-gray-200 text-lg font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center"
          >
            −
          </button>
          <span className="flex-1 text-center text-3xl font-black text-red-600">{info.volume}</span>
          <button
            type="button"
            onClick={() => setInfo((i) => ({ ...i, volume: Math.min(600, i.volume + 50) }))}
            className="w-10 h-10 rounded-xl border border-gray-200 text-lg font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center"
          >
            +
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-1">mL de sang prélevé</p>
      </div>

      {/* Date */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Date du don</label>
        <input
          type="date"
          value={info.dateDon}
          max={today}
          onChange={(e) => setInfo((i) => ({ ...i, dateDon: e.target.value }))}
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
        >
          <ArrowLeft2 size={14} />
          Retour
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all disabled:opacity-60"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : <Drop size={14} color="white" variant="Bold" />}
          Enregistrer le don
        </button>
      </div>
    </form>
  );
}

// ── Step 4 — Succès ───────────────────────────────────────────────────────────

function Step4Success({ donor, onClose }: { donor: DonneurAPI; onClose: () => void }) {
  return (
    <div className="text-center space-y-4 py-4">
      <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto">
        <TickCircle size={36} color="#16a34a" variant="Bold" />
      </div>
      <div>
        <p className="text-lg font-black text-gray-900">Don enregistré !</p>
        <p className="text-sm text-gray-400 mt-1">
          Le don de <span className="font-semibold text-gray-700">
            {donor.utilisateur?.nomComplet ?? donor.codeDonneur}
          </span> est en attente de validation.
        </p>
      </div>
      <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Donneur</span>
          <span className="font-semibold text-gray-700">{donor.codeDonneur}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Groupe sanguin</span>
          <span className="font-semibold text-red-600">{donor.groupeSanguin ?? "—"}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Statut</span>
          <span className="font-semibold text-amber-600">En attente de validation</span>
        </div>
      </div>
      <button
        onClick={onClose}
        className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all"
      >
        Fermer
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface DonationFlowProps {
  open: boolean;
  token: string;
  hopitalId: string | null;
  onClose: () => void;
  onDone: () => void;
}

type FlowStep = "select" | "questionnaire" | "info" | "success";

export function DonationFlow({ open, token, hopitalId, onClose, onDone }: DonationFlowProps) {
  const [flowStep, setFlowStep]   = useState<FlowStep>("select");
  const [donor, setDonor]         = useState<DonneurAPI | null>(null);
  const [reponses, setReponses]   = useState<Record<string, Reponse>>({});

  const reset = () => {
    setFlowStep("select");
    setDonor(null);
    setReponses({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (info: DonInfo) => {
    if (!donor || !hopitalId) throw new Error("Données manquantes");
    const payload: CreateDonPayload = {
      donneurId: donor.id,
      hopitalId,
      dateDon: info.dateDon,
      typePoche: info.typePoche,
      volume: info.volume,
      questionnaireReponses: reponses,
    };
    await createDon(payload, token);
    setFlowStep("success");
    onDone();
  };

  if (!open) return null;

  const STEPS = [
    { key: "select",        label: "Donneur",      icon: User           },
    { key: "questionnaire", label: "Questionnaire", icon: ClipboardText  },
    { key: "info",          label: "Don",           icon: Drop           },
    { key: "success",       label: "Confirmé",      icon: TickCircle     },
  ] as const;

  const currentIdx = STEPS.findIndex((s) => s.key === flowStep);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                <Drop size={18} color="#dc2626" variant="Bold" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Enregistrer un don</h2>
                <p className="text-xs text-gray-400">Nouveau don de sang</p>
              </div>
            </div>
            {flowStep !== "success" && (
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            )}
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => {
              const done   = i < currentIdx;
              const active = i === currentIdx;
              const Icon   = s.icon;
              return (
                <div key={s.key} className="flex items-center gap-1 flex-1">
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className={clsx(
                      "w-7 h-7 rounded-full flex items-center justify-center transition-all",
                      done   ? "bg-green-500" :
                      active ? "bg-red-600"   : "bg-gray-100"
                    )}>
                      {done ? (
                        <TickCircle size={14} color="white" variant="Bold" />
                      ) : (
                        <Icon size={14} color={active ? "white" : "#9ca3af"} />
                      )}
                    </div>
                    <span className={clsx(
                      "text-xs font-medium",
                      active ? "text-red-600" : done ? "text-green-600" : "text-gray-400"
                    )}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={clsx("h-px flex-1 mb-4 transition-all", done ? "bg-green-400" : "bg-gray-100")} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {flowStep === "select" && (
            <Step1SelectDonor
              token={token}
              onSelect={(d) => { setDonor(d); setFlowStep("questionnaire"); }}
            />
          )}
          {flowStep === "questionnaire" && donor && (
            <Step2Questionnaire
              donor={donor}
              onBack={() => setFlowStep("select")}
              onNext={(r) => { setReponses(r); setFlowStep("info"); }}
            />
          )}
          {flowStep === "info" && donor && (
            <Step3DonInfo
              donor={donor}
              hopitalId={hopitalId ?? ""}
              reponses={reponses}
              onBack={() => setFlowStep("questionnaire")}
              onSubmit={handleSubmit}
            />
          )}
          {flowStep === "success" && donor && (
            <Step4Success donor={donor} onClose={handleClose} />
          )}
        </div>
      </div>
    </div>
  );
}

// Re-export type for parent usage
export type { Reponse };
