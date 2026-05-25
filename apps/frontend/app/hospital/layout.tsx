import { HospitalSidebar } from "@/components/hospital/sidebar";
import { AuthGuard } from "@/components/auth/auth-guard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "eBloodSys — Espace Hôpital",
  description: "Gestion des stocks sanguins et suivi des dons",
};

export default function HospitalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={["medecin", "infirmier", "admin_hopital"]}>
      <div className="flex min-h-screen bg-gray-50">
        <HospitalSidebar />
        <main className="flex-1 ml-64 p-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
