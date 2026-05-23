import React from 'react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  onShopNow?: () => void;
}

export default function HeroSection({ onShopNow }: HeroSectionProps) {
  return (
    <div className="relative w-full h-[380px] sm:h-[450px] lg:h-[500px] bg-brand-white rounded-2xl p-6 sm:p-10 flex items-center justify-between overflow-hidden shadow-purple-glow my-6">
      
      {/* Efek Siluet Ungu (Background blur artifact) */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-70"></div>
      <div className="absolute -bottom-10 right-20 w-80 h-80 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-60"></div>
      <div className="absolute top-1/2 -left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-40"></div>
      
      <div className="relative z-10 max-w-xl">
         <motion.h1 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4 tracking-tight"
         >
           Spesial Hari Ini! <br />
           <span className="text-brand-red text-shadow-purple font-extrabold block mt-2">Diskon Hingga 80%</span>
         </motion.h1>
         
         <motion.p 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.2, duration: 0.5 }}
           className="text-gray-600 text-lg sm:text-xl mb-8 leading-relaxed max-w-md"
         >
           Temukan berbagai produk pilihan dengan harga terbaik hanya di Aulia Olshop. Belanja pakai Pi Network sekarang!
         </motion.p>
         
         <motion.button 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           transition={{ delay: 0.4 }}
           onClick={() => {
             if (onShopNow) return onShopNow();
             // default behavior to scroll
             document.getElementById('product-grid-section')?.scrollIntoView({ behavior: 'smooth' });
           }}
           className="bg-brand-red text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-rose-700 transition-colors shadow-purple-glow flex items-center gap-2"
         >
           Belanja Sekarang 
           <span aria-hidden="true">&rarr;</span>
         </motion.button>
      </div>
      
      {/* Placeholder untuk Gambar Promo / Banner Art */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="hidden md:block relative z-10 w-[400px] h-full py-4"
      >
        <div className="w-full h-full bg-gradient-to-br from-rose-400 to-purple-400 rounded-2xl relative shadow-purple-glow p-4 overflow-hidden group">
          {/* Dekorasi Dalam Banner */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="w-full h-full border-4 border-dashed border-white/40 rounded-xl flex flex-col items-center justify-center text-white p-6 text-center">
             <span className="font-bold text-3xl mb-2 text-shadow-purple">Aulia<br/>Olshop</span>
             <span className="text-white/90 text-sm">Banner Promo Anda<br/>Tampil di Sini</span>
          </div>
        </div>
      </motion.div>
      
    </div>
  );
}
