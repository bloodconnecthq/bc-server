"use client";

import { useEffect, useState, useCallback } from "react";
import clsx from "clsx";
import { User, Trash, TickCircle, CloseCircle, AddCircle, Clock } from "iconsax-reactjs";
import {
  getMyMembers, supprimerMembre, getDemandesAcces,
  approuverDemandeAcces, rejeterDemandeAcces, soumettreDemandeAcces,
  type MemberData, type DemandeAccesData,
} from "@/lib/api/hospitalApi";

const ROLE_LABEL: Record<string, string> = {
  medecin:      "Médecin",
  infirmier:    "Infirmier",
  admin_hopital: "Administrateur",
};

interface Props {
  hopitalId: string | null;
  isAdmin: boolean;
  token: string;
}

export function HospitalSettingsMembers({ hopitalId, isAdmin, token }: Props) {
  const [membres,   setMembres]   = useState<MemberData[]>([]);
  const [demandes,  setDemandes]  = useState<DemandeAccesData[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [actionId,  setActionId]  = useState<string | null>(null);
  const [showForm,  setShowForm]  = useState(false);
  const [form, setForm] = useState({ nomDemandeur: "", emailDemandeur: "", roleDemande: "medecin" as "medecin" | "infirmier", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [m, d] = await Promise.all([
        getMyMembers(token),
        isAdmin ? getDemandesAcces(token) : Promise.resolve([]),
      ]);
      setMembres(m);
      setDemandes(d);
    } finally { setLoading(false); }
  }, [token, isAdmin]);

  useEffect(() => { load(); }, [load]);

  const handleSupprimer = async (membreId: string) => {
    if (!window.confirm("Supprimer ce membre de l'hôpital ?")) return;
    setActionId(membreId);
    try { await supprimerMembre(membreId, token); await load(); }
    catch (e: any) { setError(e?.message ?? "Erreur"); }
    finally { setActionId(null); }
  };

  const handleApprouver = async (id: string) => {
    setActionId(id);
    try { await approuverDemandeAcces(id, token); await load(); }
    catch (e: any) { setError(e?.message ?? "Erreur"); }
    finally { setActionId(null); }
  };

  const handleRejeter = async (id: string) => {
    setActionId(id);
    try { await rejeterDemandeAcces(id, token); await load(); }
    catch (e: any) { setError(e?.message ?? "Erreur"); }
    finally { setActionId(null); }
  };

  const handleSoumettre = async () => {
    if (!hopitalId || !form.nomDemandeur.trim() || !form.emailDemandeur.trim()) {
      setError("Nom et email sont requis"); return;
    }
    setSubmitting(true); setError(null);
    try {
      await soumettreDemandeAcces({ ...form, hopitalId }, token);
      setShowForm(false);
      setForm({ nomDemandeur: "", emailDemandeur: "", roleDemande: "medecin", message: "" });
      await load();
    } catch (e: any) { setError(e?.message ?? "Erreur"); }
    finally { setSubmitting(false); }
  };

  const pendingDemandes = demandes.filter((d) => d.statut === "en_attente");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Membres de l'établissement</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {loading ? "…" : `${membres.length} membre${membres.length > 1 ? "s" : ""}`}
            {isAdmin && pendingDemandes.length > 0 && (
              <span className="ml-2 text-amber-600 font-semibold">· {pendingDemandes.length} demande{pendingDemandes.length > 1 ? "s" : ""} en attente</span>
            )}
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:underline">
            <AddCircle size={15} />
            Inviter un membre
          </button>
        )}
      </div>

      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Invite form */}
      {isAdmin && showForm && (
        <div className="px-6 py-4 bg-red-50 border-b border-red-100">
          <p className="text-xs font-bold text-red-700 mb-3">Demande d'accès pour un nouveau membre</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input type="text" placeholder="Nom complet" value={form.nomDemandeur}
              onChange={(e) => setForm((f) => ({ ...f, nomDemandeur: e.target.value }))}
              className="px-3 py-2 text-sm rounded-xl border border-red-200 bg-white focus:outline-none focus:border-red-400" />
            <input type="email" placeholder="Email" value={form.emailDemandeur}
              onChange={(e) => setForm((f) => ({ ...f, emailDemandeur: e.target.value }))}
              className="px-3 py-2 text-sm rounded-xl border border-red-200 bg-white focus:outline-none focus:border-red-400" />
            <select value={form.roleDemande}
              onChange={(e) => setForm((f) => ({ ...f, roleDemande: e.target.value as "medecin" | "infirmier" }))}
              className="px-3 py-2 text-sm rounded-xl border border-red-200 bg-white focus:outline-none focus:border-red-400">
              <option value="medecin">Médecin</option>
              <option value="infirmier">Infirmier</option>
            </select>
            <input type="text" placeholder="Message (optionnel)" value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="px-3 py-2 text-sm rounded-xl border border-red-200 bg-white focus:outline-none focus:border-red-400" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSoumettre} disabled={submitting}
              className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-xl hover:bg-red-700 disabled:opacity-60">
              {submitting ? "Envoi…" : "Envoyer la demande"}
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-50">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Members list */}
      {loading ? (
        <div className="p-6 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : membres.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-400">Aucun membre trouvé</div>
      ) : (
        <div className="divide-y divide-gray-50">
          {membres.map((m) => {
            const u = m.utilisateur;
            return (
              <div key={m.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                    <User size={15} color="#dc2626" variant="Bold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{u?.nomComplet ?? u?.email ?? "—"}</p>
                    <p className="text-xs text-gray-400">
                      {ROLE_LABEL[u?.role ?? ""] ?? u?.role ?? "—"}
                      {u?.email ? ` · ${u.email}` : ""}
                    </p>
                  </div>
                </div>
                {isAdmin && (
                  <button onClick={() => handleSupprimer(m.id)} disabled={actionId === m.id}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-40">
                    {actionId === m.id
                      ? <span className="w-3.5 h-3.5 border border-red-400/40 border-t-red-400 rounded-full animate-spin block" />
                      : <Trash size={14} />}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pending access requests — admin only */}
      {isAdmin && pendingDemandes.length > 0 && (
        <div className="border-t border-gray-100">
          <div className="px-6 py-3 bg-amber-50/60">
            <p className="text-xs font-bold text-amber-700">Demandes d'accès en attente</p>
          </div>
          <div className="divide-y divide-gray-50">
            {pendingDemandes.map((d) => (
              <div key={d.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                    <Clock size={15} color="#b45309" variant="Bold" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{d.nomDemandeur}</p>
                      <span className={clsx(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        "bg-amber-50 text-amber-700 border border-amber-200"
                      )}>En attente</span>
                    </div>
                    <p className="text-xs text-gray-400">{ROLE_LABEL[d.roleDemande]} · {d.emailDemandeur}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleApprouver(d.id)} disabled={!!actionId}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-xl disabled:opacity-60 transition-colors">
                    {actionId === d.id
                      ? <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      : <TickCircle size={12} variant="Bold" />}
                    Approuver
                  </button>
                  <button onClick={() => handleRejeter(d.id)} disabled={!!actionId}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl border border-red-200 disabled:opacity-60 transition-colors">
                    <CloseCircle size={12} variant="Bold" />
                    Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
