import { Store, ShoppingBag, Wallet } from 'lucide-react';

export default function SellerDashboard() {
  return (
    <div className="fade-in-container space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-red-600 pl-3">Dashboard Toko</h2>
        <p className="text-gray-500 mt-1 pl-4 text-sm">Ringkasan performa toko Anda hari ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <Store size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Produk</p>
            <h3 className="text-2xl font-bold text-gray-900">45</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pesanan Baru</p>
            <h3 className="text-2xl font-bold text-gray-900">12</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Saldo Pi</p>
            <h3 className="text-2xl font-bold text-gray-900">π 150.00</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
