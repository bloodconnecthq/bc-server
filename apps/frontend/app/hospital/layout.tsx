import type { Metadata } from "next";
import { HospitalSidebar } from "@/components/hospital/sidebar";

export const metadata: Metadata = {
  title: "Blood-Connect — Espace Hôpital",
  description: "Gestion des stocks sanguins et suivi des dons",
};

export default function HospitalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <HospitalSidebar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}