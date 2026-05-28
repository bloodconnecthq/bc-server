"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/app/providers/auth-provider";
import { useUsers, useUserStats, useHopitaux } from "@/lib/hooks/useConsole";
import {
  updateUser, updateUserStatut, deleteUser, resetUserPassword, createUser,
  type UserAPI, type UpdateUserPayload, type CreateUserPayload,
} from "@/lib/api/consoleApi";
import { UsersStats }      from "@/components/console/users/stats";
import { UsersList }       from "@/components/console/users/list";
import { UserModal }       from "@/components/console/users/user-modal";
import { CreateUserModal } from "@/components/console/users/create-modal";
import { ConfirmModal }   from "@/components/ui/confirm-modal";

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

  const [search,  setSearch]  = useState("");
  const [role,    setRole]    = useState("Tous");
  const [statut,  setStatut]  = useState("Tous");

  const params = {
    search:  search || undefined,
    role:    role !== "Tous"   ? role   : undefined,
    statut:  statut !== "Tous" ? statut : undefined,
  };

  const { data: users,    isLoading: loadingUsers, refetch } = useUsers(token, params);
  const { data: stats,    isLoading: loadingStats, refetch: refetchStats } = useUserStats(token);
  const { data: hopitaux } = useHopitaux(token);

  const [modal,         setModal]         = useState<ModalState>(null);
  const [showCreate,    setShowCreate]    = useState(false);
  const [deleteTarget,  setDeleteTarget]  = useState<UserAPI | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionId,      setActionId]      = useState<string | null>(null);
  const [toast,         setToast]         = useState<{ msg: string; ok: boolean } | null>(null);

  const notify = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const reload = useCallback(() => { refetch(); refetchStats(); }, [refetch, refetchStats]);

  const handleCreate = async (data: CreateUserPayload) => {
    if (!token) return;
    await createUser(data, token);
    notify("Compte créé avec succès");
    reload();
  };

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

  const handleDelete = (u: UserAPI) => setDeleteTarget(u);

  const handleDeleteConfirm = async () => {
    if (!token || !deleteTarget) return;
    setDeleteLoading(true);
    setActionId(deleteTarget.id);
    try {
      await deleteUser(deleteTarget.id, token);
      notify("Utilisateur supprimé");
      setDeleteTarget(null);
      reload();
    } catch (e: any) {
      notify(e?.message ?? "Erreur", false);
    } finally {
      setDeleteLoading(false);
      setActionId(null);
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    if (!token) return;
    await Promise.all(ids.map((id) => deleteUser(id, token)));
    reload();
  };

  const handleQuickUpdate = async (id: string, data: UpdateUserPayload) => {
    if (!token) return;
    await updateUser(id, data, token);
    notify("Modifications enregistrées");
    reload();
  };

  const hospitals = (hopitaux ?? []).map((h) => ({ id: h.id, nom: h.nom }));

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
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl">
            <span className="text-xs font-semibold text-gray-600">
              {loadingUsers ? "…" : `${(users ?? []).length} résultat${(users ?? []).length > 1 ? "s" : ""}`}
            </span>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors"
          >
            + Créer un utilisateur
          </button>
        </div>
      </div>

      {/* Stats */}
      <UsersStats stats={stats} loading={loadingStats} />

      {/* List */}
      <UsersList
        users={users ?? []}
        hospitals={hospitals}
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
        onBulkDelete={handleBulkDelete}
        onQuickUpdate={handleQuickUpdate}
      />

      {/* Edit / Reset password modal */}
      {modal && (
        <UserModal
          user={modal.user}
          mode={modal.mode}
          hospitals={hospitals}
          onClose={() => setModal(null)}
          onSave={handleSave}
          onResetPassword={handleResetPassword}
        />
      )}

      {/* Create user modal */}
      {showCreate && (
        <CreateUserModal
          hospitals={hospitals}
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Supprimer le compte"
        description={`Vous allez supprimer définitivement le compte de ${deleteTarget?.nomComplet || deleteTarget?.email || "cet utilisateur"}. Cette action est irréversible.`}
        confirmLabel="Supprimer"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
