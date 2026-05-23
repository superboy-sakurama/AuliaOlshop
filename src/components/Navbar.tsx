"use client";

import React from 'react';
import { Search, ShoppingCart, User, Bell, Store } from 'lucide-react';
import { usePiAuth } from './providers/PiAuthProvider';
import Link from 'next/link';

interface NavbarProps {
  cartCount?: number;
}

export default function Navbar({ cartCount = 2 }: NavbarProps) {
  const { user, isAuthenticated, loginPiUser, error } = usePiAuth();

  // Simulasi penanganan filter kategori (pada project Next.js asli akan menggunakan route query/state)
  const handleCategoryFilter = (category: string) => {
    alert(`Menerapkan filter kategori: ${category} (Navigasi mulus berhasil disimulasikan tanpa reload menggunakan Router State!)`);
  };

  return (
    <>
      {error && (
        <div className="bg-orange-500 text-white text-xs sm:text-sm px-4 py-2 text-center w-full shadow-lg font-medium z-50 relative">
          {error}
        </div>
      )}
      <header className="bg-brand-red text-white py-4 sticky top-0 z-40 shadow-lg shadow-red-900/10 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link 
                href="/"
                className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 text-shadow-purple focus:outline-none"
              >
                 <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-brand-red shadow-purple-glow">
                   <ShoppingCart size={18} />
                 </div>
                 Aulia Olshop
              </Link>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-auto hidden sm:block">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Cari baju, gadget, atau kebutuhan lainnya..." 
                  className="w-full bg-white text-gray-900 rounded-md py-2.5 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-shadow shadow-purple-silhouette"
                />
                <button className="absolute right-0 top-0 h-full w-12 flex items-center justify-center bg-gray-100 rounded-r-md text-gray-500 hover:bg-gray-200 transition-colors">
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button className="relative text-white hover:text-purple-200 transition-colors focus:outline-none">
                <Bell size={22} className="sm:w-6 sm:h-6" />
                <span className="absolute -top-1.5 -right-1.5 bg-purple-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center ring-2 ring-brand-red">3</span>
              </button>
              <Link 
                href="/cart"
                className="relative text-white hover:text-purple-200 transition-colors focus:outline-none"
              >
                <ShoppingCart size={22} className="sm:w-6 sm:h-6" />
                <span className="absolute -top-1.5 -right-1.5 bg-purple-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center ring-2 ring-brand-red shadow-purple-glow">{cartCount}</span>
              </Link>
              <div className="w-px h-6 bg-white/30 hidden sm:block"></div>
              <Link 
                href="/seller"
                className="flex items-center gap-2 text-white hover:text-purple-200 transition-colors focus:outline-none bg-black/10 px-3 py-1.5 rounded-full"
              >
                <Store size={14} />
                <span className="text-xs font-medium">Toko Saya</span>
              </Link>
              
              {isAuthenticated ? (
                <button className="flex items-center gap-2 hover:text-purple-200 transition-colors focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-purple-glow">
                     <User size={18} />
                  </div>
                  <span className="text-sm font-medium hidden md:block">{user?.username}</span>
                </button>
              ) : (
                <button 
                  onClick={() => loginPiUser()}
                  className="flex items-center gap-2 bg-white text-brand-red px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none shadow-purple-glow text-sm font-bold"
                >
                  Login Pi
                </button>
              )}
            </div>

          </div>
        
        {/* Mobile Search Bar */}
        <div className="mt-4 sm:hidden">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Cari produk..." 
              className="w-full bg-white text-gray-900 rounded-md py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-purple-silhouette"
            />
            <button className="absolute right-0 top-0 h-full w-10 flex items-center justify-center bg-gray-100 rounded-r-md text-gray-400">
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="hidden sm:flex items-center gap-4 mt-3 text-xs text-rose-100 font-medium">
          <button onClick={() => handleCategoryFilter('Topup')} className="hover:text-white transition-colors focus:outline-none cursor-pointer">Pi Network Topup</button>
          <button onClick={() => handleCategoryFilter('Flash Sale')} className="hover:text-white transition-colors focus:outline-none cursor-pointer">Flash Sale</button>
          <button onClick={() => handleCategoryFilter('Elektronik')} className="hover:text-white transition-colors focus:outline-none cursor-pointer">Elektronik</button>
          <button onClick={() => handleCategoryFilter('Fashion Wanita')} className="hover:text-white transition-colors focus:outline-none cursor-pointer">Fashion Wanita</button>
        </div>
      </div>
    </header>
    </>
  );
}
