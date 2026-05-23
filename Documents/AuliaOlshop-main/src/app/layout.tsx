import React from "react";
import "./globals.css";
import PiAuthProvider from "../components/providers/PiAuthProvider";
import PiSdkLoader from "../components/PiSdkLoader";

export const metadata = {
  title: "Pi Network Marketplace",
  description: "Marketplace Multi-Vendor menggunakan Pi Network",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased font-sans bg-gray-50 text-gray-900">
        <PiSdkLoader />
        <PiAuthProvider>
          {children}
        </PiAuthProvider>
      </body>
    </html>
  );
}
