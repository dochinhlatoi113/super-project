// [slug]/page.tsx
// Trang chi tiết sản phẩm động theo slug

"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchProductDetail, Product } from "../../lib/api";

export default function ProductDetail() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : '';
  const [product, setProduct] = useState<Product | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!slug) return;
    fetchProductDetail(slug).then((found) => {
      setProduct(found || null);
    });
  }, [slug]);

  if (!product) return <div>Không tìm thấy sản phẩm.</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 mt-8 flex flex-col md:flex-row gap-8">
      <img src={product.image || "/no-image.png"} alt={product.name} className="w-full md:w-1/3 object-contain rounded-lg border" />
      <div className="flex-1 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
        <div className="text-red-600 text-xl font-bold">{product.price || "Liên hệ"}</div>
        <div className="text-gray-600">{product.desc || ""}</div>
        <button
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700 w-max"
          onClick={() => router.push(`/checkout?product=${product.slug}`)}
        >
          Mua ngay
        </button>
      </div>
    </div>
  );
}
