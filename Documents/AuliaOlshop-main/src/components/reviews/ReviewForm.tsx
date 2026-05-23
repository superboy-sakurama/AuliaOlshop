"use client";

import React, { useState } from 'react';
import { Star, Upload, Send } from 'lucide-react';

/**
 * PANDUAN NEXT.JS SERVER ACTION UNTUK REVIEWS:
 * Di dalam folder actions (misal: /src/app/actions/reviewActions.ts):
 * 
 * ```typescript
 * 'use server';
 * import { createClient } from '@/utils/supabase/server';
 * import { revalidatePath } from 'next/cache';
 * 
 * export async function insertProductReview({ productId, orderId, rating, comment, imageUrl }) {
 *   const supabase = createClient();
 *   const { data, error } = await supabase
 *     .from('reviews')
 *     .insert({
 *       product_id: productId,
 *       order_id: orderId,
 *       rating,
 *       comment,
 *       image_url: imageUrl
 *     });
 *   if (error) throw error;
 *   revalidatePath(`/products/${productId}`);
 *   return { success: true };
 * }
 * ```
 */

export default function ReviewForm({ productId, orderId }: { productId: string, orderId: string }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validasi input: Tombol kirim ulasan nonaktif jika rating belum dipilih atau ulasan kosong
  const isValid = rating > 0 && comment.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    
    setIsSubmitting(true);
    // Simulasi pengiriman data ke Next.js Server Action / API Route
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Berhasil mengirimkan ulasan (Simulasi Server Action Supabase)!\nRating: ${rating} Bintang\nKomentar: "${comment}"`);
      setRating(0);
      setComment('');
      setHoveredRating(0);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-purple-silhouette transition-shadow w-full max-w-2xl bg-white">
      <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3 border-gray-100">Beri Ulasan Produk</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Penilaian Produk <span className="text-brand-red">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">Klik ikon bintang untuk memberikan peringkat</p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`transition-all duration-200 focus:outline-none ${
                    (hoveredRating || rating) >= star 
                        ? 'text-purple-500 scale-110 drop-shadow-[0_2px_8px_rgba(147,51,234,0.5)]' 
                        : 'text-gray-300 hover:text-purple-300'
                }`}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star size={36} className={(hoveredRating || rating) >= star ? 'fill-purple-500' : 'fill-transparent'} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Tulis Pengalaman Anda <span className="text-brand-red">*</span>
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Bagaimana kualitas produk ini? Apakah sesuai dengan deskripsi?"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-shadow resize-y"
          ></textarea>
        </div>
        
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Upload Foto (Opsional)</label>
           <button type="button" className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 transition-colors">
              <Upload size={16} />
              <span>Tambah Foto</span>
           </button>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-white transition-all ${
              !isValid 
                ? 'bg-gray-300 cursor-not-allowed shadow-none text-gray-500 border border-gray-200' 
                : isSubmitting
                ? 'bg-gray-400 cursor-not-allowed shadow-none'
                : 'bg-brand-red hover:bg-rose-700 hover:scale-[1.02] active:scale-95 shadow-purple-glow'
            }`}
          >
            {isSubmitting ? (
              <>Mengirim <span className="animate-pulse">...</span></>
            ) : (
              <><Send size={18} /> Kirim Ulasan</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
