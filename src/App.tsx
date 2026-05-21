/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductGrid, { Product } from './components/ProductGrid';
import CartPage from './components/CartPage';
import SellerLayout from './components/seller/SellerLayout';
import AddProductForm from './components/seller/AddProductForm';

// Data produk statis untuk keperluan preview (seolah-olah diambil dari Supabase)
const mockProducts: Product[] = [
  { id: '1', name: 'Sepatu Sneakers Pria Original - Putih Merah Keren', price_pi: 25.5, image_url: '', rating: 4.8, sold: 1205, discount: 15 },
  { id: '2', name: 'Jam Tangan Pintar Smartwatch Gen 5', price_pi: 45.0, image_url: '', rating: 4.9, sold: 3400 },
  { id: '3', name: 'Kemeja Polos Wanita Lengan Panjang Korea', price_pi: 8.2, image_url: '', rating: 4.7, sold: 512 },
  { id: '4', name: 'Laptop Gaming XZY RTX 4060 16GB RAM', price_pi: 850.0, image_url: '', rating: 5.0, sold: 45 },
  { id: '5', name: 'Kacamata Hitam Anti UV Polarized', price_pi: 3.5, image_url: '', rating: 4.6, sold: 890, discount: 50 },
  { id: '6', name: 'Tas Ransel Pria Anti Air Kapasitas Besar', price_pi: 12.0, image_url: '', rating: 4.8, sold: 2100 },
  { id: '7', name: 'Headset Bluetooth TWS Earbuds', price_pi: 18.5, image_url: '', rating: 4.7, sold: 4500, discount: 20 },
  { id: '8', name: 'Serum Wajah Anti Aging Original', price_pi: 9.8, image_url: '', rating: 4.9, sold: 1800 },
  { id: '9', name: 'Setelan Olahraga Wanita Senam Yoga', price_pi: 14.5, image_url: '', rating: 4.8, sold: 920 },
  { id: '10', name: 'Blender Portable Kapsul Ekstraktor Buah', price_pi: 6.5, image_url: '', rating: 4.5, sold: 310 },
  { id: '11', name: 'Kaos Polos Cotton Combed 30s Ceria', price_pi: 2.1, image_url: '', rating: 4.9, sold: 15000 },
  { id: '12', name: 'Gantungan Kunci Kulit Asli Custom Nama', price_pi: 1.5, image_url: '', rating: 4.8, sold: 1100, discount: 10 },
];

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'cart' | 'seller'>('home');

  if (currentView === 'seller') {
    return (
      <SellerLayout onNavigate={setCurrentView}>
        <div className="fade-in-container">
          <AddProductForm />
        </div>
      </SellerLayout>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navbar bertindak seperti Header di layout.tsx */}
      <Navbar onNavigate={setCurrentView} />
      
      {/* Main Container bertindak seperti {children} di layout.tsx */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {currentView === 'home' ? (
          <div className="fade-in-container">
            <HeroSection />
            
            <section className="mt-8 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                Produk Pilihan Hari Ini
              </h2>
              <ProductGrid products={mockProducts} />
            </section>
          </div>
        ) : (
          <div className="fade-in-container">
            <CartPage />
          </div>
        )}
      </main>
    </div>
  );
}
