"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/providers/auth-provider";
import {
  getMyHospital, getMyHospitalStocks,
  type HospitalData, type StockData,
} from "@/lib/api/hospitalApi";
import { HospitalSettingsProfile }    from "@/components/hospital/settings/profile";
import { HospitalSettingsThresholds } from "@/components/hospital/settings/thresholds";
import { HospitalSettingsMembers }    from "@/components/hospital/settings/members";
import { HospitalSettingsSecurity }   from "@/components/hospital/settings/security";

export default function HospitalSettingsPage() {
  const { token, user } = useAuth();
  const [hopital, setHopital] = useState<HospitalData | null>(null);
  const [stocks, setStocks]   = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "admin_hopital";

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [h, s] = await Promise.all([getMyHospital(token), getMyHospitalStocks(token)]);
      setHopital(h);
      setStocks(s);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-sm text-gray-500 mt-1">
          {isAdmin
            ? "Administration de votre établissement"
            : "Informations de votre établissement · certaines actions sont réservées à l'administrateur"}
        </p>
      </div>

      <div className="space-y-6">
        {hopital && (
          <HospitalSettingsProfile
            hopital={hopital}
            isAdmin={isAdmin}
            token={token!}
            onUpdated={setHopital}
          />
        )}

        <HospitalSettingsThresholds
          stocks={stocks}
          isAdmin={isAdmin}
          token={token!}
          onUpdated={setStocks}
        />

        <HospitalSettingsMembers
          hopitalId={hopital?.id ?? null}
          isAdmin={isAdmin}
          token={token!}
        />

        <HospitalSettingsSecurity token={token!} />
      </div>
    </div>
  );
}
