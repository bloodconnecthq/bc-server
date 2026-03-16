import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { fonts } from "@/config/font";
import clsx from "clsx";

export const metadata: Metadata = {
  title: "Xèdo Business – Merchant Dashboard",
  description: "Importe ton catalogue WhatsApp en 1 clic. Reçois des commandes et gère tes paiements de façon automatique et 100% gratuit.",
  keywords: ["Xèdo", "e-commerce", "WhatsApp Business", "marketplace", "Mobile Money", "Afrique", "vendeurs", "commerçants", "paiements en ligne"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-theme="light" className="light" >
      <body
        className={clsx(
          "min-h-screen text-foreground font-sans antialiased",
          fonts.bricolageGrotesk.className,
        )}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
