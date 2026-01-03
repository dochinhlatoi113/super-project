import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsGrid from '../components/StatsGrid';

type Variant = {
  primary_sku?: { sku?: string };
  append_config_variants?: { price?: number; storage?: number }[];
};

type Product = {
  id: number;
  name: string;
  slug: string;
  brand?: { name?: string };
  categories?: { name?: string }[];
  variants?: Variant[];
};

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [stats, setStats] = useState([
    { label: 'Total Products', value: 0 },
    { label: 'In Stock', value: 0, color: 'text-green-600' },
    { label: 'Low Stock', value: 0, color: 'text-yellow-600' },
    { label: 'Out of Stock', value: 0, color: 'text-red-600' },
  ]);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`http://localhost:8000/api/v1/products?page=${page}`);
      if (!res.ok) throw new Error('Failed to fetch products');

      const data = await res.json();
      // Laravel chuẩn: data.data.data là mảng, data.data là object phân trang
      let productsArr: Product[] = [];
      let pagi = { current_page: 1, last_page: 1, per_page: 10, total: 0 };
      if (data.data && Array.isArray(data.data.data)) {
        productsArr = data.data.data;
        pagi = {
          current_page: data.data.current_page || 1,
          last_page: data.data.last_page || 1,
          per_page: data.data.per_page || 10,
          total: data.data.total || productsArr.length,
        };
      } else if (Array.isArray(data.data)) {
        productsArr = data.data;
        pagi = {
          current_page: 1,
          last_page: 1,
          per_page: productsArr.length,
          total: productsArr.length,
        };
      }
      setProducts(productsArr);
      setPagination(pagi);

      setStats([
        { label: 'Total Products', value: data.total },
        { label: 'In Stock', value: data.in_stock || 0, color: 'text-green-600' },
        { label: 'Low Stock', value: data.low_stock || 0, color: 'text-yellow-600' },
        { label: 'Out of Stock', value: data.out_of_stock || 0, color: 'text-red-600' },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  return (
    <div className="py-4 px-2 md:px-6 lg:px-8 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-gray-500 mt-1">Manage your product catalog</p>
        </div>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg">
          Add Product
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow border">
        {loading ? (
          <div className="text-center text-gray-500">Đang tải sản phẩm...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <table className="min-w-[900px] w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Product</th>
                <th className="px-6 py-4 text-left">Slug</th>
                <th className="px-6 py-4 text-left">Brand</th>
                <th className="px-6 py-4 text-left">SKU</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Price</th>
                <th className="px-6 py-4 text-left">Stock</th>
                <th className="px-6 py-4 text-left">Variants</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const variant = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
                return (
                  <tr key={product.id} className="border-t">
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">{product.slug}</td>
                    <td className="px-6 py-4">{product.brand?.name}</td>
                    <td className="px-6 py-4">{variant?.primary_sku?.sku}</td>
                    <td className="px-6 py-4">{product.categories?.[0]?.name}</td>
                    <td className="px-6 py-4">{variant?.append_config_variants?.[0]?.price}</td>
                    <td className="px-6 py-4">{variant?.append_config_variants?.[0]?.storage}</td>
                    <td
                      className="px-6 py-4 text-blue-600 cursor-pointer hover:underline"
                      onClick={() => navigate(`/products/${product.slug}`, { state: { product } })}
                    >
                      detail
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <nav className="inline-flex space-x-1">
          {(() => {
            const pages = [];
            const { current_page, last_page } = pagination;
            if (last_page <= 8) {
              for (let i = 1; i <= last_page; i++) {
                pages.push(i);
              }
            } else {
              // 5 đầu, 3 cuối, ... ở giữa
              for (let i = 1; i <= 5; i++) pages.push(i);
              if (current_page > 7 && current_page < last_page - 2) {
                pages.push('...');
                pages.push(current_page - 1, current_page, current_page + 1);
                pages.push('...');
              } else {
                pages.push('...');
              }
              for (let i = last_page - 2; i <= last_page; i++) pages.push(i);
            }
            // Loại bỏ trùng lặp và sắp xếp
            const uniquePages = Array.from(new Set(pages.filter(p => typeof p === 'number' ? p >= 1 && p <= last_page : true)));
            return uniquePages.map((page, idx) =>
              page === '...'
                ? <span key={"ellipsis-" + idx} className="px-2">...</span>
                : <button
                    key={page}
                    onClick={() => fetchProducts(Number(page))}
                    disabled={page === current_page}
                    className={`px-3 py-1 mx-1 rounded ${
                      page === current_page
                        ? 'bg-indigo-600 text-white'
                        : 'border'
                    }`}
                  >
                    {page}
                  </button>
            );
          })()}
        </nav>
      </div>
    </div>
  );
}
