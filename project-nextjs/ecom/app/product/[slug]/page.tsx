// [slug]/page.tsx
// Trang chi tiết sản phẩm động theo slug
import { notFound } from 'next/navigation';

const mockProducts = [
  {
    slug: 'vivo-v60-12gb-512gb',
    name: 'Vivo V60 12GB 512GB',
    price: '12.990.000₫',
    image: '/vivo-v60.jpg',
    desc: 'Vivo V60 với RAM 12GB, bộ nhớ 512GB, màn hình AMOLED 120Hz, pin 5000mAh, sạc nhanh 80W.'
  },
  // Có thể thêm nhiều sản phẩm mẫu khác
];

export default async function ProductDetail({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const product = mockProducts.find(p => p.slug === slug);
  if (!product) return notFound();
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 mt-8 flex flex-col md:flex-row gap-8">
      <img src={product.image} alt={product.name} className="w-full md:w-1/3 object-contain rounded-lg border" />
      <div className="flex-1 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
        <div className="text-red-600 text-xl font-bold">{product.price}</div>
        <div className="text-gray-600">{product.desc}</div>
        <button className="mt-4 px-6 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700 w-max">Mua ngay</button>
      </div>
    </div>
  );
}
