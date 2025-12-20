// BannerSlider.tsx
// Component Banner/Slider cho trang chủ, dùng tailwind, code sạch, dễ mở rộng

import React from 'react';

const banners = [
  {
    id: 1,
    image: '/banner1.jpg',
    alt: 'Khuyến mãi lớn cuối năm',
  },
  {
    id: 2,
    image: '/banner2.jpg',
    alt: 'Mua điện thoại giảm sốc',
  },
  {
    id: 3,
    image: '/banner3.jpg',
    alt: 'Laptop giá tốt',
  },
];

export default function BannerSlider() {
  // Đơn giản: chỉ hiển thị banner đầu tiên, có thể mở rộng thành slider sau
  return (
    <div className="w-full h-full flex items-center justify-center">
      <img
        src={banners[0].image}
        alt={banners[0].alt}
        className="w-full object-cover h-40 md:h-64"
      />
    </div>
  );
}
