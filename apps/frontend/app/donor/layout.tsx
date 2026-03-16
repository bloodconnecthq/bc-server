import { DonorSidebar } from "@/components/donor/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blood-Connect — Espace Donneur",
  description: "Votre espace personnel de don de sang",
};

export default function DonorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DonorSidebar />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}