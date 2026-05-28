"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/app/providers/auth-provider";
import {
  getMyHospital, getMyHospitalStocks,
  type HospitalData, type StockData,
} from "@/lib/api/hospitalApi";
import { HospitalSettingsProfile }    from "@/components/hospital/settings/profile";
import { HospitalSettingsThresholds } from "@/components/hospital/settings/thresholds";
import { HospitalSettingsMembers }    from "@/components/hospital/settings/members";
import { HospitalSettingsSecurity }   from "@/components/hospital/settings/security";
import { People, ArrowRight2 }        from "iconsax-reactjs";

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

        {isAdmin ? (
          <Link
            href="/hospital/members"
            className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-6 py-5 hover:border-red-200 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                <People size={18} color="#dc2626" variant="Bold" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Gestion des membres</p>
                <p className="text-xs text-gray-400 mt-0.5">Créer, modifier et retirer les membres de votre hôpital</p>
              </div>
            </div>
            <ArrowRight2 size={16} color="#9ca3af" className="group-hover:text-red-500 transition-colors" />
          </Link>
        ) : (
          <HospitalSettingsMembers
            hopitalId={hopital?.id ?? null}
            isAdmin={false}
            token={token!}
          />
        )}

        <HospitalSettingsSecurity token={token!} />
      </div>
    </div>
  );
}
