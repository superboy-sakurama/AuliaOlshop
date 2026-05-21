import React from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  imageUrl?: string;
}

const mockReviews: Review[] = [
  {
    id: '1',
    userName: 'Budi Hartono',
    rating: 5,
    comment: 'Barangnya bagus banget! Pengiriman cepat, packing rapi, dan sesuai dengan foto. Recommended seller!',
    date: '12 Mei 2026',
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: '2',
    userName: 'Siti Aminah',
    rating: 4,
    comment: 'Bagus sih, cuma ukurannya agak kebesaran dikit. Tapi bahannya emang top!',
    date: '10 Mei 2026'
  }
];

export default function ProductReviewsList() {
  const averageRating = 4.8;
  const totalReviews = 125;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 w-full">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Ulasan Pembeli</h2>
      
      {/* Rating Summary */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-rose-50 border border-brand-red/20 rounded-xl mb-8">
         <div className="flex flex-col items-center justify-center text-brand-red min-w-[120px]">
            <div className="text-5xl font-bold text-shadow-purple mb-1">
               {averageRating}
               <span className="text-xl text-rose-300 font-normal">/5</span>
            </div>
            <div className="flex text-purple-500 mt-2">
               {[1, 2, 3, 4, 5].map(star => (
                 <Star key={star} size={20} className={star <= Math.round(averageRating) ? 'fill-purple-500' : 'fill-transparent text-purple-300'} />
               ))}
            </div>
            <div className="text-sm font-medium mt-2 text-rose-900">{totalReviews} Ulasan</div>
         </div>
         
         <div className="hidden sm:block w-px h-24 bg-rose-200"></div>
         
         {/* Filter tags */}
         <div className="flex flex-wrap gap-2 justify-center sm:justify-start flex-1">
            <button className="px-4 py-1.5 bg-brand-red text-white text-sm font-medium rounded-full shadow-purple-silhouette">Semua</button>
            <button className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 text-sm font-medium rounded-full transition-colors">5 Bintang (110)</button>
            <button className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 text-sm font-medium rounded-full transition-colors">4 Bintang (12)</button>
            <button className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 text-sm font-medium rounded-full transition-colors">Dengan Foto (45)</button>
         </div>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {mockReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
             <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 text-gray-500">
                   <User size={20} />
                </div>
                <div className="flex-1">
                   <div className="font-medium text-gray-900 text-sm">{review.userName}</div>
                   <div className="flex items-center gap-2 mt-1">
                      <div className="flex text-purple-500">
                         {[1, 2, 3, 4, 5].map(star => (
                           <Star key={star} size={12} className={star <= review.rating ? 'fill-purple-500' : 'fill-transparent text-purple-300'} />
                         ))}
                      </div>
                      <span className="text-xs text-gray-400">{review.date}</span>
                   </div>
                   
                   <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                     {review.comment}
                   </p>
                   
                   {review.imageUrl && (
                     <div className="mt-3 w-20 h-20 rounded-md bg-gray-100 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                        <img src={review.imageUrl} alt="Lampiran ulasan" className="w-full h-full object-cover" />
                     </div>
                   )}
                   
                   <div className="mt-4 flex items-center gap-4 text-xs font-medium text-gray-500">
                      <button className="flex items-center gap-1.5 hover:text-brand-red transition-colors">
                         <ThumbsUp size={14} /> Membantu (5)
                      </button>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
