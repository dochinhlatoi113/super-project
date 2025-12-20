// CategoryList.tsx
// Component danh mục sản phẩm, icon + tên, hiển thị hàng ngang, tailwind, dễ mở rộng

import React from 'react';

const categories = [
  { id: 1, name: 'Điện thoại', icon: '📱' },
  { id: 2, name: 'Laptop', icon: '💻' },
  { id: 3, name: 'Tablet', icon: '� tablet' },
  { id: 4, name: 'Phụ kiện', icon: '🎧' },
  { id: 5, name: 'Âm thanh', icon: '🎵' },
  { id: 6, name: 'Đồng hồ', icon: '⌚' },
  { id: 7, name: 'PC - Màn hình', icon: '🖥️' },
  { id: 8, name: 'Khuyến mãi', icon: '🔥' },
];

export default function CategoryList() {
  return (
    <section className="w-full bg-white py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex gap-4 px-2 overflow-x-auto">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col items-center min-w-[80px] cursor-pointer hover:text-red-600 transition"
          >
            <span className="text-3xl mb-1">{cat.icon}</span>
            <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
