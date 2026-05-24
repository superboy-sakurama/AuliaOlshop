"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { usePiAuth } from '@/components/providers/PiAuthProvider';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ClipboardList, 
  Wallet, 
  Settings, 
  ArrowLeft, 
  Menu, 
  X,
  Bell,
  Store
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isSeller, isLoading } = usePiAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Proteksi route - redirect jika tidak seller atau tidak login
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isSeller)) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, isSeller, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Memverifikasi akses penjual...</p>
        </div>
      </div>
    );
  }

  // Access denied - tidak ditampilkan karena akan redirect, tapi safety measure
  if (!isAuthenticated || !isSeller) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-md border border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Akses Ditolak</h1>
          <p className="text-slate-600 mb-4">Halaman ini hanya tersedia untuk penjual terdaftar.</p>
          <Link href="/" className="inline-block bg-red-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-700 transition-all">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // Daftar Menu Utama Sesuai Gambar Antarmuka Aulia Olshop
  const menuItems: SidebarItem[] = [
    { name: 'Dashboard', href: '/seller', icon: LayoutDashboard },
    { name: 'Kelola Produk', href: '/seller/products', icon: ShoppingBag },
    { name: 'Pesanan Masuk', href: '/seller/orders', icon: ClipboardList },
    { name: 'Saldo Pi', href: '/seller/wallet', icon: Wallet },
    { name: 'Pengaturan Toko', href: '/seller/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col font-sans">
      
      {/* HEADER ATAS (NAVBAR SELLER CENTRE) */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Tombol Hamburger untuk Layar Mobile */}
          <button 
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Logo Brand Marketplace */}
          <div className="flex items-center gap-2">
            <div className="bg-red-600 text-white p-2 rounded-lg shadow-md shadow-purple-500/20">
              <Store size={22} />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Aulia<span className="text-red-600">Olshop</span> <span className="text-xs font-semibold px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full border border-purple-200">Partner</span>
            </span>
          </div>
        </div>

        {/* Notifikasi & Informasi Akun Sistem */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
          </button>
          <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center font-bold text-sm shadow-inner">
              TS
            </div>
            <span className="font-medium text-sm text-slate-700">Toko Saya</span>
          </div>
        </div>
      </header>

      {/* STRUKTUR UTAMA DASHBOARD */}
      <div className="flex flex-1 relative">
        
        {/* SIDEBAR NAVIGASI (Desktop & Mobile Backdrop) */}
        <aside className={`
          fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-100 p-6 flex flex-col justify-between pt-24 lg:pt-6 transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:h-[calc(100vh-65px)]
          ${isMobileOpen ? 'translate-x-0 shadow-2xl shadow-purple-900/20' : '-translate-x-full'}
        `}>
          
          {/* Bagian Atas Sidebar: Profil Toko & Menu */}
          <div className="flex flex-col gap-6">
            {/* Widget Mini Profil Toko */}
            <div className="flex items-center gap-3 bg-gradient-to-br from-slate-50 to-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-purple-500/30">
                TS
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 tracking-tight">Toko Saya</span>
                <span className="text-xs text-slate-400 font-medium">Aulia Olshop Partner</span>
              </div>
            </div>

            {/* List Menu Dinamis */}
            <nav className="flex flex-col gap-1.5">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)} // Tutup otomatis jika di mobile
                    className={`
                      flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 group
                      ${isActive 
                        ? 'bg-red-600 text-white shadow-[0_4px_20px_rgba(168,85,247,0.45)] scale-[1.02]' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }
                    `}
                  >
                    <IconComponent className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-red-500'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bagian Bawah Sidebar: Tombol Keluar / Kembali ke Beranda */}
          <div className="border-t border-slate-100 pt-4">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-transform duration-200 group-hover:-translate-x-1" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </aside>

        {/* Backdrop Transparan saat Sidebar Mobile Terbuka */}
        {isMobileOpen && (
          <div 
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-20 lg:hidden"
          ></div>
        )}

        {/* PANEL KONTEN DINAMIS (Kanan) */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-h-[calc(100vh-65px)] w-full">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}