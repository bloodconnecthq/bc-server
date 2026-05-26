import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { fonts } from "@/config/font";
import clsx from "clsx";

export const metadata: Metadata = {
  title: "eBloodSys - Chaque don compte, chaque vie aussi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-theme="light" className="light" suppressHydrationWarning>
      <body
        className={clsx(
          "min-h-screen text-foreground font-sans antialiased",
          fonts.bricolageGrotesk.className,
        )}
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
