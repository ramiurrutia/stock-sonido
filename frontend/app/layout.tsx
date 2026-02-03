import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";
import PermissionsRefresher from "./components/PermissionRefresher";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Audio Bahía Blanca",
  description: "App para control de stock de sonido C9 y 39 - Bahía Blanca",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        />
      </head>
      <body className={`${montserrat.className} antialiased`}>
        <Providers>
          <PermissionsRefresher />
          {children}
        </Providers>
      </body>
    </html>
  );
}
