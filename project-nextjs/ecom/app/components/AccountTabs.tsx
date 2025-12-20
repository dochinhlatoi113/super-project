"use client";
// AccountTabs.tsx
// Component tabs cho trang tài khoản: Đăng ký & Đăng nhập
import { useState } from "react";

export default function AccountTabs() {
  const [tab, setTab] = useState<'register' | 'login'>('login');
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <div className="flex mb-6">
        <button
          className={`flex-1 py-2 font-semibold rounded-l ${tab === 'register' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setTab('register')}
        >
          Tạo tài khoản
        </button>
        <button
          className={`flex-1 py-2 font-semibold rounded-r ${tab === 'login' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setTab('login')}
        >
          Đăng nhập
        </button>
      </div>
      {tab === 'register' ? (
        <form className="flex flex-col gap-3">
          <input type="email" placeholder="Email" className="border rounded px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" required />
          <input type="text" placeholder="Họ tên" className="border rounded px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" required />
          <input type="text" placeholder="Địa chỉ" className="border rounded px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" />
          <input type="tel" placeholder="Số điện thoại" className="border rounded px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" />
          <input type="date" placeholder="Ngày sinh" className="border rounded px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" />
          <input type="password" placeholder="Mật khẩu" className="border rounded px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" required />
          <button type="submit" className="bg-red-600 text-white rounded py-2 font-semibold hover:bg-red-700 mt-2">Đăng ký</button>
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          <button
            className="w-full flex items-center justify-center gap-2 rounded py-2 bg-red-600 text-white font-semibold hover:bg-red-700 transition cursor-pointer transform hover:scale-105"
            onClick={() => {
              window.location.href = 'http://localhost:3000/api/v1/login/google';
            }}
          >
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            Đăng nhập với Google
          </button>
          <button className="w-full flex items-center justify-center gap-2 rounded py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition cursor-pointer transform hover:scale-105">
            <img src="/facebook.svg" alt="Facebook" className="w-5 h-5" />
            Đăng nhập với Facebook
          </button>
          <div className="my-2 text-center text-gray-400 text-xs">hoặc đăng nhập bằng tài khoản</div>
          <form className="flex flex-col gap-3">
            <input type="email" placeholder="Email" className="border rounded px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" required />
            <input type="password" placeholder="Mật khẩu" className="border rounded px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" required />
            <button type="submit" className="bg-red-600 text-white rounded py-2 font-semibold hover:bg-red-700 mt-2">Đăng nhập</button>
          </form>
        </div>
      )}
    </div>
  );
}
