"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/app/providers/auth-provider";
import { useUsers, useUserStats } from "@/lib/hooks/useConsole";
import {
  updateUser, updateUserStatut, deleteUser, resetUserPassword,
  type UserAPI, type UpdateUserPayload,
} from "@/lib/api/consoleApi";
import { UsersStats }  from "@/components/console/users/stats";
import { UsersList }   from "@/components/console/users/list";
import { UserModal }   from "@/components/console/users/user-modal";

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={`fixed top-4 right-4 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border max-w-sm
      ${ok ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
      {msg}
    </div>
  );
}

type ModalState = { user: UserAPI; mode: "edit" | "reset-password" } | null;

export default function UsersPage() {
  const { token } = useAuth();

  // Controlled filter state — passed to hook so refetch reruns on change
  const [search,  setSearch]  = useState("");
  const [role,    setRole]    = useState("Tous");
  const [statut,  setStatut]  = useState("Tous");

  const params = {
    search:  search || undefined,
    role:    role !== "Tous"   ? role   : undefined,
    statut:  statut !== "Tous" ? statut : undefined,
  };

  const { data: users,   isLoading: loadingUsers, refetch } = useUsers(token, params);
  const { data: stats,   isLoading: loadingStats, refetch: refetchStats } = useUserStats(token);

  const [modal,    setModal]    = useState<ModalState>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [toast,    setToast]    = useState<{ msg: string; ok: boolean } | null>(null);

  const notify = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const reload = useCallback(() => { refetch(); refetchStats(); }, [refetch, refetchStats]);

  const handleSave = async (id: string, data: UpdateUserPayload) => {
    if (!token) return;
    await updateUser(id, data, token);
    notify("Utilisateur mis à jour");
    reload();
  };

  const handleResetPassword = async (id: string, password: string) => {
    if (!token) return;
    await resetUserPassword(id, password, token);
    notify("Mot de passe réinitialisé");
  };

  const handleToggleStatut = async (u: UserAPI) => {
    if (!token) return;
    setActionId(u.id);
    try {
      await updateUserStatut(u.id, !u.estActif, token);
      notify(u.estActif ? "Compte désactivé" : "Compte activé");
      reload();
    } catch (e: any) {
      notify(e?.message ?? "Erreur", false);
    } finally { setActionId(null); }
  };

  const handleDelete = async (u: UserAPI) => {
    if (!token) return;
    if (!window.confirm(`Supprimer définitivement le compte de ${u.nomComplet || u.email} ?`)) return;
    setActionId(u.id);
    try {
      await deleteUser(u.id, token);
      notify("Utilisateur supprimé");
      reload();
    } catch (e: any) {
      notify(e?.message ?? "Erreur", false);
    } finally { setActionId(null); }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestion de tous les comptes utilisateurs du système
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl">
          <span className="text-xs font-semibold text-gray-600">
            {loadingUsers ? "…" : `${(users ?? []).length} résultat${(users ?? []).length > 1 ? "s" : ""}`}
          </span>
        </div>
      </div>

      {/* Stats */}
      <UsersStats stats={stats} loading={loadingStats} />

      {/* List */}
      <UsersList
        users={users ?? []}
        loading={loadingUsers}
        search={search}
        onSearchChange={setSearch}
        roleFilter={role}
        onRoleChange={setRole}
        statutFilter={statut}
        onStatutChange={setStatut}
        actionId={actionId}
        onEdit={(u) => setModal({ user: u, mode: "edit" })}
        onDelete={handleDelete}
        onToggleStatut={handleToggleStatut}
        onResetPassword={(u) => setModal({ user: u, mode: "reset-password" })}
      />

      {/* Modal */}
      {modal && (
        <UserModal
          user={modal.user}
          mode={modal.mode}
          onClose={() => setModal(null)}
          onSave={handleSave}
          onResetPassword={handleResetPassword}
        />
      )}
    </div>
  );
}
