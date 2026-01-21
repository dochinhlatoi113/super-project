import React from 'react';

interface Product {
  id: number;
  name: string;
  image?: string;
  price?: number | string;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center hover:shadow-lg transition">
          <div className="w-32 h-32 bg-gray-100 flex items-center justify-center mb-2 rounded">
            {product.image ? (
              <img src={product.image} alt={product.name} className="max-h-28 object-contain" />
            ) : (
              <span className="text-gray-400">No image</span>
            )}
          </div>
          <div className="font-semibold text-center mb-1 line-clamp-2 min-h-[2.5em]">{product.name}</div>
          {product.price && (
            <div className="text-red-600 font-bold text-lg">{product.price.toLocaleString()}₫</div>
          )}
        </div>
      ))}
    </div>
  );
}
