'use client';

import { ShoppingBag, ChevronRight, Search, Filter } from 'lucide-react';
import { useState } from 'react';

interface Order {
  id: string;
  buyer: string;
  items: string;
  amount: number;
  status: 'Selesai' | 'Diproses' | 'Tertunda' | 'Dibatalkan';
  date: string;
  time: string;
}

export default function SellerOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data pesanan
  const mockOrders: Order[] = [
    {
      id: 'TRX-1029',
      buyer: '@budipi',
      items: 'Laptop Gaming RTX 3060 (1x)',
      amount: 8500.00,
      status: 'Selesai',
      date: '22 Mei 2026',
      time: '14:30'
    },
    {
      id: 'TRX-1030',
      buyer: '@sitinur',
      items: 'Smartphone Android 5G (1x)',
      amount: 4200.00,
      status: 'Diproses',
      date: '22 Mei 2026',
      time: '12:15'
    },
    {
      id: 'TRX-1031',
      buyer: '@andi_crypto',
      items: 'Headphone Bluetooth Premium (2x), Wireless Mouse (1x)',
      amount: 3450.00,
      status: 'Tertunda',
      date: '21 Mei 2026',
      time: '09:00'
    },
    {
      id: 'TRX-1032',
      buyer: '@john_tech',
      items: 'Smartphone Android 5G (1x)',
      amount: 4200.00,
      status: 'Selesai',
      date: '20 Mei 2026',
      time: '16:45'
    },
    {
      id: 'TRX-1033',
      buyer: '@sarah_store',
      items: 'Wireless Mouse (5x)',
      amount: 2250.00,
      status: 'Dibatalkan',
      date: '20 Mei 2026',
      time: '10:30'
    },
    {
      id: 'TRX-1034',
      buyer: '@masbro',
      items: 'Headphone Bluetooth Premium (1x)',
      amount: 1500.00,
      status: 'Selesai',
      date: '19 Mei 2026',
      time: '11:20'
    }
  ];

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.buyer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      'Selesai': { bg: 'bg-green-100', text: 'text-green-700' },
      'Diproses': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'Tertunda': { bg: 'bg-orange-100', text: 'text-orange-700' },
      'Dibatalkan': { bg: 'bg-red-100', text: 'text-red-700' }
    };
    return colors[status] || { bg: 'bg-slate-100', text: 'text-slate-700' };
  };

  const totalRevenue = filteredOrders.reduce((sum, order) => {
    if (order.status !== 'Dibatalkan') {
      return sum + order.amount;
    }
    return sum;
  }, 0);

  const stats = [
    { label: 'Total Pesanan', value: filteredOrders.length, color: 'text-blue-600' },
    { label: 'Pesanan Selesai', value: filteredOrders.filter(o => o.status === 'Selesai').length, color: 'text-green-600' },
    { label: 'Pesanan Diproses', value: filteredOrders.filter(o => o.status === 'Diproses').length, color: 'text-purple-600' },
    { label: 'Total Pendapatan', value: `π ${totalRevenue.toFixed(2)}`, color: 'text-red-600' }
  ];

  return (
    <div className="fade-in-container space-y-8">
      {/* HEADER SECTION */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-900 border-l-4 border-red-600 pl-4">
          Pesanan Masuk
        </h1>
        <p className="text-slate-600 pl-4 text-sm mt-2">
          Pantau dan kelola pesanan dari pelanggan Anda secara real-time
        </p>
      </div>

      {/* STATISTICS SECTION */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-md transition-all">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* SEARCH & FILTER */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari ID pesanan atau nama pembeli..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all bg-white flex items-center gap-2"
        >
          <option value="all">Semua Status</option>
          <option value="Selesai">Selesai</option>
          <option value="Diproses">Diproses</option>
          <option value="Tertunda">Tertunda</option>
          <option value="Dibatalkan">Dibatalkan</option>
        </select>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ID Pesanan</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Pembeli</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Item Pesanan</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Nominal (Pi)</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Tanggal & Jam</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const statusColor = getStatusColor(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{order.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 font-medium">{order.buyer}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600">{order.items}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-bold text-purple-700">π {order.amount.toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="text-sm text-slate-600">{order.date} {order.time}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold ${statusColor.bg} ${statusColor.text}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-red-600 transition-colors" title="Detail">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              📭
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Tidak Ada Pesanan</h3>
            <p className="text-slate-600">Belum ada pesanan dengan kriteria pencarian tersebut.</p>
          </div>
        )}
      </div>
    </div>
  );
}
