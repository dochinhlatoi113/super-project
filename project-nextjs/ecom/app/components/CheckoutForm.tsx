'use client';

import { useEffect, useState } from 'react';
import { Product, fetchProductDetail, createVnpayPayment, VnpayPaymentRequest } from '../lib/api';

interface CheckoutFormProps {
  productSlug?: string;
}

type Gender = 'male' | 'female';
type DeliveryType = 'home' | 'store';

export default function CheckoutForm({ productSlug }: CheckoutFormProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [gender, setGender] = useState<Gender>('male');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: '',
    ward: '',
    address: '',
    note: ''
  });

  useEffect(() => {
    if (!productSlug) return;
    fetchProductDetail(productSlug).then(found => {
      setProduct(found || null);
    });
  }, [productSlug]);

  if (!product) return <div>Không tìm thấy sản phẩm.</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      //  order_id unique
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const price = product?.variants?.[0]?.append_config_variants?.[0]?.price;
      const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d]/g, '')) : price || 0;
      const totalAmount = numericPrice * quantity;

      const paymentData: VnpayPaymentRequest = {
        order_id: orderId,
        amount: totalAmount,
        payment_method_id: 1, 
      };

      const paymentResponse = await createVnpayPayment(paymentData);

      window.location.href = paymentResponse.vnpay_url;

    } catch (err) {
      console.error('Payment error:', err);
      setError('Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-2 flex items-center">
        <button type="button" className="text-red-600 font-semibold text-xs px-2 py-1 border border-red-200 rounded hover:bg-red-50">&lt; Tiếp tục mua hàng</button>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4 border-b pb-4 mb-4">
        {(() => {
          const avatar = product.variants?.[0]?.append_config_variants?.[0]?.avatar || '/no-image.png';
          const priceRaw = product.variants?.[0]?.append_config_variants?.[0]?.price;
          const numericPrice = typeof priceRaw === 'string' ? parseFloat(priceRaw.replace(/[^\d]/g, '')) : priceRaw || 0;
          const price = numericPrice > 0 ? numericPrice.toLocaleString('vi-VN') + ' ₫' : 'Liên hệ';
          const totalAmount = numericPrice * quantity;
          const totalAmountStr = totalAmount > 0 ? totalAmount.toLocaleString('vi-VN') + ' ₫' : '';
          return (
            <>
              <img src={avatar} alt={product.name} className="w-20 h-20 object-contain rounded border mb-2 md:mb-0" />
              <div className="flex-1 min-w-[180px]">
                <div className="font-semibold text-base">{product.name}</div>
                <div className="text-red-600 text-xl font-bold">{price}</div>
                <div className="text-gray-700 text-base mt-1">Tổng: <span className="font-bold">{totalAmountStr}</span></div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="border rounded w-8 h-8 flex items-center justify-center">-</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity(q => q + 1)} className="border rounded w-8 h-8 flex items-center justify-center">+</button>
              </div>
              <button type="button" className="ml-2 text-gray-400 hover:text-red-600"><span className="material-icons">delete</span></button>
            </>
          );
        })()}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="font-bold mb-2 text-base uppercase text-black">THÔNG TIN KHÁCH HÀNG</div>
          <div className="flex items-center gap-4 mb-2">
            <label className="flex items-center gap-1 font-semibold text-black">
              <input type="radio" name="gender" checked={gender === 'male'} onChange={() => setGender('male')} /> Anh
            </label>
            <label className="flex items-center gap-1 font-semibold text-black">
              <input type="radio" name="gender" checked={gender === 'female'} onChange={() => setGender('female')} /> Chị
            </label>
          </div>
          <div className="flex gap-2 mb-2">
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Họ và tên" className="border rounded p-2 flex-1 font-semibold min-w-[120px] text-black" />
            <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Số điện thoại" className="border rounded p-2 flex-1 font-semibold min-w-[120px] text-black" />
          </div>
        </div>
        <div>
          <div className="font-bold mb-2 text-base uppercase text-black">HÌNH THỨC GIAO HÀNG</div>
          <div className="flex items-center gap-4 mb-2">
            <label className="flex items-center gap-1 font-semibold text-black">
              <input type="radio" name="deliveryType" checked={deliveryType === 'home'} onChange={() => setDeliveryType('home')} /> Giao hàng tận nơi
            </label>
            <label className="flex items-center gap-1 font-semibold text-black">
              <input type="radio" name="deliveryType" checked={deliveryType === 'store'} onChange={() => setDeliveryType('store')} /> Nhận hàng tại cửa hàng
            </label>
          </div>
          <div className="flex gap-2 mb-2">
            <input name="city" value={form.city} onChange={handleChange} required placeholder="Tỉnh thành" className="border rounded p-2 flex-1 font-semibold min-w-[100px] text-black" />
            <input name="ward" value={form.ward} onChange={handleChange} required placeholder="Phường xã" className="border rounded p-2 flex-1 font-semibold min-w-[100px] text-black" />
          </div>
          <input name="address" value={form.address} onChange={handleChange} required placeholder="Tên đường số nhà" className="border rounded p-2 w-full mb-2 font-semibold text-black" />
          <input name="note" value={form.note} onChange={handleChange} placeholder="Yêu cầu khác (nếu có)" className="border rounded p-2 w-full font-semibold text-black" />
        </div>
      </div>
      <button type="submit" className="w-full bg-red-600 text-white py-2 rounded font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
        {isLoading ? 'Đang xử lý thanh toán...' : 'Thanh toán qua VNPAY'}
      </button>
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </form>
  );
}
