// FeaturedProducts.tsx
// Component Sản phẩm nổi bật, chia nhóm, tailwind, code sạch, dễ mở rộng

import React from 'react';
import Link from 'next/link';

const featuredGroups = [
  {
    title: 'Điện thoại nổi bật',
    products: [
      { id: 1, name: 'iPhone 15 Pro Max', price: '34.990.000₫', image: '/iphone15.jpg' },
      { id: 2, name: 'Samsung S24 Ultra', price: '28.990.000₫', image: '/s24ultra.jpg' },
      { id: 3, name: 'Xiaomi 14', price: '19.990.000₫', image: '/xiaomi14.jpg' },
      { id: 4, name: 'OPPO Find N3', price: '22.990.000₫', image: '/oppon3.jpg' },
    ],
  },
  {
    title: 'Laptop nổi bật',
    products: [
      { id: 5, name: 'MacBook Air M3', price: '27.990.000₫', image: '/macbookair.jpg' },
      { id: 6, name: 'Dell XPS 13', price: '32.990.000₫', image: '/dellxps.jpg' },
      { id: 7, name: 'ASUS ZenBook', price: '21.990.000₫', image: '/asuszen.jpg' },
      { id: 8, name: 'HP Spectre', price: '25.990.000₫', image: '/hpspectre.jpg' },
    ],
  },
];

export default function FeaturedProducts() {
  return (
    <section className="w-full bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-2">
        {featuredGroups.map((group) => (
          <div key={group.title} className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{group.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {group.products.map((p) => {
                // Tạo slug demo cho sản phẩm, thực tế nên lưu slug trong data
                let slug = p.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
                if (p.name.includes('Vivo V60')) slug = 'vivo-v60-12gb-512gb';
                return (
                  <Link key={p.id} href={`/product/${slug}`} className="bg-white rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col items-center cursor-pointer transform hover:scale-105">
                    <img src={p.image} alt={p.name} className="h-28 w-auto object-contain mb-2" />
                    <div className="font-medium text-sm text-center mb-1 line-clamp-2">{p.name}</div>
                    <div className="text-red-600 font-bold text-base">{p.price}</div>
                    <span className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs">Xem chi tiết</span>
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
