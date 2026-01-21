"use client";

// SideCategoryMenu.tsx
// Menu danh mục bên trái, hiển thị cố định trên desktop, ẩn trên mobile

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchCategories, Category } from '../lib/api';

export default function SideCategoryMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchCategories()
      .then((items) => {
        if (!mounted) return;
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
    <aside className="hidden md:block w-56 flex-shrink-0 relative">
      <nav className="bg-white rounded-lg shadow sticky top-24">
        {loading ? (
          <div className="text-sm text-gray-500 p-3">Đang tải danh mục...</div>
        ) : (
          <ul>
            {categories.map((cat) => (
              <li 
                key={cat.id} 
                className="group relative border-b border-gray-100 last:border-b-0"
                onMouseEnter={() => setHoveredCategory(cat)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="flex items-center gap-2 px-4 py-3 hover:bg-red-50 hover:text-red-600 transition text-gray-900 text-sm cursor-pointer">
                  <span className="text-base">▶</span>
                  <span className="font-medium">{cat.name}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </nav>
      
      {/* Mega Menu - Fixed position outside of nav */}
      {hoveredCategory && hoveredCategory.sub_categories && hoveredCategory.sub_categories.length > 0 && (
        <div 
          className="absolute left-full top-0 ml-0 z-50 min-w-[700px]"
          onMouseEnter={() => setHoveredCategory(hoveredCategory)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <div className="bg-white rounded-r-lg shadow-2xl border border-l-0 border-gray-200 p-8 max-h-[600px] overflow-y-auto">
            <h3 className="text-lg font-bold  mb-6 pb-3 border-b-2 border-red-500">
              {hoveredCategory.name}
            </h3>
            <div className="grid grid-cols-3 gap-x-8 gap-y-4">
              {hoveredCategory.sub_categories.map((subCat) => (
                <Link
                  key={subCat.id}
                  href={`/categories/${subCat.slug}`}
                  className="flex items-center gap-2 px-2 py-2 rounded hover:text-red-600 transition text-gray-900 text-sm group/item"
                >
                  <span className="text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity">▶</span>
                  <span>{subCat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
