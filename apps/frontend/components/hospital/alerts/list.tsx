"use client";

import { useState } from "react";
import clsx from "clsx";

type AlertType = "critical" | "low" | "expiry";

interface Alert {
  id: string;
  type: AlertType;
  bloodGroup: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  resolved: boolean;
  triggeredBy: string;
}

const typeConfig: { [key in AlertType]: { bg: string; border: string; badge: string; emoji: string; label: string } } = {
  critical: {
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700",
    emoji: "🚨",
    label: "Critique",
  },
  low: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    emoji: "⚠️",
    label: "Stock faible",
  },
  expiry: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    emoji: "⏰",
    label: "Expiration",
  },
};

const filters = ["Toutes", "Critiques", "Stock faible", "Expirations", "Résolues"];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
  });
}

export function AlertsList({ alerts }: { alerts: Alert[] }) {
  const [activeFilter, setActiveFilter] = useState("Toutes");
  const [items, setItems] = useState(alerts);

  const filtered = items.filter((a) => {
    if (activeFilter === "Toutes") return !a.resolved;
    if (activeFilter === "Critiques") return a.type === "critical" && !a.resolved;
    if (activeFilter === "Stock faible") return a.type === "low" && !a.resolved;
    if (activeFilter === "Expirations") return a.type === "expiry" && !a.resolved;
    if (activeFilter === "Résolues") return a.resolved;
    return true;
  });

  const resolve = (id: string) => {
    setItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true, read: true } : a))
    );
  };

  const markRead = (id: string) => {
    setItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={clsx(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              activeFilter === f
                ? "bg-red-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-red-300"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-2xl mb-2">✅</p>
            <p className="text-sm font-medium text-gray-700">
              Aucune alerte active
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Tous les stocks sont dans les normes
            </p>
          </div>
        )}

        {filtered.map((alert) => {
          const config = typeConfig[alert.type];
          return (
            <div
              key={alert.id}
              onClick={() => markRead(alert.id)}
              className={clsx(
                "rounded-2xl border p-5 transition-all",
                alert.resolved
                  ? "bg-white border-gray-100 opacity-60"
                  : alert.read
                  ? "bg-white border-gray-100"
                  : clsx(config.bg, config.border)
              )}
            >
              <div className="flex items-start gap-4">
                {/* Icône */}
                <div
                  className={clsx(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0",
                    alert.resolved ? "bg-gray-100" : config.bg
                  )}
                >
                  {alert.resolved ? "✅" : config.emoji}
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2">
                      {!alert.read && !alert.resolved && (
                        <div className="w-2 h-2 bg-red-500 rounded-full shrink-0" />
                      )}
                      <p className="text-sm font-bold text-gray-900">
                        {alert.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={clsx(
                          "text-xs font-medium px-2.5 py-1 rounded-full",
                          alert.resolved
                            ? "bg-green-50 text-green-700"
                            : config.badge
                        )}
                      >
                        {alert.resolved ? "Résolu" : config.label}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed mb-3">
                    {alert.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Groupe sanguin */}
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-red-600">
                            {alert.bloodGroup}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {alert.bloodGroup}
                        </span>
                      </div>
                      <span className="text-gray-200">·</span>
                      <span className="text-xs text-gray-400">
                        {formatDate(alert.date)}
                      </span>
                      <span className="text-gray-200">·</span>
                      <span className="text-xs text-gray-400">
                        {alert.triggeredBy}
                      </span>
                    </div>

                    {/* Actions */}
                    {!alert.resolved && (
                      <div className="flex gap-2">
                        <a
                          href="/hospital/stocks"
                          className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Voir stocks
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            resolve(alert.id);
                          }}
                          className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                        >
                          Marquer résolu
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}