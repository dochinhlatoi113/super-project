// NewsSection.tsx
// Khối tin tức/blog, tailwind, code sạch, dễ mở rộng

import React from 'react';

const news = [
  {
    id: 1,
    title: 'Top 5 điện thoại đáng mua cuối năm 2025',
    image: '/news1.jpg',
    link: '#',
    date: '15/12/2025',
  },
  {
    id: 2,
    title: 'So sánh MacBook Air M3 và Dell XPS 13',
    image: '/news2.jpg',
    link: '#',
    date: '10/12/2025',
  },
  {
    id: 3,
    title: 'Hướng dẫn chọn mua tablet cho sinh viên',
    image: '/news3.jpg',
    link: '#',
    date: '05/12/2025',
  },
];

export default function NewsSection() {
  return (
    <section className="w-full bg-white py-6">
      <div className="max-w-7xl mx-auto px-2">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Tin tức & Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {news.map((item) => (
            <a
              key={item.id}
              href={item.link}
              className="block bg-gray-50 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
            >
              <img src={item.image} alt={item.title} className="h-40 w-full object-cover" />
              <div className="p-3">
                <div className="text-xs text-gray-400 mb-1">{item.date}</div>
                <div className="font-medium text-base text-gray-800 line-clamp-2">{item.title}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
