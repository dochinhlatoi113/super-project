import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsGrid from '../components/StatsGrid';

type Variant = {
  primary_sku?: { sku?: string };
  attributes?: { attribute: string; value: string | number; is_filterable?: boolean }[];
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
    const formatCurrency = (value: string | number) => {
      if (value === '-' || value === undefined || value === null) return '-';
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value));
    };
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

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
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
      let pagi = { last_page: 1, per_page: 10, total: 0 };
      if (data.data && Array.isArray(data.data.data)) {
        productsArr = data.data.data;
        pagi = {
          last_page: data.data.last_page || 1,
          per_page: data.data.per_page || 10,
          total: data.data.total || productsArr.length,
        };
      } else if (Array.isArray(data.data)) {
        productsArr = data.data;
        pagi = {
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
    fetchProducts(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

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
                <th className="px-6 py-4 text-left">Product ID</th>
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
                let price = '-';
                let stock = '-';
                if (variant) {
                  if (variant.stock !== undefined && variant.stock !== null) {
                    stock = variant.stock;
                  } else if (Array.isArray(variant.attributes)) {
                    const stockAttr = variant.attributes.find(a => a.attribute === 'stock' || a.attribute === 'storage');
                    if (stockAttr && stockAttr.value !== undefined && stockAttr.value !== null) stock = stockAttr.value;
                  }
                  if (variant.price !== undefined && variant.price !== null) {
                    price = variant.price;
                  } else if (Array.isArray(variant.attributes)) {
                    const priceAttr = variant.attributes.find(a => a.attribute === 'price');
                    if (priceAttr && priceAttr.value !== undefined && priceAttr.value !== null) price = priceAttr.value;
                  }
                }
                return (
                  <tr key={product.id} className="border-t">
                    <td className="px-6 py-4">{product.id}</td>
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">{product.slug}</td>
                    <td className="px-6 py-4">{product.brand?.name}</td>
                    <td className="px-6 py-4">{variant?.primary_sku?.sku}</td>
                    <td className="px-6 py-4">{product.categories?.[0]?.name}</td>
                    <td className="px-6 py-4">{formatCurrency(price)}</td>
                    <td className="px-6 py-4">{stock}</td>
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
        <nav className="flex flex-wrap gap-2 max-w-full">
          {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              disabled={page === currentPage}
              className={`px-3 py-1 rounded ${
                page === currentPage
                  ? 'bg-indigo-600 text-white'
                  : 'border'
              }`}
            >
              {page}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
