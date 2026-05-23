"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { registerOrLoginUser } from '../../app/actions/authActions';

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
  loginPiUser: (isAuto?: boolean) => Promise<void>;
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

  const loginPiUser = async (isAuto = false) => {
    try {
      setError(null);
      
      // Pastikan Pi SDK sudah dimuat dan diinisialisasi
      if (typeof window !== 'undefined' && window.Pi) {
        // Tunggu hingga Pi SDK siap (sudah di-init dari layout)
        let attempts = 0;
        while (!window.Pi || !window.Pi.authenticate) {
          if (attempts > 50) throw new Error("Pi SDK tidak tersedia setelah timeout");
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        const scopes = ['username', 'payments'];
        
        // Meminta auntentikasi dari aplikasi Pi
        const authResults = await window.Pi.authenticate(scopes, {
          onIncompletePaymentFound: (payment: any) => {
            console.log("Ditemukan pembayaran yang belum selesai:", payment);
          }
        });
        
        const piUserData = {
          username: authResults.user.username,
          accessToken: authResults.accessToken,
          uid: authResults.user.uid
        };

        setUser(piUserData);
        await registerOrLoginUser(piUserData);
        
      } else {
        if (isAuto) return; // Silent fail if auto-login outside Pi Browser
        const useSimulation = window.confirm("Notifikasi: Anda sedang mengakses di luar Pi Browser.\n\nApakah Anda ingin melanjutkan dengan 'Login Simulasi' untuk ujicoba?");
        if (useSimulation) {
          const mockUser = {
            username: "tester_pi_user",
            accessToken: "mock_access_token_12345",
            uid: "mock_uid_12345"
          };
          setUser(mockUser);
          await registerOrLoginUser(mockUser);
          alert("Login simulasi berhasil!");
          return;
        } else {
            throw new Error("Pi SDK belum terinisialisasi atau tidak ditemukan.");
        }
      }
    } catch (err: any) {
      console.error("Gagal melakukan login Pi:", err);
      // Fallback simulasi jika di luar Pi Browser untuk testing (opsional) atau berikan notifikasi tegas:
      if (!isAuto) {
        const errorMsg = "Harap melakukan login dengan membuka aplikasi ini melalui Pi Browser untuk keamanan transaksi Anda. \n\n(Catatan: Jika Anda sedang testing di luar Pi Browser, fungsi ini tetap ditahan demi keamanan).";
        setError(errorMsg);
        alert("Pemberitahuan Sistem:\n\n" + errorMsg);
      }
    }
  };

  // Optional: Auto-login on mount if window.Pi is somehow already available 
  // (e.g. fast refresh or script already cached)
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.Pi && !user) {
      loginPiUser(true);
    }
  }, []);

  return (
    <PiAuthContext.Provider value={{ user, isAuthenticated: !!user, loginPiUser, error }}>
      {/* Pi SDK dimuat dari layout.tsx dengan strategy beforeInteractive */}
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
