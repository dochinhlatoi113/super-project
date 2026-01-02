"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VnpayReturnPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Lấy các tham số từ URL
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
        const vnp_TxnRef = searchParams.get('vnp_TxnRef');

        if (vnp_ResponseCode === '00') {
          setStatus('success');
          setMessage(`Thanh toán thành công! Mã đơn hàng: ${vnp_TxnRef}`);
        } else {
          setStatus('failed');
          setMessage(`Thanh toán thất bại. Mã lỗi: ${vnp_ResponseCode}`);
        }
      } catch (error) {
        setStatus('failed');
        setMessage('Có lỗi xảy ra khi xử lý kết quả thanh toán.');
      }
    };

    processCallback();
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'success' ? (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-600 mb-4">Thanh toán thành công!</h1>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Thanh toán thất bại!</h1>
          </>
        )}

        <p className="text-gray-600 mb-6">{message}</p>

        <div className="space-y-3">
          <a
            href="/"
            className="block w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
          >
            Về trang chủ
          </a>
          <a
            href="/checkout"
            className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
          >
            Tiếp tục mua hàng
          </a>
        </div>
      </div>
    </div>
  );
}