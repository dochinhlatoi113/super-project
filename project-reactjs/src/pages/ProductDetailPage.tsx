import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProductDetailPage() {
    const formatCurrency = (value: string | number) => {
      if (value === '-' || value === undefined || value === null) return '-';
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value));
    };
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:8000/api/v1/products/detail/${slug}`);
        if (!res.ok) throw new Error('Không thể lấy chi tiết sản phẩm');
        const data = await res.json();
        setProduct(data.data);
      } catch (err: any) {
        setError(err.message || 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slug]);

  if (loading) return <div className="text-center text-gray-500">Đang tải chi tiết sản phẩm...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!product) return <div className="text-center text-red-500">Không tìm thấy sản phẩm.</div>;

  return (
    <div className="py-4 px-2 md:px-6 lg:px-8 w-full">
      <button className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>
      <h1 className="text-2xl font-bold mb-4">Chi tiết sản phẩm: {product.name}</h1>
      <div className="overflow-x-auto bg-white rounded shadow border mb-8">
        <table className="min-w-[600px] w-full">
          <tbody>
            <tr><td className="font-semibold p-2 w-40">ID</td><td className="p-2">{product.id}</td></tr>
            <tr><td className="font-semibold p-2">Name</td><td className="p-2">{product.name}</td></tr>
            <tr><td className="font-semibold p-2">Slug</td><td className="p-2">{product.slug}</td></tr>
            <tr><td className="font-semibold p-2">Brand</td><td className="p-2">{product.brand?.name}</td></tr>
            <tr><td className="font-semibold p-2">Created At</td><td className="p-2">{product.created_at}</td></tr>
            <tr><td className="font-semibold p-2">Updated At</td><td className="p-2">{product.updated_at}</td></tr>
            <tr><td className="font-semibold p-2">Categories</td><td className="p-2">{product.categories?.map((c: any) => c.name).join(', ')}</td></tr>
          </tbody>
        </table>
      </div>
      <h2 className="text-xl font-semibold mb-2">Variants</h2>
      <div className="overflow-x-auto bg-white rounded shadow border mb-8">
        <table className="min-w-[700px] w-full text-center align-middle">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">SKU</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Color</th>
              <th className="px-4 py-2">Size</th>
              <th className="px-4 py-2">Storage</th>
            </tr>
          </thead>
          <tbody>
            {product.variants?.map((v: any) => (
              <tr key={v.id} className="border-t">
                <td className="px-4 py-2">{v.id}</td>
                <td className="px-4 py-2">{v.name}</td>
                <td className="px-4 py-2">{v.primary_sku?.sku ?? '-'}</td>
                <td className="px-4 py-2">{v.stock ?? '-'}</td>
                <td className="px-4 py-2">{formatCurrency(v.price ?? v.attributes?.find((a: any) => a.attribute === 'price')?.value ?? '-')}</td>
                <td className="px-4 py-2">{v.attributes?.find((a: any) => a.attribute === 'color')?.value ?? '-'}</td>
                <td className="px-4 py-2">{v.attributes?.find((a: any) => a.attribute === 'size')?.value ?? '-'}</td>
                <td className="px-4 py-2">{v.attributes?.find((a: any) => a.attribute === 'storage')?.value ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="text-xl font-semibold mb-2">Brand</h2>
      <div className="overflow-x-auto bg-white rounded shadow border mb-8">
        {product.brand ? (
          <table className="min-w-[400px] w-full text-center">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(product.brand).map((k) => (
                  <th key={k} className="px-4 py-2 text-center font-semibold">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.values(product.brand).map((v, idx) => (
                  <td key={idx} className="px-4 py-2">{String(v)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        ) : (
          <div className="px-4 py-2 text-gray-500">Không có thông tin brand</div>
        )}
      </div>
      <h2 className="text-xl font-semibold mb-2">Categories</h2>
      <div className="overflow-x-auto bg-white rounded shadow border">
        {product.categories && product.categories.length > 0 ? (
          <table className="min-w-[400px] w-full text-center">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(product.categories[0]).map((k) => (
                  <th key={k} className="px-4 py-2 text-center font-semibold">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {product.categories.map((cat: any, idx: number) => (
                <tr key={cat.id || idx}>
                  {Object.values(cat).map((v, i) => (
                    <td key={i} className="px-4 py-2">{String(v)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-4 py-2 text-gray-500">Không có categories</div>
        )}
      </div>
    </div>
  );
}
