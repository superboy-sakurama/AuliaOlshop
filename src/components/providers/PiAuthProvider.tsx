"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Script from 'next/script';

// Definisikan struktur data user dari Pi Network
interface PiUser {
  username: string;
  accessToken: string;
  uid?: string;
}

// Definisikan tipe untuk context
interface PiAuthContextType {
  user: PiUser | null;
  isAuthenticated: boolean;
  loginPiUser: () => Promise<void>;
  error: string | null;
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

export function usePiAuth() {
  const context = useContext(PiAuthContext);
  if (!context) {
    throw new Error('usePiAuth harus digunakan di dalam PiAuthProvider');
  }
  return context;
}

export default function PiAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PiUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loginPiUser = async () => {
    try {
      setError(null);
      
      // Pastikan Pi SDK sudah dimuat
      if (typeof window !== 'undefined' && window.Pi) {
        // Inisialisasi Pi SDK (sandbox: true untuk Testnet / development)
        window.Pi.init({ version: "2.0", sandbox: true });
        
        const scopes = ['username', 'payments'];
        
        // Meminta auntentikasi dari aplikasi Pi
        const authResults = await window.Pi.authenticate(scopes, {
          onIncompletePaymentFound: (payment: any) => {
            console.log("Ditemukan pembayaran yang belum selesai:", payment);
            // Logika untuk mengirimkan ID pembayaran ini ke backend Anda untuk diverifikasi & diselesaikan
          }
        });
        
        setUser({
          username: authResults.user.username,
          accessToken: authResults.accessToken,
          uid: authResults.user.uid
        });
        
      } else {
        throw new Error("Pi SDK belum terinisialisasi atau tidak ditemukan.");
      }
    } catch (err: any) {
      console.error("Gagal melakukan login Pi:", err);
      // Pesan ramah jika pengguna tidak membuka aplikasi dari Pi Browser
      setError("Autentikasi gagal. Silakan buka aplikasi ini melalui Pi Browser untuk menikmati fitur login, atau pastikan koneksi internet Anda stabil.");
    }
  };

  return (
    <PiAuthContext.Provider value={{ user, isAuthenticated: !!user, loginPiUser, error }}>
      {/* 
        Memuat Pi SDK secara asinkron dari sumber resminya.
        strategy="beforeInteractive" memastikan skrip dimuat sebelum ada interaksi,
        bisa juga "afterInteractive" tergantung pada kebutuhan prioritas load Anda.
      */}
      <Script 
        src="https://sdk.minepi.com/pi-sdk.js" 
        strategy="afterInteractive" 
        onLoad={() => {
          console.log("Pi SDK berhasil dimuat");
        }}
      />
      {children}
    </PiAuthContext.Provider>
  );
}

// Penambahan tipe global agar TypeScript mengenali window.Pi
declare global {
  interface Window {
    Pi: any;
  }
}
