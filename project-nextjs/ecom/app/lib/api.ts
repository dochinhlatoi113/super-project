// app/lib/api.ts
// Centralized API functions for fetching data from Laravel backend

const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface Category {
  id: number;
  name: string;
  slug: string;
  active: number;
  parent_id?: number | null;
  sub_categories?: Category[];
}

export interface Product {
  id: number;
  name: string;
  brand_id: number;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  slug_active: string;
  supplier_id: number | null;
  is_primary: number;
  variants: any[]; // Define properly if needed
  brand: any; // Define properly if needed
  categories: any[]; // Define properly if needed
  image?: string;
  price?: string | number;
  desc?: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  const data = await response.json();
  return data.data?.items || data || [];
};

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data = await response.json();
  return data.data?.data || [];
};


export const fetchProductDetail = async (slug: string): Promise<Product | null> => {
  const response = await fetch(`${API_BASE_URL}/products/detail/${encodeURIComponent(slug)}`);
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data.data || null;
};

// Fetch detail for a category by slug
export const fetchCategoryDetail = async (slug: string): Promise<Category | null> => {
  console.log('Calling API:', `${API_BASE_URL}/categories/detail/${encodeURIComponent(slug)}`);
  const response = await fetch(`${API_BASE_URL}/categories/detail/${encodeURIComponent(slug)}`, { cache: 'no-store' });
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data.data || null;
};

export interface VnpayPaymentRequest {
  order_id: string;
  amount: number;
  payment_method_id?: number;
}

export interface VnpayPaymentResponse {
  payment_id: number;
  vnpay_url: string;
}

export const createVnpayPayment = async (paymentData: VnpayPaymentRequest): Promise<VnpayPaymentResponse> => {
  const response = await fetch(`${API_BASE_URL}/payments/vnpay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    throw new Error('Failed to create VNPAY payment');
  }

  const data = await response.json();
  return data;
};