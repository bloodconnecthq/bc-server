"use client";

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import {
  User, Trash, Edit, AddCircle, CloseCircle, Eye, EyeSlash,
} from "iconsax-reactjs";
import {
  getMyMembers, supprimerMembre,
  creerMembreHopital, modifierMembreHopital,
  type MemberData, type CreateMembrePayload, type UpdateMembrePayload,
} from "@/lib/api/hospitalApi";

const ROLE_LABEL: Record<string, string> = {
  medecin:       "Médecin",
  infirmier:     "Infirmier(e)",
  admin_hopital: "Administrateur",
};

const ROLE_COLOR: Record<string, string> = {
  medecin:       "bg-blue-50 text-blue-700 border-blue-200",
  infirmier:     "bg-green-50 text-green-700 border-green-200",
  admin_hopital: "bg-red-50 text-red-700 border-red-200",
};

interface Props {
  token: string;
  hopitalNom: string;
}

type Modal = "create" | "edit" | null;

const EMPTY_CREATE: CreateMembrePayload = {
  prenom: "", nom: "", email: "", motDePasse: "", role: "infirmier", telephone: "",
};

export function HospitalMembersManager({ token, hopitalNom }: Props) {
  const [membres, setMembres]     = useState<MemberData[]>([]);
  const [loading, setLoading]     = useState(true);
  const [actionId, setActionId]   = useState<string | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const [success, setSuccess]     = useState<string | null>(null);
  const [modal, setModal]         = useState<Modal>(null);
  const [editTarget, setEditTarget] = useState<MemberData | null>(null);
  const [showPwd, setShowPwd]     = useState(false);

  const [createForm, setCreateForm] = useState<CreateMembrePayload>(EMPTY_CREATE);
  const [editForm, setEditForm]     = useState<UpdateMembrePayload>({});
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setMembres(await getMyMembers(token));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const flash = (msg: string, type: "success" | "error") => {
    if (type === "success") { setSuccess(msg); setTimeout(() => setSuccess(null), 4000); }
    else                    { setError(msg);   setTimeout(() => setError(null), 5000); }
  };

  const openCreate = () => {
    setCreateForm(EMPTY_CREATE);
    setShowPwd(false);
    setModal("create");
  };

  const openEdit = (m: MemberData) => {
    setEditTarget(m);
    setEditForm({
      prenom:    m.utilisateur?.nomComplet?.split(" ")[0] ?? "",
      nom:       m.utilisateur?.nomComplet?.split(" ").slice(1).join(" ") ?? "",
      telephone: m.utilisateur?.telephone ?? "",
      role:      (m.utilisateur?.role as UpdateMembrePayload["role"]) ?? "infirmier",
    });
    setModal("edit");
  };

  const closeModal = () => { setModal(null); setEditTarget(null); };

  const handleCreate = async () => {
    if (!createForm.prenom.trim() || !createForm.nom.trim() || !createForm.email.trim() || !createForm.motDePasse) {
      flash("Prénom, nom, email et mot de passe sont requis", "error"); return;
    }
    if (createForm.motDePasse.length < 8) {
      flash("Le mot de passe doit contenir au moins 8 caractères", "error"); return;
    }
    setSubmitting(true);
    try {
      await creerMembreHopital(createForm, token);
      flash(`${createForm.prenom} ${createForm.nom} a été ajouté — un email de bienvenue lui a été envoyé`, "success");
      closeModal();
      await load();
    } catch (e: any) {
      flash(e?.message ?? "Erreur", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    setSubmitting(true);
    try {
      await modifierMembreHopital(editTarget.id, editForm, token);
      flash("Membre mis à jour", "success");
      closeModal();
      await load();
    } catch (e: any) {
      flash(e?.message ?? "Erreur", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (m: MemberData) => {
    const nom = m.utilisateur?.nomComplet ?? m.utilisateur?.email ?? "ce membre";
    if (!window.confirm(`Supprimer ${nom} de l'hôpital ?`)) return;
    setActionId(m.id);
    try {
      await supprimerMembre(m.id, token);
      flash(`${nom} a été retiré de l'établissement`, "success");
      await load();
    } catch (e: any) {
      flash(e?.message ?? "Erreur", "error");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toasts */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-2xl px-5 py-3.5 flex items-center gap-2">
          <span className="text-green-500">✓</span> {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-3.5">
          {error}
        </div>
      )}

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{hopitalNom}</p>
          <h2 className="text-lg font-bold text-gray-900">
            {loading ? "…" : `${membres.length} membre${membres.length > 1 ? "s" : ""}`}
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">Gérez les comptes d'accès à votre espace hôpital</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <AddCircle size={16} variant="Bold" />
          Ajouter un membre
        </button>
      </div>

      {/* Members grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-28 animate-pulse" />
          ))}
        </div>
      ) : membres.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 flex flex-col items-center gap-3">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
            <User size={24} color="#d1d5db" variant="Bold" />
          </div>
          <p className="text-sm text-gray-400">Aucun membre pour l'instant</p>
          <button onClick={openCreate} className="text-sm font-semibold text-red-600 hover:underline">
            + Ajouter le premier membre
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {membres.map((m) => {
            const u = m.utilisateur;
            const role = u?.role ?? "";
            return (
              <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                    <User size={18} color="#dc2626" variant="Bold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{u?.nomComplet ?? "—"}</p>
                    <p className="text-xs text-gray-400 truncate">{u?.email ?? "—"}</p>
                    {u?.telephone && (
                      <p className="text-xs text-gray-400">{u.telephone}</p>
                    )}
                  </div>
                  <span className={clsx(
                    "shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border",
                    ROLE_COLOR[role] ?? "bg-gray-50 text-gray-600 border-gray-200"
                  )}>
                    {ROLE_LABEL[role] ?? role}
                  </span>
                </div>
                <div className="flex gap-2 pt-1 border-t border-gray-50">
                  <button
                    onClick={() => openEdit(m)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <Edit size={13} />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(m)}
                    disabled={actionId === m.id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-40"
                  >
                    {actionId === m.id
                      ? <span className="w-3 h-3 border-2 border-red-400/40 border-t-red-400 rounded-full animate-spin" />
                      : <Trash size={13} />}
                    Retirer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Create modal ── */}
      {modal === "create" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">Nouveau membre</h3>
                <p className="text-xs text-gray-400 mt-0.5">Un email de bienvenue avec ses identifiants sera envoyé</p>
              </div>
              <button onClick={closeModal} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <CloseCircle size={18} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Prénom *</label>
                  <input
                    type="text" value={createForm.prenom}
                    onChange={(e) => setCreateForm((f) => ({ ...f, prenom: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-red-400 bg-gray-50 focus:bg-white transition-colors"
                    placeholder="Jean"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nom *</label>
                  <input
                    type="text" value={createForm.nom}
                    onChange={(e) => setCreateForm((f) => ({ ...f, nom: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-red-400 bg-gray-50 focus:bg-white transition-colors"
                    placeholder="Dupont"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email *</label>
                <input
                  type="email" value={createForm.email}
                  onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-red-400 bg-gray-50 focus:bg-white transition-colors"
                  placeholder="jean.dupont@hopital.ci"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mot de passe *</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={createForm.motDePasse}
                    onChange={(e) => setCreateForm((f) => ({ ...f, motDePasse: e.target.value }))}
                    className="w-full px-3 py-2.5 pr-10 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-red-400 bg-gray-50 focus:bg-white transition-colors"
                    placeholder="Min. 8 caractères"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPwd ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Rôle *</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm((f) => ({ ...f, role: e.target.value as CreateMembrePayload["role"] }))}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-red-400 bg-gray-50 focus:bg-white transition-colors"
                  >
                    <option value="infirmier">Infirmier(e)</option>
                    <option value="medecin">Médecin</option>
                    <option value="admin_hopital">Administrateur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Téléphone</label>
                  <input
                    type="tel" value={createForm.telephone ?? ""}
                    onChange={(e) => setCreateForm((f) => ({ ...f, telephone: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-red-400 bg-gray-50 focus:bg-white transition-colors"
                    placeholder="+225 0700000000"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={handleCreate}
                disabled={submitting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl disabled:opacity-60 transition-colors"
              >
                {submitting ? "Création…" : "Créer le compte et envoyer l'email"}
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit modal ── */}
      {modal === "edit" && editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Modifier le membre</h3>
              <button onClick={closeModal} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <CloseCircle size={18} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Prénom</label>
                  <input
                    type="text" value={editForm.prenom ?? ""}
                    onChange={(e) => setEditForm((f) => ({ ...f, prenom: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-red-400 bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nom</label>
                  <input
                    type="text" value={editForm.nom ?? ""}
                    onChange={(e) => setEditForm((f) => ({ ...f, nom: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-red-400 bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                <input
                  type="email" value={editTarget.utilisateur?.email ?? ""}
                  disabled
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Rôle</label>
                  <select
                    value={editForm.role ?? "infirmier"}
                    onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value as UpdateMembrePayload["role"] }))}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-red-400 bg-gray-50 focus:bg-white transition-colors"
                  >
                    <option value="infirmier">Infirmier(e)</option>
                    <option value="medecin">Médecin</option>
                    <option value="admin_hopital">Administrateur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Téléphone</label>
                  <input
                    type="tel" value={editForm.telephone ?? ""}
                    onChange={(e) => setEditForm((f) => ({ ...f, telephone: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-red-400 bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={handleEdit}
                disabled={submitting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl disabled:opacity-60 transition-colors"
              >
                {submitting ? "Enregistrement…" : "Enregistrer"}
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
