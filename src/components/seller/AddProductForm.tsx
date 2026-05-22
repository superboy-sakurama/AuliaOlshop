"use client";

import React, { useState } from 'react';
import { Upload, Plus, Info } from 'lucide-react';
// import { addProductAction } from '@/app/actions/sellerActions'; // Simulasi Next.js Server Action

export default function AddProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    
    try {
      const formData = new FormData(form);
      
      // Simulasi panggilan Next.js Server Action
      // await addProductAction(formData);
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Mock delay
      alert('Produk berhasil ditambahkan ke keranjang katalog toko Anda!');
      
      form.reset();
      setImagePreview(null);
    } catch (error) {
      console.error(error);
      alert('Gagal menambahkan produk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-purple-silhouette transition-shadow">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 border-b pb-4">Tambah Produk Baru</h1>
        <p className="text-sm text-gray-500 mt-2">Isi informasi produk dengan detail agar pembeli mudah menemukannya.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        
        {/* Nama Produk */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nama Produk <span className="text-brand-red">*</span>
          </label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            placeholder="Contoh: Kemeja Flanel Pria Lengan Panjang"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-shadow"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Harga (Pi) */}
          <div>
            <label htmlFor="price_pi" className="block text-sm font-medium text-gray-700 mb-1">
              Harga Jual (Pi) <span className="text-brand-red">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-red font-bold">
                π
              </div>
              <input 
                type="number" 
                id="price_pi" 
                name="price_pi" 
                step="0.000001"
                min="0.000001"
                required 
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-shadow"
              />
            </div>
            <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
              <Info size={12} />
              Dipotong 2% biaya platform saat dana escrow cair.
            </p>
          </div>

          {/* Kategori (Opsional, untuk perluasan) */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Stok
            </label>
            <input 
              type="number" 
              id="stock" 
              name="stock" 
              defaultValue={100}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 border-transparent transition-shadow"
            />
          </div>
        </div>

        {/* Deskripsi */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi Produk <span className="text-brand-red">*</span>
          </label>
          <textarea 
            id="description" 
            name="description" 
            rows={5}
            required 
            placeholder="Tuliskan spesifikasi, bahan, ukuran, dan detail lainnya..."
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-shadow resize-y"
          ></textarea>
        </div>

        {/* Upload Gambar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gambar Produk <span className="text-brand-red">*</span>
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-purple-400 hover:bg-gray-50 transition-colors group relative overflow-hidden h-64">
            
            {imagePreview ? (
              <div className="absolute inset-0 w-full h-full p-2 bg-white">
                 <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <p className="text-white font-medium flex items-center gap-2">
                     <Upload size={18} /> Ganti Gambar
                   </p>
                 </div>
                 <input 
                  type="file" 
                  name="image" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                 />
              </div>
            ) : (
              <div className="space-y-2 text-center flex flex-col justify-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-purple-500 transition-colors" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-red hover:text-purple-600 focus-within:outline-none">
                    <span>Upload foto</span>
                    <input 
                      id="file-upload" 
                      name="image" 
                      type="file" 
                      accept="image/*"
                      className="sr-only" 
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">atau tarik dan lepas ke sini</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP hingga 5MB</p>
              </div>
            )}
            
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
          <button 
            type="button" 
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-lg font-bold text-white transition-all shadow-purple-glow ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-brand-red hover:bg-rose-700 hover:scale-[1.02] active:scale-95'
            }`}
          >
            {isSubmitting ? (
               <>Memproses <span className="animate-pulse">...</span></>
            ) : (
               <><Plus size={18} /> Simpan Produk</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
