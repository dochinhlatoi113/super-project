

import { fetchCategoryDetail } from '@/lib/api';
import Breadcrumb from './Breadcrumb';
import FilterSidebar from './FilterSidebar';
import ProductGrid from './ProductGrid';

// Define Category type with products property
type Category = {
  name: string;
  products?: any[]; // Replace 'any' with your actual product type if available
};

type PageProps = {
  params: Promise<{ slug: string }>
};

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await fetchCategoryDetail(slug) as Category;

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <p className="text-gray-600">Could not load category: {slug}</p>
      </div>
    );
  }

  // Fake breadcrumb, bạn có thể lấy từ API nếu có
  const breadcrumb = [
    { label: 'Trang chủ', href: '/' },
    { label: data.name }
  ];

  // Lấy products từ API (nếu có), fallback mảng rỗng
  const products = Array.isArray(data.products) ? data.products : [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb items={breadcrumb} />
        <div className="flex gap-6">
          <FilterSidebar />
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{data.name}</h1>
            {/* Có thể thêm mô tả ở đây nếu có */}
            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </div>
  );
}
