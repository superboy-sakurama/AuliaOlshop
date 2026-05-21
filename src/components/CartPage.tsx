import React, { useState } from 'react';
import { Trash2, Store, Minus, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { authenticatePiUser, createPiPayment } from '../lib/pi-sdk';

// Mock data to simulate fetching from Supabase
const initialCartItems = [
  {
    id: 'cart_1',
    store: 'Elektronik Pi Mall',
    product: {
      id: 'p_1',
      name: 'Smartphone X-Pro 5G 256GB - Garansi Resmi',
      price_pi: 250.5,
      image_url: '/mock-image.jpg',
    },
    quantity: 1,
    selected: true,
  },
  {
    id: 'cart_2',
    store: 'Fashion Aulia',
    product: {
      id: 'p_2',
      name: 'Kemeja Flanel Kotak Pria Premium - Merah Hitam',
      price_pi: 15.0,
      image_url: '/mock-image.jpg',
    },
    quantity: 2,
    selected: true,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [isProcessingPi, setIsProcessingPi] = useState(false);
  const [piUser, setPiUser] = useState<any>(null);

  const handlePiCheckout = async () => {
    setIsProcessingPi(true);
    try {
      // 1. Autentikasi Pengguna
      let currentUser = piUser;
      if (!currentUser) {
        currentUser = await authenticatePiUser();
        setPiUser(currentUser);
      }

      // 2. Inisiasi Pembayaran menggunakan Pi
      const memo = "Pembelian Aulia Olshop";
      const orderId = `ORD-${Date.now()}`; // Mock Order ID
      
      const payment = await createPiPayment(selectedTotal, memo, orderId);
      
      alert(`Berhasil meluncurkan SDK Pembayaran: ${payment?.identifier || 'Berhasil'}`);
    } catch (error) {
      alert("Kesalahan memproses pembayaran Pi (Pastikan dibuka di Pi Browser/Sandbox)");
      console.error(error);
    } finally {
      setIsProcessingPi(false);
    }
  };

  const toggleSelect = (id: string) => {
    setCartItems(items => items.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const updateQuantity = (id: string, change: number) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const selectedTotal = cartItems
    .filter(item => item.selected)
    .reduce((total, item) => total + (item.product.price_pi * item.quantity), 0);

  const selectedCount = cartItems.filter(item => item.selected).length;

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Keranjang Belanja</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart Items List */}
        <div className="flex-1 space-y-4">
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center shadow-sm">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                 Keranjang Kosong
              </div>
              <h2 className="text-lg font-medium text-gray-900">Keranjang Anda masih kosong</h2>
              <p className="text-gray-500 mt-2">Mulai belanja dan bayar menggunakan Pi dari jaringan Anda!</p>
            </div>
          ) : (
            cartItems.map(item => (
              <motion.div 
                layout
                key={item.id} 
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-purple-silhouette transition-shadow"
              >
                {/* Store Header */}
                <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-3">
                  <input 
                    type="checkbox" 
                    checked={item.selected}
                    onChange={() => toggleSelect(item.id)}
                    className="w-4 h-4 text-brand-red rounded focus:ring-purple-400 accent-brand-red"
                  />
                  <Store size={16} className="text-gray-500" />
                  <span className="font-medium text-gray-800 text-sm">{item.store}</span>
                </div>

                {/* Product Detail */}
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-md flex-shrink-0 border border-gray-200"></div>
                  <div className="flex-1 flex flex-col justify-between">
                    <h3 className="text-gray-800 text-sm font-medium line-clamp-2">{item.product.name}</h3>
                    <div className="font-bold text-brand-red mt-1">{item.product.price_pi.toLocaleString('id-ID')} Pi</div>
                    
                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Control */}
                      <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <div className="w-10 text-center text-sm font-medium border-x border-gray-200 py-1">
                          {item.quantity}
                        </div>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-brand-red transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Checkout Summary Sidebar */}
        <div className="w-full lg:w-[340px]">
          <div className="bg-white rounded-lg shadow-purple-glow p-5 sticky top-24 border border-purple-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">Ringkasan Belanja</h2>
            
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Total Harga ({selectedCount} Barang)</span>
                <span>{selectedTotal.toLocaleString('id-ID')} Pi</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total Diskon Barang</span>
                <span className="text-green-500">-0 Pi</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800">Total Tagihan</span>
                <span className="text-xl font-bold text-brand-red text-shadow-purple">{selectedTotal.toLocaleString('id-ID')} Pi</span>
              </div>
              {/* Saldo info simulating fetching from users table */}
              <div className="text-xs text-purple-600 text-right mt-1 font-medium">Saldo Anda: 1,500.20 Pi</div>
            </div>

            <button 
              disabled={selectedCount === 0 || isProcessingPi}
              onClick={handlePiCheckout}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-white transition-all shadow-purple-glow ${
                selectedCount === 0 || isProcessingPi
                  ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                  : 'bg-brand-red hover:bg-rose-700 hover:scale-[1.02] active:scale-95'
              }`}
            >
              {isProcessingPi ? (
                <span className="flex items-center gap-2">Memproses <span className="animate-pulse">...</span></span>
              ) : (
                <span>Bayar dengan Pi ({selectedCount})</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
