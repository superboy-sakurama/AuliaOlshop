'use client';

import { Store, ShoppingBag, Wallet, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { usePiAuth } from '@/components/providers/PiAuthProvider';

export default function SellerDashboard() {
  const { user, isSeller } = usePiAuth();

  // Mock data untuk dashboard
  const dashboardStats = [
    {
      title: 'Total Produk',
      value: '45',
      icon: Store,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      trend: '+2',
      trendType: 'increase'
    },
    {
      title: 'Pesanan Baru',
      value: '12',
      icon: ShoppingBag,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      trend: '+5',
      trendType: 'increase'
    },
    {
      title: 'Saldo Pi',
      value: '150.00',
      icon: Wallet,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      trend: '+25.50',
      trendType: 'increase'
    }
  ];

  const recentTransactions = [
    { id: 'TRX-1001', buyer: '@budipi', amount: '2.50', date: '22 Mei 2026, 14:30', status: 'Selesai' },
    { id: 'TRX-1002', buyer: '@sitinur', amount: '15.00', date: '22 Mei 2026, 10:15', status: 'Selesai' },
    { id: 'TRX-1003', buyer: '@andi_crypto', amount: '8.75', date: '21 Mei 2026, 09:00', status: 'Selesai' }
  ];

  const performanceMetrics = [
    { label: 'Lini Produk Populer', value: 'Elektronik', color: 'bg-blue-100 text-blue-700' },
    { label: 'Rating Toko', value: '4.8 / 5.0', color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Response Rate', value: '99.2%', color: 'bg-green-100 text-green-700' }
  ];

  return (
    <div className="fade-in-container space-y-8">
      {/* HEADER SECTION */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-900 border-l-4 border-red-600 pl-4 mb-2">
          Dashboard Toko
        </h1>
        <p className="text-slate-600 pl-4 text-sm">Ringkasan performa toko Anda hari ini, {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        {user && isSeller && (
          <p className="text-slate-500 pl-4 text-xs font-medium mt-3">
            Penjual Terverifikasi: <span className="text-red-600 font-bold">{user.username || 'Toko Saya'}</span>
          </p>
        )}
      </div>

      {/* SECTION 1: STATISTIK UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dashboardStats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 group"
            >
              {/* Top: Icon & Title */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-slate-900">
                    {stat.title === 'Saldo Pi' ? `π ${stat.value}` : stat.value}
                  </h3>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} ${stat.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent size={24} />
                </div>
              </div>

              {/* Bottom: Trend */}
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp size={16} className="text-green-600" />
                <span className="text-green-600 font-semibold">{stat.trend}</span>
                <span className="text-slate-400">vs kemarin</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 2: METRICS & PERFORMANCE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {performanceMetrics.map((metric, idx) => (
          <div key={idx} className={`${metric.color} p-6 rounded-2xl border border-slate-200`}>
            <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">{metric.label}</p>
            <h4 className="text-2xl font-bold">{metric.value}</h4>
          </div>
        ))}
      </div>

      {/* SECTION 3: TRANSAKSI TERAKHIR */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="text-red-600" size={20} />
              Transaksi Terakhir
            </h2>
            <a href="/seller/orders" className="text-red-600 hover:text-red-700 font-semibold text-sm">
              Lihat Semua →
            </a>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ID Pesanan</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Pembeli</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Nominal</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Waktu</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{tx.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{tx.buyer}</td>
                  <td className="px-6 py-4 text-sm font-bold text-purple-700">π {tx.amount}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{tx.date}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: NOTIFIKASI/TIPS */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex gap-4">
        <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
        <div>
          <h3 className="font-bold text-blue-900 mb-1">💡 Tips untuk Meningkatkan Penjualan</h3>
          <p className="text-blue-800 text-sm">Tingkatkan response time dan tambahkan foto produk berkualitas untuk meningkatkan conversion rate toko Anda.</p>
        </div>
      </div>
    </div>
  );
}
