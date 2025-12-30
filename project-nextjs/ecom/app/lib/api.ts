// app/lib/api.ts
// Centralized API functions for fetching data from Laravel backend

const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface Category {
  id: number;
  name: string;
  slug: string;
  active: number;
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

// Add more API functions as needed