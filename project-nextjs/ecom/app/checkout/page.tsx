"use client";
import { Suspense } from 'react';
import CheckoutForm from '../components/CheckoutForm';
import { useSearchParams } from 'next/navigation';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get('product') || '';
  return (
    <div className="max-w-3xl w-full mx-auto bg-white rounded-lg shadow p-6 mt-8">
      <h1 className="text-3xl font-bold text-center mb-8">Thanh toán</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <CheckoutForm productSlug={productSlug} />
      </Suspense>
    </div>
  );
}
