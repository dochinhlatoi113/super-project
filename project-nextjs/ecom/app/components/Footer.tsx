// Footer.tsx
// Component Footer cho trang chủ, tailwind, code sạch, dễ mở rộng

import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-2 text-white">didongviet.vn</h3>
          <p className="text-sm mb-2">Hệ thống bán lẻ thiết bị di động, laptop, phụ kiện chính hãng.</p>
          <p className="text-xs">© 2025 Didongviet.vn</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">Sản phẩm</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:text-red-400">Điện thoại</a></li>
            <li><a href="#" className="hover:text-red-400">Laptop</a></li>
            <li><a href="#" className="hover:text-red-400">Tablet</a></li>
            <li><a href="#" className="hover:text-red-400">Phụ kiện</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">Chính sách</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:text-red-400">Bảo hành</a></li>
            <li><a href="#" className="hover:text-red-400">Giao hàng</a></li>
            <li><a href="#" className="hover:text-red-400">Đổi trả</a></li>
            <li><a href="#" className="hover:text-red-400">Thanh toán</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">Liên hệ</h4>
          <ul className="space-y-1 text-sm">
            <li>Hotline: <a href="tel:18006018" className="text-red-400 font-bold">1800.6018</a></li>
            <li>Email: <a href="mailto:info@didongviet.vn" className="hover:text-red-400">info@didongviet.vn</a></li>
            <li>Địa chỉ: 123 Nguyễn Huệ, Q.1, TP.HCM</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 py-2 border-t border-gray-800">Website xây dựng bởi admin - 2025</div>
    </footer>
  );
}
