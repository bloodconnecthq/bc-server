"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { ArrowSwapHorizontal, Buildings2, SearchNormal1, Send } from "iconsax-reactjs";
import { getHopitauxAvecStock, transfererBonDemande, type BonDemandeData, type HospitalWithStock } from "@/lib/api/hospitalApi";

interface Props {
  bon: BonDemandeData;
  token: string;
  onClose: () => void;
  onDone: () => void;
}

export function TransferModal({ bon, token, onClose, onDone }: Props) {
  const [hopitaux, setHopitaux] = useState<HospitalWithStock[]>([]);
  const [loading, setLoading]   = useState(true);
  const [sending, setSending]   = useState<string | null>(null);
  const [search, setSearch]     = useState("");
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    getHopitauxAvecStock(bon.groupeSanguinPatient, bon.quantiteNecessaire, token)
      .then(setHopitaux).catch(() => setError("Impossible de charger les hôpitaux"))
      .finally(() => setLoading(false));
  }, [bon.groupeSanguinPatient, bon.quantiteNecessaire, token]);

  const send = async (hopitalId: string) => {
    setSending(hopitalId);
    try { await transfererBonDemande(bon.id, hopitalId, token); onDone(); }
    catch (e: any) { setError(e?.message ?? "Erreur"); setSending(null); }
  };

  const filtered = hopitaux.filter((h) =>
    !search || h.nom.toLowerCase().includes(search.toLowerCase()) ||
    (h.commune ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[88vh]">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <ArrowSwapHorizontal size={20} color="#2563eb" variant="Bold" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Transférer vers un autre hôpital</h2>
                <p className="text-xs text-gray-400">
                  <span className="font-semibold text-gray-600">{bon.nomPatient}</span>
                  {" · "}<span className="font-black text-red-600">{bon.groupeSanguinPatient}</span>
                  {" · "}{bon.quantiteNecessaire} poche{bon.quantiteNecessaire > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>
          <div className="relative">
            <SearchNormal1 size={14} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input type="text" placeholder="Rechercher un hôpital..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {error && <div className="m-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
          {loading ? (
            <div className="p-8 flex flex-col items-center gap-3">
              <span className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Recherche des établissements disponibles…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center">
              <Buildings2 size={28} color="#d1d5db" className="mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-400">Aucun établissement disponible</p>
              <p className="text-xs text-gray-300 mt-1">Aucun hôpital n'a {bon.quantiteNecessaire} poche(s) de {bon.groupeSanguinPatient} en stock</p>
            </div>
          ) : filtered.map((h) => {
            const level = h.stock.quantite <= h.stock.seuilCritique ? "critique" : h.stock.quantite <= h.stock.seuilFaible ? "faible" : "ok";
            return (
              <div key={h.id} className="px-5 py-4 flex items-center gap-4 border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Buildings2 size={16} color="#2563eb" variant="Bold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{h.nom}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={clsx("text-xs px-2 py-0.5 rounded-full font-medium border",
                      level === "ok" && "bg-green-50 text-green-700 border-green-200",
                      level === "faible" && "bg-amber-50 text-amber-700 border-amber-200",
                      level === "critique" && "bg-red-50 text-red-700 border-red-200",
                    )}>{h.stock.quantite} poche{h.stock.quantite > 1 ? "s" : ""} dispo</span>
                    {h.commune && <span className="text-xs text-gray-400">{h.commune}</span>}
                  </div>
                </div>
                <button onClick={() => send(h.id)} disabled={sending === h.id}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-60">
                  {sending === h.id ? <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Send size={12} color="white" variant="Bold" />}
                  Envoyer
                </button>
              </div>
            );
          })}
        </div>
        <div className="px-5 py-3 border-t border-gray-50 shrink-0">
          <p className="text-xs text-gray-400 text-center">{filtered.length} établissement{filtered.length > 1 ? "s" : ""} avec stock suffisant</p>
        </div>
      </div>
    </div>
  );
}
