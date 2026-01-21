"use client";

// SideCategoryMenu.tsx
// Menu danh mục bên trái, hiển thị cố định trên desktop, ẩn trên mobile

import React, { useEffect, useState } from 'react';
import { fetchCategories, Category } from '../lib/api';

export default function SideCategoryMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchCategories()
      .then((items) => {
        if (!mounted) return;
        // Map API category shape to our UI if needed
        const mapped = items.map((c) => ({ ...c }));
        setCategories(mapped);
      })
      .catch(() => setCategories([]))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <aside className="hidden md:block w-56 flex-shrink-0">
      <nav className="bg-white rounded-lg shadow p-3 sticky top-24 max-h-[calc(100vh-18rem)] overflow-y-auto pr-2">
        {loading ? (
          <div className="text-sm text-gray-500">Đang tải danh mục...</div>
        ) : (
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.id}>
                <a
                  href={`#/category/${cat.slug}`}
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-red-50 hover:text-red-600 transition text-gray-700"
                >
                  <span className="text-xl">📁</span>
                  <span className="text-sm font-medium">{cat.name}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </aside>
  );
}
