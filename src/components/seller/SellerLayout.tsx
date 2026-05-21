import React, { ReactNode } from 'react';
import { Store, Package, ShoppingBag, Wallet, Settings, LogOut } from 'lucide-react';
import Navbar from '../Navbar';

interface SellerLayoutProps {
  children: ReactNode;
  activeMenu?: 'dashboard' | 'products' | 'orders' | 'finance' | 'settings';
  onNavigate?: (page: 'home' | 'cart' | 'seller') => void;
}

export default function SellerLayout({ children, activeMenu = 'products', onNavigate }: SellerLayoutProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Store },
    { id: 'products', label: 'Kelola Produk', icon: Package },
    { id: 'orders', label: 'Pesanan Masuk', icon: ShoppingBag },
    { id: 'finance', label: 'Saldo Pi', icon: Wallet },
    { id: 'settings', label: 'Pengaturan Toko', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar onNavigate={onNavigate} />
      
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Navigasi Seller */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-24 shadow-purple-silhouette">
            <div className="flex items-center gap-3 mb-6 p-2">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-xl shadow-purple-glow">
                TS
              </div>
              <div>
                <h3 className="font-bold text-gray-900 leading-tight">Toko Saya</h3>
                <span className="text-xs text-gray-500">Aulia Olshop Partner</span>
              </div>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                
                return (
                  <button
                    key={item.id}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-brand-red text-white shadow-md shadow-red-900/10' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-brand-red'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 pt-4 border-t border-gray-100">
              <button 
                onClick={() => onNavigate?.('home')}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-brand-red hover:bg-gray-50 transition-colors"
              >
                <LogOut size={18} />
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </aside>

        {/* Konten Utama */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
