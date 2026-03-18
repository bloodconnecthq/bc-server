import { ConsoleSidebar } from "@/components/console/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blood-Connect — Console CNTS",
  description: "Tableau de bord administrateur du Centre National de Transfusion Sanguine",
};

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <ConsoleSidebar />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}