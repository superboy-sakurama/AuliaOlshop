"use client";

import { useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ProductGrid, { Product } from '../components/ProductGrid';
import CartPage from '../components/CartPage';
import SellerLayout from '../components/seller/SellerLayout';
import AddProductForm from '../components/seller/AddProductForm';
import ReviewForm from '../components/reviews/ReviewForm';
import ProductReviewsList from '../components/reviews/ProductReviewsList';

// Data produk statis untuk keperluan preview
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

export default function Page() {
  const [currentView, setCurrentView] = useState<'home' | 'cart' | 'seller'>('home');
  const [cartCount, setCartCount] = useState(2);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleAddToCart = (product: Product) => {
    setCartCount(prev => prev + 1);
    setToastMessage(`"${product.name}" berhasil ditambahkan ke Keranjang Belanja Anda!`);
    setShowToast(true);
    
    // Auto-dismiss setelah 3.5 detik
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

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
    <div className="flex flex-col relative w-full">
      <Navbar onNavigate={setCurrentView} cartCount={cartCount} />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {currentView === 'home' ? (
          <div className="fade-in-container">
            <HeroSection />
            
            <section id="product-grid-section" className="mt-8 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                Produk Pilihan Hari Ini
              </h2>
              <ProductGrid products={mockProducts} onAddToCart={handleAddToCart} />
            </section>

            <section className="mt-12 pt-8 border-t border-gray-200">
              <div className="mb-6">
                <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Fitur Baru Keamanan Ulasan</span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">Ulasan Pembeli Terverifikasi (Anti-Fake Reviews)</h2>
                <p className="text-sm text-gray-500 mt-1">Hanya pembeli yang sudah menyelesaikan pembayarannya (status completed) via Pi Network Escrow yang dapat mengisi form ulasan di bawah ini.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <ProductReviewsList />
                <ReviewForm productId="example-uuid" orderId="order-completed-uuid" />
              </div>
            </section>
          </div>
        ) : (
          <div className="fade-in-container">
            <CartPage />
          </div>
        )}
      </main>

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white border-l-4 border-brand-red rounded-lg shadow-2xl shadow-purple-900/40 p-4 border border-gray-100 flex items-start gap-3 animate-bounce-subtle">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600 font-bold text-lg">
             π
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-sm">Produk Ditambahkan</h4>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{toastMessage}</p>
            <div className="mt-2.5 flex gap-3">
              <button 
                onClick={() => {
                  setCurrentView('cart');
                  setShowToast(false);
                }} 
                className="text-white bg-brand-red hover:bg-rose-700 text-[11px] font-bold px-3 py-1.5 rounded-md transition-colors shadow-sm"
              >
                Lihat Keranjang
              </button>
              <button 
                onClick={() => setShowToast(false)} 
                className="text-gray-500 hover:text-gray-800 text-[11px] font-medium px-2 py-1.5 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
