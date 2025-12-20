// PromoBanner.tsx
// Banner phụ/quảng cáo nhỏ, tailwind, dễ mở rộng

import React from 'react';

const promos = [
  {
    id: 1,
    image: '/promo1.jpg',
    alt: 'Ưu đãi trả góp 0%',
    link: '#',
  },
  {
    id: 2,
    image: '/promo2.jpg',
    alt: 'Bảo hành 12 tháng',
    link: '#',
  },
  {
    id: 3,
    image: '/promo3.jpg',
    alt: 'Miễn phí vận chuyển',
    link: '#',
  },
];

export default function PromoBanner() {
  return (
    <section className="w-full bg-white py-3">
      <div className="max-w-7xl mx-auto flex gap-4 px-2 overflow-x-auto">
        {promos.map((promo) => (
          <a
            key={promo.id}
            href={promo.link}
            className="flex-shrink-0 rounded-lg overflow-hidden shadow hover:shadow-lg transition border border-gray-100"
          >
            <img
              src={promo.image}
              alt={promo.alt}
              className="h-20 w-56 object-cover"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
