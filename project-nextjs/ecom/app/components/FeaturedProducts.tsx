// FeaturedProducts.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {  fetchProducts } from '@/lib/api';


export default function FeaturedProducts() {
    const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })
if (isLoading) {
    return (
      <section className="w-full bg-white py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-2">
          <div className="text-center">Loading categories...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-white py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-2">
          <div className="text-center text-red-500">Error: {error.message}</div>
        </div>
      </section>
    );
  }  
  
  // Group products by primary category name
  const groupedByCategory: { [categoryName: string]: Product[] } = {};
  if (products) {
    products.filter(p => p.is_active).forEach(p => {
      const primaryCategory = p.categories?.find(cat => cat.pivot?.is_primary === 1 && cat.pivot?.is_active === 1);
      const catName = primaryCategory?.name || 'No Category';
      if (!groupedByCategory[catName]) groupedByCategory[catName] = [];
      groupedByCategory[catName].push(p);
    });
  }

  return (
    <section className="w-full bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-2">
        {Object.entries(groupedByCategory).map(([catName, prods]) => (
          <div key={catName} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{catName}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {prods.map((p) => {
                const avatar = p.variants?.flatMap(v => v.append_config_variants || []).find(acv => acv.avatar)?.avatar || '/no-image.png';
                return (
                  <Link key={p.id} href={`/product/${p.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')}`} className="bg-white rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col items-center cursor-pointer transform hover:scale-105">
                    <img src={avatar} alt={p.name} className="h-28 w-auto object-contain mb-2" />
                    <div className="text-gray-600 font-bold text-sm text-center mb-1 line-clamp-2">{p.name}</div>
                    <div className="text-gray-600 text-xs text-center mb-2">{p.brand?.name || 'No Brand'}</div>
                    <div className="text-red-600 font-bold text-base">{p.variants?.[0]?.append_config_variants?.[0]?.price || 'N/A'}</div>
                    <div className="mt-2 flex justify-center gap-2">
                      <button className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs">🔍 So sánh</button>
                      <button className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs">🛒 Giỏ hàng</button>
                      <button className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs">⚡ Mua ngay</button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
