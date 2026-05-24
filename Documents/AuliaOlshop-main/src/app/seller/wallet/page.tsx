'use client';

import { Wallet, ArrowDownLeft, ArrowUpRight, Clock, TrendingUp, Download } from 'lucide-react';
import { useState } from 'react';

interface Transaction {
  id: string;
  type: 'Penjualan' | 'Penarikan' | 'Komisi' | 'Bonus';
  amount: number;
  description: string;
  date: string;
  time: string;
  status: 'Selesai' | 'Berhasil' | 'Tertunda';
  reference: string;
}

export default function SellerWallet() {
  const [filterType, setFilterType] = useState('all');

  // Mock data transaksi
  const transactions: Transaction[] = [
    { id: 'TX-001', type: 'Penjualan', amount: 8500.00, description: 'Penjualan Laptop Gaming', date: '22 Mei 2026', time: '14:30', status: 'Selesai', reference: 'TRX-1029' },
    { id: 'TX-002', type: 'Penjualan', amount: 4200.00, description: 'Penjualan Smartphone 5G', date: '22 Mei 2026', time: '12:15', status: 'Selesai', reference: 'TRX-1030' },
    { id: 'TX-003', type: 'Penarikan', amount: -10000.00, description: 'Penarikan Saldo ke Rekening', date: '20 Mei 2026', time: '09:15', status: 'Berhasil', reference: 'WTX-2001' },
    { id: 'TX-004', type: 'Penjualan', amount: 3450.00, description: 'Penjualan Headphone & Mouse', date: '21 Mei 2026', time: '16:45', status: 'Selesai', reference: 'TRX-1031' },
    { id: 'TX-005', type: 'Bonus', amount: 500.00, description: 'Bonus Review Produk', date: '21 Mei 2026', time: '10:00', status: 'Selesai', reference: 'BON-501' },
    { id: 'TX-006', type: 'Penjualan', amount: 1500.00, description: 'Penjualan Headphone Premium', date: '19 Mei 2026', time: '11:20', status: 'Selesai', reference: 'TRX-1034' }
  ];

  const filteredTransactions = transactions.filter(tx => filterType === 'all' || tx.type === filterType);

  const stats = {
    totalBalance: 150.00,
    monthlyIncome: 17650.00,
    monthlyWithdraw: 10000.00,
    pendingWithdraw: 5000.00
  };

  const getTransactionIcon = (type: string) => {
    if (type === 'Penjualan' || type === 'Bonus') {
      return <ArrowDownLeft size={20} className="text-green-600" />;
    }
    return <ArrowUpRight size={20} className="text-red-600" />;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, { bg: string; text: string; badge: string }> = {
      'Penjualan': { bg: 'bg-green-100', text: 'text-green-700', badge: 'bg-green-50' },
      'Penarikan': { bg: 'bg-red-100', text: 'text-red-700', badge: 'bg-red-50' },
      'Komisi': { bg: 'bg-blue-100', text: 'text-blue-700', badge: 'bg-blue-50' },
      'Bonus': { bg: 'bg-purple-100', text: 'text-purple-700', badge: 'bg-purple-50' }
    };
    return colors[type] || { bg: 'bg-slate-100', text: 'text-slate-700', badge: 'bg-slate-50' };
  };

  return (
    <div className="fade-in-container space-y-8">
      {/* HEADER SECTION */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-900 border-l-4 border-red-600 pl-4">
          Saldo Penjualan Pi
        </h1>
        <p className="text-slate-600 pl-4 text-sm mt-2">
          Kelola saldo toko dan lihat riwayat mutasi transaksi Anda secara detail
        </p>
      </div>

      {/* MAIN BALANCE CARD */}
      <div className="bg-gradient-to-br from-red-600 via-rose-600 to-purple-700 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.4)] p-8 text-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Wallet size={200} />
        </div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-white/80 font-medium mb-2 text-sm uppercase tracking-wider">Total Saldo Tersedia</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">π</span>
                <h1 className="text-6xl font-bold tracking-tight">{stats.totalBalance.toFixed(2)}</h1>
              </div>
            </div>
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <TrendingUp size={32} className="text-white/80" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8 pt-8 border-t border-white/20">
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wider font-semibold mb-1">Pemasukan Bulan</p>
              <p className="text-2xl font-bold">π {stats.monthlyIncome.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wider font-semibold mb-1">Penarikan Bulan</p>
              <p className="text-2xl font-bold">π {stats.monthlyWithdraw.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wider font-semibold mb-1">Dalam Proses</p>
              <p className="text-2xl font-bold">π {stats.pendingWithdraw.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="
              inline-flex items-center gap-2 
              bg-white text-red-600 hover:bg-slate-50
              px-6 py-3 rounded-xl font-bold 
              transition-all duration-300 transform hover:scale-105 active:scale-95
              shadow-lg shadow-black/20
            ">
              <Download size={18} />
              Tarik Saldo
            </button>
            <button className="
              inline-flex items-center gap-2
              bg-white/20 text-white hover:bg-white/30
              px-6 py-3 rounded-xl font-bold 
              backdrop-blur-md border border-white/30
              transition-all duration-300
            ">
              Riwayat Penarikan
            </button>
          </div>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Transaksi Bulan Ini', value: filteredTransactions.length, icon: '📊', color: 'blue' },
          { label: 'Total Komisi', value: 'π 0.00', icon: '💰', color: 'purple' },
          { label: 'Penjualan Hari Ini', value: '0 Pi', icon: '🛍️', color: 'green' },
          { label: 'Rating Kepuasan', value: '4.8 / 5', icon: '⭐', color: 'yellow' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* TRANSACTION HISTORY */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Clock className="text-slate-400" size={22} />
              Riwayat Mutasi
            </h2>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'Penjualan', 'Penarikan', 'Bonus'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`
                  px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all
                  ${filterType === type
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }
                `}
              >
                {type === 'all' ? 'Semua' : type}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => {
              const typeColor = getTransactionColor(transaction.type);
              const isIncome = transaction.amount > 0;
              return (
                <div key={transaction.id} className="p-6 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${typeColor.badge}`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900">{transaction.description}</h3>
                        <p className="text-xs text-slate-500 mt-1">{transaction.date} • {transaction.time}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Ref: {transaction.reference}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                        {isIncome ? '+' : ''}π {Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full inline-block mt-1 ${typeColor.bg} ${typeColor.text}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <p className="text-slate-600">Belum ada transaksi untuk kategori ini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getTransactionColor(type: string) {
  const colors: Record<string, { bg: string; text: string; badge: string }> = {
    'Penjualan': { bg: 'bg-green-100', text: 'text-green-700', badge: 'bg-green-50' },
    'Penarikan': { bg: 'bg-red-100', text: 'text-red-700', badge: 'bg-red-50' },
    'Komisi': { bg: 'bg-blue-100', text: 'text-blue-700', badge: 'bg-blue-50' },
    'Bonus': { bg: 'bg-purple-100', text: 'text-purple-700', badge: 'bg-purple-50' }
  };
  return colors[type] || { bg: 'bg-slate-100', text: 'text-slate-700', badge: 'bg-slate-50' };
}
