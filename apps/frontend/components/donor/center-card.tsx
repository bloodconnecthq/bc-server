import clsx from "clsx";
import { Location, Clock, Call } from "iconsax-reactjs";
import { Center } from "./center-page-client";
interface CenterCardProps {
  center: Center;
  isSelected: boolean;
  onSelect: () => void;
}

export function CenterCard({ center, isSelected, onSelect }: CenterCardProps) {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`;

  return (
    <div
      onClick={onSelect}
      className={clsx(
        "bg-white rounded-2xl p-4 border cursor-pointer transition-all hover:shadow-sm",
        isSelected
          ? "border-red-300 ring-2 ring-red-100 shadow-sm"
          : "border-gray-100 hover:border-gray-200"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={clsx(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                center.type === "fixed"
                  ? "bg-red-50 text-red-600"
                  : "bg-amber-50 text-amber-700"
              )}
            >
              {center.type === "fixed" ? "Centre fixe" : "Mobile"}
            </span>
            <span
              className={clsx(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                center.openNow
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-500"
              )}
            >
              {center.openNow ? "Ouvert" : "Fermé"}
            </span>
          </div>
          <p className="text-sm font-bold text-gray-900 leading-tight">
            {center.name}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-red-600">{center.distance} km</p>
          <p className="text-xs text-gray-400">de vous</p>
        </div>
      </div>

      {/* Infos */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-start gap-2">
          <Location size={13} color="#9ca3af" className="mt-0.5 shrink-0" />
          <p className="text-xs text-gray-500 leading-tight">{center.address}</p>
        </div>
        <div className="flex items-start gap-2">
          <Clock size={13} color="#9ca3af" className="mt-0.5 shrink-0" />
          <p className="text-xs text-gray-500 leading-tight">{center.hours}</p>
        </div>
        <div className="flex items-start gap-2">
          <Call size={13} color="#9ca3af" className="mt-0.5 shrink-0" />
          <p className="text-xs text-gray-500">{center.phone}</p>
        </div>
      </div>

      {/* Stocks urgents */}
      {center.stocks.critical.length > 0 && (
        <div className="bg-red-50 rounded-xl px-3 py-2 mb-3">
          <p className="text-xs font-semibold text-red-600 mb-1">
            ⚠️ Urgent
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {center.stocks.critical.map((g) => (
              <span
                key={g}
                className="text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stocks nécessaires */}
      {center.stocks.needed.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-3">
          <span className="text-xs text-gray-400">Nécessaire :</span>
          {center.stocks.needed.map((g) => (
            <span
              key={g}
              className="text-xs font-medium bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full"
            >
              {g}
            </span>
          ))}
        </div>
      )}

      {/* Bouton itinéraire */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="flex items-center justify-center gap-2 w-full py-2 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-700 hover:text-red-600 text-xs font-semibold rounded-xl transition-all"
      >
        <Location size={13} />
        Obtenir l'itinéraire
      </a>
    </div>
  );
}