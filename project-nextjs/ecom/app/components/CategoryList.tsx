'use client';

// CategoryList.tsx
// Component danh mục sản phẩm, icon + tên, hiển thị hàng ngang, tailwind, dễ mở rộng

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchCategoryDetail, Category } from '@/lib/api';

const defaultIcon = '📁'; // Default icon if not provided

export default function CategoryList() {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  if (isLoading) {
    return (
      <section className="w-full bg-white py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-2">
          <div className="text-center">Loading categories...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-white py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-2">
          <div className="text-center text-red-500">Error: {error.message}</div>
        </div>
      </section>
    );
  }

  const categoryIcon = [
    { id: 1, name: 'Điện thoại', icon: '📱' },
    { id: 2, name: 'Laptop', icon: '💻' },
    { id: 3, name: 'Tablet', icon: '📱' },
  ];

  const getIcon = (index: number) => {
    return categoryIcon[index]?.icon || defaultIcon;
  };

  const router = useRouter();

  const handleClick = async (slug: string) => {
    // call category detail API, then navigate
    try {
      const detail = await fetchCategoryDetail(slug);
      console.log('Category detail:', detail);
    } catch (err) {
      console.error('Failed fetching category detail', err);
    }
    router.push(`/categories/${slug}`);
  };

  return (
    <section className="w-full bg-white py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex gap-4 px-2 overflow-x-auto">
        {Array.isArray(categories) && categories.filter((cat: Category) => cat.active === 1).map((cat: Category, index: number) => (
          <div
            key={cat.id}
            onClick={() => handleClick(cat.slug)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') handleClick(cat.slug); }}
            className="flex flex-col items-center min-w-[80px] cursor-pointer hover:text-red-600 transition"
          >
            <span className="text-3xl mb-1">{getIcon(index)}</span>
            <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
