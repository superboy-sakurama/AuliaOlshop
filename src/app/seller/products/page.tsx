import { Plus, PackageSearch } from 'lucide-react';
import AddProductForm from '../../../components/seller/AddProductForm';

export default function SellerProducts() {
  return (
    <div className="fade-in-container space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-red-600 pl-3">Kelola Produk</h2>
          <p className="text-gray-500 mt-1 pl-4 text-sm">Daftar produk yang Anda jual di marketplace.</p>
        </div>
        <button className="flex items-center gap-2 bg-red-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-medium shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
          <Plus size={18} />
          Tambah Produk Baru
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <PackageSearch size={32} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Belum Ada Produk</h3>
        <p className="text-gray-500 text-sm max-w-sm mb-6">Mulai jangkau lebih banyak pembeli dengan menambahkan produk pertama Anda menggunakan Pi Network.</p>
      </div>
      
      {/* We can show AddProductForm below for demonstration as required initially, or keep it separate */}
      <div className="mt-8">
        <AddProductForm />
      </div>
    </div>
  );
}
