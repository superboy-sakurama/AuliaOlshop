'use client';

import { Plus, Edit2, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  sold: number;
  image: string;
  status: 'aktif' | 'tidak aktif';
  rating: number;
  category: string;
}

export default function SellerProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data produk
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Laptop Gaming RTX 3060',
      price: 8500.00,
      stock: 5,
      sold: 12,
      image: '💻',
      status: 'aktif',
      rating: 4.8,
      category: 'Elektronik'
    },
    {
      id: '2',
      name: 'Smartphone Android 5G',
      price: 4200.00,
      stock: 15,
      sold: 28,
      image: '📱',
      status: 'aktif',
      rating: 4.9,
      category: 'Elektronik'
    },
    {
      id: '3',
      name: 'Headphone Bluetooth Premium',
      price: 1500.00,
      stock: 3,
      sold: 5,
      image: '🎧',
      status: 'aktif',
      rating: 4.7,
      category: 'Audio'
    },
    {
      id: '4',
      name: 'Wireless Mouse',
      price: 450.00,
      stock: 0,
      sold: 42,
      image: '🖱️',
      status: 'tidak aktif',
      rating: 4.6,
      category: 'Aksesoris'
    }
  ];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fade-in-container space-y-8">
      {/* HEADER SECTION */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 border-l-4 border-red-600 pl-4">
              Kelola Produk
            </h1>
            <p className="text-slate-600 pl-4 text-sm mt-2">
              Atur produk yang Anda jual di marketplace Aulia Olshop
            </p>
          </div>
          <button className="
            flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 
            hover:from-red-700 hover:to-rose-700
            text-white px-6 py-3 rounded-xl font-bold 
            shadow-[0_0_20px_rgba(168,85,247,0.3)] 
            hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]
            transition-all duration-300 transform hover:scale-105 active:scale-95
          ">
            <Plus size={20} />
            Tambah Produk Baru
          </button>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari nama produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all bg-white"
        >
          <option value="all">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="tidak aktif">Tidak Aktif</option>
        </select>
      </div>

      {/* PRODUCTS TABLE */}
      {filteredProducts.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Produk</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Harga (Pi)</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Stok</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Terjual</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg text-2xl flex items-center justify-center">
                          {product.image}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">π {product.price.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        product.stock > 0 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="font-bold text-slate-900">{product.sold}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="font-bold text-slate-900">{product.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        product.status === 'aktif'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {product.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors" title="Visibility">
                          {product.status === 'aktif' ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            📦
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Belum Ada Produk</h3>
          <p className="text-slate-600 max-w-sm mx-auto mb-6">
            Mulai jangkau lebih banyak pembeli dengan menambahkan produk pertama Anda menggunakan Pi Network.
          </p>
          <button className="
            flex items-center gap-2 mx-auto
            bg-gradient-to-r from-red-600 to-rose-600 
            hover:from-red-700 hover:to-rose-700
            text-white px-6 py-3 rounded-xl font-bold 
            shadow-[0_0_20px_rgba(168,85,247,0.3)]
            transition-all duration-300
          ">
            <Plus size={18} />
            Tambah Produk Pertama
          </button>
        </div>
      )}
    </div>
  );
}
