import { DonorSidebar } from "@/components/donor/sidebar";
import { AuthGuard } from "@/components/auth/auth-guard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "eBloodSys — Espace Donneur",
  description: "Votre espace personnel de don de sang",
};

export default function DonorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={["donneur"]}>
      <div className="flex min-h-screen bg-gray-50">
        <DonorSidebar />
        <main className="flex-1 ml-64 p-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
