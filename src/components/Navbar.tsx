"use client";

import React from 'react';
import { Search, ShoppingCart, User, Bell, Store } from 'lucide-react';

/**
 * PANDUAN NEXT.JS DEVELOPER:
 * Untuk navigasi antarmuka yang mulus tanpa reload halaman di Next.js App Router,
 * Anda dapat menggunakan `useRouter` dari `next/navigation` seperti contoh di bawah ini:
 * 
 * ```typescript
 * import { useRouter } from 'next/navigation';
 * 
 * const router = useRouter();
 * // Navigasi ke halaman detail tanpa reload halaman:
 * router.push(`/products/${productId}`);
 * ```
 */

interface NavbarProps {
  onNavigate?: (page: 'home' | 'cart' | 'seller') => void;
  cartCount?: number;
}

export default function Navbar({ onNavigate, cartCount = 2 }: NavbarProps) {
  // Simulasi penanganan filter kategori (pada project Next.js asli akan menggunakan route query/state)
  const handleCategoryFilter = (category: string) => {
    alert(`Menerapkan filter kategori: ${category} (Navigasi mulus berhasil disimulasikan tanpa reload menggunakan Router State!)`);
  };

  return (
    <header className="bg-brand-red text-white py-4 sticky top-0 z-50 shadow-lg shadow-red-900/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button 
              onClick={() => onNavigate?.('home')}
              className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 text-shadow-purple focus:outline-none"
            >
               <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-brand-red shadow-purple-glow">
                 <ShoppingCart size={18} />
               </div>
               Aulia Olshop
            </button>
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
            <button 
              onClick={() => onNavigate?.('cart')}
              className="relative text-white hover:text-purple-200 transition-colors focus:outline-none"
            >
              <ShoppingCart size={22} className="sm:w-6 sm:h-6" />
              <span className="absolute -top-1.5 -right-1.5 bg-purple-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center ring-2 ring-brand-red shadow-purple-glow">{cartCount}</span>
            </button>
            <div className="w-px h-6 bg-white/30 hidden sm:block"></div>
            <button 
              onClick={() => onNavigate?.('seller')}
              className="flex items-center gap-2 text-white hover:text-purple-200 transition-colors focus:outline-none bg-black/10 px-3 py-1.5 rounded-full"
            >
              <Store size={14} />
              <span className="text-xs font-medium">Toko Saya</span>
            </button>
            <button className="flex items-center gap-2 hover:text-purple-200 transition-colors focus:outline-none">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-purple-glow">
                 <User size={18} />
              </div>
              <span className="text-sm font-medium hidden md:block">Budi Pi</span>
            </button>
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
          <button onClick={() => handleCategoryFilter('MLM')} className="hover:text-white transition-colors focus:outline-none cursor-pointer">Jaringan MLM Saya</button>
          <button onClick={() => handleCategoryFilter('Flash Sale')} className="hover:text-white transition-colors focus:outline-none cursor-pointer">Flash Sale</button>
          <button onClick={() => handleCategoryFilter('Elektronik')} className="hover:text-white transition-colors focus:outline-none cursor-pointer">Elektronik</button>
          <button onClick={() => handleCategoryFilter('Fashion Wanita')} className="hover:text-white transition-colors focus:outline-none cursor-pointer">Fashion Wanita</button>
        </div>
      </div>
    </header>
  );
}
