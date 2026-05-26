"use client";

import clsx from "clsx";
import { Table, Tabs } from "@heroui/react";
import { Clock, TickCircle, CloseCircle, ArrowSwapHorizontal } from "iconsax-reactjs";
import type { BonDemandeData } from "@/lib/api/hospitalApi";
import { StockBadge } from "./stock-badge";

const STATUS_CFG = {
  en_attente:    { label: "En attente",    color: "text-amber-700 bg-amber-50 border-amber-200",  Icon: Clock               },
  satisfait:     { label: "Satisfait",     color: "text-green-700 bg-green-50 border-green-200",  Icon: TickCircle          },
  non_satisfait: { label: "Non satisfait", color: "text-red-700 bg-red-50 border-red-200",        Icon: CloseCircle         },
  transfere:     { label: "Transféré",     color: "text-blue-700 bg-blue-50 border-blue-200",     Icon: ArrowSwapHorizontal },
} as const;

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

interface Props {
  bons: BonDemandeData[];
  recus: BonDemandeData[];
  loading: boolean;
  onSelectBon: (bon: BonDemandeData, mode: "mes" | "recu") => void;
  pendingRecus: number;
}

function BonRow({ bon, onClick }: { bon: BonDemandeData; onClick: () => void }) {
  const cfg = STATUS_CFG[bon.statut];
  return (
    <Table.Row id={bon.id} className="cursor-pointer hover:bg-gray-50/60 transition-colors" onAction={onClick}>
      <Table.Cell>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-50 rounded-xl flex flex-col items-center justify-center shrink-0">
            <span className="text-xs font-black text-red-600 leading-none">{bon.groupeSanguinPatient}</span>
            <span className="text-xs text-red-400 leading-none">×{bon.quantiteNecessaire}</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">{bon.nomPatient}</span>
        </div>
      </Table.Cell>
      <Table.Cell>
        <span className={clsx("text-xs px-2 py-1 rounded-full border font-medium flex items-center gap-1 w-fit", cfg.color)}>
          <cfg.Icon size={10} variant="Bold" />
          {cfg.label}
        </span>
      </Table.Cell>
      <Table.Cell><StockBadge disponible={bon.stockDisponible} necessaire={bon.quantiteNecessaire} /></Table.Cell>
      <Table.Cell><span className="text-xs text-gray-400">{bon.medecin?.nomComplet ? `Dr. ${bon.medecin.nomComplet}` : "—"}</span></Table.Cell>
      <Table.Cell><span className="text-xs text-gray-400">{fmt(bon.creeLe)}</span></Table.Cell>
    </Table.Row>
  );
}

function BonTable({ items, onSelect, mode, loading }: { items: BonDemandeData[]; onSelect: (b: BonDemandeData) => void; mode: "mes" | "recu"; loading: boolean }) {
  if (loading) return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
    </div>
  );
  if (items.length === 0) return (
    <div className="py-16 text-center text-sm text-gray-400">
      {mode === "recu" ? "Aucune demande reçue d'un autre hôpital" : "Aucun bon de demande créé"}
    </div>
  );
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Bons de demande" className="w-full">
          <Table.Header>
            <Table.Column isRowHeader className="text-xs font-semibold text-gray-500 pl-4">Patient / Groupe</Table.Column>
            <Table.Column className="text-xs font-semibold text-gray-500">Statut</Table.Column>
            <Table.Column className="text-xs font-semibold text-gray-500">Stock local</Table.Column>
            <Table.Column className="text-xs font-semibold text-gray-500">Médecin</Table.Column>
            <Table.Column className="text-xs font-semibold text-gray-500">Date</Table.Column>
          </Table.Header>
          <Table.Body>
            {items.map((bon) => (
              <BonRow key={bon.id} bon={bon} onClick={() => onSelect(bon)} />
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

export function BonTabs({ bons, recus, loading, onSelectBon, pendingRecus }: Props) {
  return (
    <Tabs defaultSelectedKey="mes">
      <Tabs.List className="mb-1">
        <Tabs.Tab id="mes">
          Mes demandes
          <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 font-bold">{bons.length}</span>
        </Tabs.Tab>
        <Tabs.Tab id="recus">
          Demandes reçues
          <span className={clsx(
            "ml-2 text-xs px-1.5 py-0.5 rounded-full font-bold",
            pendingRecus > 0 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
          )}>{recus.length}</span>
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel id="mes" className="mt-0">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <BonTable items={bons} onSelect={(b) => onSelectBon(b, "mes")} mode="mes" loading={loading} />
        </div>
      </Tabs.Panel>

      <Tabs.Panel id="recus" className="mt-0">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <BonTable items={recus} onSelect={(b) => onSelectBon(b, "recu")} mode="recu" loading={loading} />
        </div>
      </Tabs.Panel>
    </Tabs>
  );
}
