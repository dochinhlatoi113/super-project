"use client";
// AccountIcon.tsx
// Icon user, khi click sẽ chuyển hướng sang trang /account

import { useRouter } from 'next/navigation';

export default function AccountIcon() {
  const router = useRouter();
  return (
    <button
      className="relative"
      aria-label="Tài khoản"
      onClick={() => router.push('/account')}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-700">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
      </svg>
    </button>
  );
}
