import React from "react";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
