import { Wallet, ArrowDownLeft, ArrowUpRight, Clock } from 'lucide-react';

export default function SellerWallet() {
  const checkHistory = [
    { id: '1', type: 'Penjualan', amount: '+ 2.45', date: '22 Mei 2026, 14:30', status: 'Selesai' },
    { id: '2', type: 'Penarikan', amount: '- 10.00', date: '20 Mei 2026, 09:15', status: 'Berhasil' },
    { id: '3', type: 'Penjualan', amount: '+ 14.70', date: '19 Mei 2026, 16:45', status: 'Selesai' }
  ];

  return (
    <div className="fade-in-container space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-red-600 pl-3">Saldo Penjualan Pi</h2>
        <p className="text-gray-500 mt-1 pl-4 text-sm">Kelola saldo toko dan lihat riwayat mutasi Anda.</p>
      </div>

      <div className="bg-gradient-to-br from-red-600 to-rose-800 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)] p-8 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Wallet size={120} />
        </div>
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <p className="text-red-100 font-medium mb-2">Total Saldo Tersedia</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">π</span>
            <h1 className="text-5xl font-bold tracking-tight">150.00</h1>
          </div>

          <div className="mt-8 flex gap-4">
            <button className="bg-white text-red-600 hover:bg-red-50 px-6 py-2.5 rounded-lg font-bold transition-colors shadow-lg shadow-black/10">
              Tarik Saldo
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="text-gray-400" size={20} /> 
          Riwayat Mutasi
        </h3>

        <div className="space-y-4">
          {checkHistory.map((item) => {
            const isIncome = item.amount.startsWith('+');
            return (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {isIncome ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{item.type}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${isIncome ? 'text-green-600' : 'text-gray-900'}`}>{isIncome ? '' : ''} {item.amount} Pi</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.status}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
