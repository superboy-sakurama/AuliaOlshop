import { Save } from 'lucide-react';

export default function SellerSettings() {
  return (
    <div className="fade-in-container space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-red-600 pl-3">Pengaturan Toko</h2>
        <p className="text-gray-500 mt-1 pl-4 text-sm">Sesuaikan profil dan informasi toko Anda.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
        <form className="max-w-2xl space-y-6">
          <div>
            <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Toko
            </label>
            <input 
              type="text" 
              id="shopName" 
              defaultValue="Toko Saya"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi Toko
            </label>
            <textarea 
              id="description" 
              rows={4}
              defaultValue="Kami menjual berbagai macam produk berkualitas tinggi untuk memenuhi kebutuhan gaya hidup Anda."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-shadow resize-y"
            ></textarea>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Lengkap
            </label>
            <textarea 
              id="address" 
              rows={3}
              defaultValue="Jl. Jendral Sudirman Kav. 21, Jakarta Selatan"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-shadow resize-y"
            ></textarea>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button 
              type="button" 
              className="px-8 py-2.5 bg-red-600 hover:bg-rose-700 text-white rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center gap-2"
            >
              <Save size={18} />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
