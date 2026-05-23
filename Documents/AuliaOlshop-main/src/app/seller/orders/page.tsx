import { ShoppingBag, ChevronRight } from 'lucide-react';

export default function SellerOrders() {
  const mockOrders = [
    { id: 'TRX-1029', buyer: '@budipi', amount: '2.50', status: 'Selesai', date: '22 Mei 2026' },
    { id: 'TRX-1030', buyer: '@sitinur', amount: '15.00', status: 'Diproses', date: '22 Mei 2026' },
    { id: 'TRX-1031', buyer: '@andi_crypto', amount: '0.85', status: 'Tertunda', date: '21 Mei 2026' }
  ];

  return (
    <div className="fade-in-container space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-red-600 pl-3">Pesanan Masuk</h2>
        <p className="text-gray-500 mt-1 pl-4 text-sm">Pantau dan kelola pesanan dari pelanggan Anda.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm">
                <th className="py-4 px-6 font-semibold text-gray-600">ID Pesanan</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Pembeli</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Total (Pi)</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Tanggal</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Status</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{order.buyer}</td>
                  <td className="py-4 px-6 text-sm font-bold text-purple-700">π {order.amount}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">{order.date}</td>
                  <td className="py-4 px-6 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                      order.status === 'Diproses' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-gray-400 hover:text-red-600 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* If empty fallback */}
        {mockOrders.length === 0 && (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <ShoppingBag size={32} />
            </div>
            <p className="text-gray-500">Belum ada pesanan masuk saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
