"use client";

import { useState } from "react";
import { User, AddCircle, Trash } from "iconsax-reactjs";
import clsx from "clsx";

interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  status: "active" | "pending";
}

const initialMembers: Member[] = [
  {
    id: "1",
    name: "Dr. Hounkpè",
    role: "Médecin",
    email: "hounkpe@chu-cotonou.bj",
    status: "active",
  },
  {
    id: "2",
    name: "Dr. Ahounou",
    role: "Médecin",
    email: "ahounou@chu-cotonou.bj",
    status: "active",
  },
  {
    id: "3",
    name: "Inf. Tossou",
    role: "Infirmier",
    email: "tossou@chu-cotonou.bj",
    status: "active",
  },
  {
    id: "4",
    name: "M. Gbènou",
    role: "Technicien",
    email: "gbenou@chu-cotonou.bj",
    status: "pending",
  },
];

export function HospitalSettingsMembers() {
  const [members, setMembers] = useState(initialMembers);
  const [showRequest, setShowRequest] = useState(false);
  const [requestName, setRequestName] = useState("");
  const [requestEmail, setRequestEmail] = useState("");
  const [requestRole, setRequestRole] = useState("");
  const [sent, setSent] = useState(false);

  const handleRemove = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setShowRequest(false);
      setRequestName("");
      setRequestEmail("");
      setRequestRole("");
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Membres de l'établissement
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {members.length} membre{members.length > 1 ? "s" : ""} ·
            Les ajouts sont soumis à validation par le CNTS
          </p>
        </div>
        <button
          onClick={() => setShowRequest(!showRequest)}
          className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:underline"
        >
          <AddCircle size={15} />
          Demander un accès
        </button>
      </div>

      {/* Formulaire de demande */}
      {showRequest && (
        <div className="px-6 py-4 bg-red-50 border-b border-red-100">
          <p className="text-xs font-semibold text-red-700 mb-3">
            Nouvelle demande d'accès — sera transmise au CNTS
          </p>
          <form onSubmit={handleRequest} className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Nom complet"
                value={requestName}
                onChange={(e) => setRequestName(e.target.value)}
                required
                className="px-3 py-2 text-sm rounded-xl border border-red-200 bg-white focus:outline-none focus:border-red-400"
              />
              <input
                type="email"
                placeholder="Email"
                value={requestEmail}
                onChange={(e) => setRequestEmail(e.target.value)}
                required
                className="px-3 py-2 text-sm rounded-xl border border-red-200 bg-white focus:outline-none focus:border-red-400"
              />
              <input
                type="text"
                placeholder="Rôle (Médecin, Infirmier...)"
                value={requestRole}
                onChange={(e) => setRequestRole(e.target.value)}
                required
                className="px-3 py-2 text-sm rounded-xl border border-red-200 bg-white focus:outline-none focus:border-red-400"
              />
            </div>
            <div className="flex items-center gap-3">
              {sent ? (
                <p className="text-sm text-green-600 font-medium">
                  ✓ Demande envoyée au CNTS
                </p>
              ) : (
                <>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Envoyer la demande
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRequest(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Liste membres */}
      <div className="divide-y divide-gray-50">
        {members.map((member) => (
          <div
            key={member.id}
            className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                <User size={16} color="#dc2626" variant="Bold" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {member.name}
                  </p>
                  <span
                    className={clsx(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      member.status === "active"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    )}
                  >
                    {member.status === "active" ? "Actif" : "En attente"}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {member.role} · {member.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleRemove(member.id)}
              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}