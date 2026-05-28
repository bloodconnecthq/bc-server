"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/auth-provider";
import { getMyHospital, type HospitalData } from "@/lib/api/hospitalApi";
import { HospitalMembersManager } from "@/components/hospital/members/manager";

export default function HospitalMembersPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [hopital, setHopital] = useState<HospitalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== "admin_hopital") {
      router.replace("/hospital");
    }
  }, [user, router]);

  useEffect(() => {
    if (!token) return;
    getMyHospital(token)
      .then(setHopital)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (user?.role !== "admin_hopital") return null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des membres</h1>
          <p className="text-sm text-gray-500 mt-1">
            Créez des comptes, définissez les rôles et gérez l'accès de votre équipe
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <HospitalMembersManager
          token={token!}
          hopitalNom={hopital?.nom ?? "Mon établissement"}
        />
      )}
    </div>
  );
}
