import React, { useState } from 'react';

const defaultAttributes = [
  { attribute: 'color', value: '', is_filterable: true },
  { attribute: 'size', value: '', is_filterable: true },
  { attribute: 'storage', value: '', is_filterable: true },
  { attribute: 'price', value: '', is_filterable: false },
];

export default function AddProductPage() {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [variants, setVariants] = useState([
    {
      name: '',
      stock: '',
      price: '',
      attributes: JSON.parse(JSON.stringify(defaultAttributes)),
      primary_sku: { sku: '' },
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVariantChange = (idx, field, value) => {
    const newVariants = [...variants];
    if (field.startsWith('attr-')) {
      const [_, attrIdx, attrField] = field.split('-');
      newVariants[idx].attributes[attrIdx][attrField] = value;
    } else {
      newVariants[idx][field] = value;
    }
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        name: '',
        stock: '',
        price: '',
        attributes: JSON.parse(JSON.stringify(defaultAttributes)),
        primary_sku: { sku: '' },
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        name,
        brand,
        category,
        variants: variants.map(v => ({
          name: v.name,
          stock: v.stock,
          price: v.price,
          primary_sku: v.primary_sku,
          attributes: v.attributes,
        })),
      };
      const res = await fetch('http://localhost:8000/api/v1/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to add product');
      setSuccess('Thêm sản phẩm thành công!');
      setName('');
      setBrand('');
      setCategory('');
      setVariants([
        {
          name: '',
          stock: '',
          price: '',
          attributes: JSON.parse(JSON.stringify(defaultAttributes)),
          primary_sku: { sku: '' },
        },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Thêm sản phẩm mới</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
        <div>
          <label className="block font-semibold mb-1">Tên sản phẩm</label>
          <input className="border px-3 py-2 w-full" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Brand</label>
          <input className="border px-3 py-2 w-full" value={brand} onChange={e => setBrand(e.target.value)} />
        </div>
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <input className="border px-3 py-2 w-full" value={category} onChange={e => setCategory(e.target.value)} />
        </div>
        <div>
          <label className="block font-semibold mb-1">Variants</label>
          {variants.map((v, idx) => (
            <div key={idx} className="border rounded p-4 mb-4">
              <div className="mb-2">
                <label className="block text-sm">Tên variant</label>
                <input className="border px-2 py-1 w-full" value={v.name} onChange={e => handleVariantChange(idx, 'name', e.target.value)} required />
              </div>
              <div className="mb-2">
                <label className="block text-sm">Stock</label>
                <input className="border px-2 py-1 w-full" type="number" value={v.stock} onChange={e => handleVariantChange(idx, 'stock', e.target.value)} required />
              </div>
              <div className="mb-2">
                <label className="block text-sm">Price</label>
                <input className="border px-2 py-1 w-full" type="number" value={v.price} onChange={e => handleVariantChange(idx, 'price', e.target.value)} required />
              </div>
              <div className="mb-2">
                <label className="block text-sm">SKU</label>
                <input className="border px-2 py-1 w-full" value={v.primary_sku.sku} onChange={e => handleVariantChange(idx, 'primary_sku', { sku: e.target.value })} />
              </div>
              <div className="mb-2">
                <label className="block text-sm">Thuộc tính (color, size, storage, price)</label>
                {v.attributes.map((attr, attrIdx) => (
                  <div key={attr.attribute} className="flex items-center gap-2 mb-1">
                    <span className="w-20 text-xs">{attr.attribute}</span>
                    <input className="border px-2 py-1 flex-1" value={attr.value} onChange={e => handleVariantChange(idx, `attr-${attrIdx}-value`, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button type="button" className="px-3 py-1 bg-gray-200 rounded" onClick={addVariant}>+ Thêm variant</button>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded" disabled={loading}>{loading ? 'Đang lưu...' : 'Thêm sản phẩm'}</button>
      </form>
    </div>
  );
}
