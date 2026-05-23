"use client";

import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  price_pi: number;
  image_url: string;
  rating: number;
  sold: number;
  discount?: number;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 font-sans">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="bg-brand-white rounded-lg shadow-sm border border-gray-100 hover:shadow-purple-silhouette hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col overflow-hidden"
        >
          {/* Product Image */}
          <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
               {/* Simulating image load */}
               <span className="text-xs">IMG: {product.name.substring(0, 10)}...</span>
            </div>
            
            {/* Discount Badge */}
            {product.discount && (
              <div className="absolute top-0 right-0 bg-yellow-400 text-brand-red text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10 shadow-sm">
                -{product.discount}%
              </div>
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Product Details */}
          <div className="p-3 flex flex-col flex-1">
            <h3 className="text-sm text-gray-800 line-clamp-2 leading-tight mb-2 min-h-[2.5rem]">
              {product.name}
            </h3>
            
            <div className="mt-auto">
              <div className="flex items-end justify-between mb-1">
                <span className="text-base sm:text-lg text-brand-red font-bold">
                  {product.price_pi.toLocaleString('id-ID')} Pi
                </span>
                {product.discount && (
                  <span className="text-xs text-gray-400 line-through">
                    {(product.price_pi * (1 + product.discount / 100)).toFixed(2)}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span>{product.rating}</span>
                  <span className="mx-0.5">|</span>
                  <span>{product.sold} terjual</span>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (onAddToCart) onAddToCart(product);
                }}
                className="w-full mt-3 bg-white border border-brand-red text-brand-red py-1.5 rounded-md text-xs font-semibold group-hover:bg-brand-red group-hover:text-white transition-colors duration-300 flex items-center justify-center gap-1 active:scale-95"
              >
                <ShoppingCart size={14} />
                Beli
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
