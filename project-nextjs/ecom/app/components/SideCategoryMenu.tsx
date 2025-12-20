// SideCategoryMenu.tsx
// Menu danh mục bên trái, hiển thị cố định trên desktop, ẩn trên mobile

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

export default function SideCategoryMenu() {
  return (
    <aside className="hidden md:block w-56 flex-shrink-0">
      <nav className="bg-white rounded-lg shadow p-3 sticky top-24">
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              <a
                href="#"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-red-50 hover:text-red-600 transition text-gray-700"
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-sm font-medium">{cat.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
