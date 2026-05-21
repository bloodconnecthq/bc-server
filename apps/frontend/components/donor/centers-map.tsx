"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Center } from "./center-page-client";

// Fix icônes Leaflet avec Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Icône personnalisée rouge pour les centres
const redIcon = new L.DivIcon({
  html: `<div style="
    width: 32px; height: 32px;
    background: #dc2626;
    border: 3px solid white;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  className: "",
});

// Icône sélectionnée
const selectedIcon = new L.DivIcon({
  html: `<div style="
    width: 40px; height: 40px;
    background: #7c3aed;
    border: 3px solid white;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 4px 12px rgba(124,58,237,0.5);
  "></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  className: "",
});

// Icône mobile (orange)
const mobileIcon = new L.DivIcon({
  html: `<div style="
    width: 28px; height: 28px;
    background: #f59e0b;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  className: "",
});

// Composant pour recentrer la carte
function MapRecenter({
  center,
}: {
  center: [number, number];
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14, { duration: 1.2 });
  }, [center, map]);
  return null;
}

interface CentersMapProps {
  centers: Center[];
  selectedCenter: Center | null;
  mapCenter: [number, number];
  onSelectCenter: (center: Center) => void;
}

export default function CentersMap({
  centers,
  selectedCenter,
  mapCenter,
  onSelectCenter,
}: CentersMapProps) {
  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{ width: "100%", height: "100%" }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapRecenter center={mapCenter} />

      {centers.map((center) => (
        <Marker
          key={center.id}
          position={[center.lat, center.lng]}
          icon={
            selectedCenter?.id === center.id
              ? selectedIcon
              : center.type === "mobile"
              ? mobileIcon
              : redIcon
          }
          eventHandlers={{ click: () => onSelectCenter(center) }}
        >
          <Popup>
            <div className="min-w-45 p-1">
              <p className="font-bold text-sm text-gray-900">{center.name}</p>
              <p className="text-xs text-gray-500 mt-1">{center.address}</p>
              <p className="text-xs text-gray-400 mt-1">{center.hours}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full ${
                    center.openNow ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <span className="text-xs text-gray-600">
                  {center.openNow ? "Ouvert maintenant" : "Fermé"}
                </span>
              </div>
              {center.stocks.critical.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-red-500 font-medium">
                    ⚠️ Urgent : {center.stocks.critical.join(", ")}
                  </p>
                </div>
              )}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-center text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                Itinéraire
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}