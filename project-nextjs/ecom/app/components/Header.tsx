// Header.tsx
// Component Header cho trang chủ, tách menu, logo, tìm kiếm, hotline, giỏ hàng, tài khoản

import React from 'react';
import AccountIcon from './AccountIcon';

export default function Header() {
  return (
    <header className="w-full bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-2 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="h-10 w-auto" />
          <span className="font-bold text-xl text-red-600">didongviet</span>
        </div>
        {/* Thanh tìm kiếm */}
        <div className="flex-1 mx-4">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        {/* Hotline, giỏ hàng, tài khoản */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end text-xs">
            <span className="text-gray-500">Hotline</span>
            <a href="tel:18006018" className="text-red-600 font-bold text-base">1800.6018</a>
          </div>
          <button className="relative cursor-pointer transform transition hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75h19.5M6.75 6.75V5.25A2.25 2.25 0 019 3h6a2.25 2.25 0 012.25 2.25v1.5m-12 0h12m-12 0v10.5A2.25 2.25 0 008.25 19.5h7.5A2.25 2.25 0 0018 17.25V6.75" />
            </svg>
          </button>
          <span className="cursor-pointer transform transition hover:scale-110"><AccountIcon /></span>
        </div>
      </div>
      {/* Menu chính */}
      <nav className="bg-gray-50 border-t border-b">
        <div className="container mx-auto flex gap-6 px-4 py-2 text-sm font-medium text-gray-700 overflow-x-auto">
          <a href="#" className="hover:text-red-600 whitespace-nowrap">Điện thoại</a>
          <a href="#" className="hover:text-red-600 whitespace-nowrap">Laptop</a>
          <a href="#" className="hover:text-red-600 whitespace-nowrap">Tablet</a>
          <a href="#" className="hover:text-red-600 whitespace-nowrap">Phụ kiện</a>
          <a href="#" className="hover:text-red-600 whitespace-nowrap">Âm thanh</a>
          <a href="#" className="hover:text-red-600 whitespace-nowrap">Đồng hồ</a>
          <a href="#" className="hover:text-red-600 whitespace-nowrap">PC - Màn hình</a>
          <a href="#" className="hover:text-red-600 whitespace-nowrap">Khuyến mãi</a>
        </div>
      </nav>
    </header>
  );
}
