import StatsGrid from '../components/StatsGrid';

export default function ProductsPage() {
  const stats = [
    { label: 'Total Products', value: 456 },
    { label: 'In Stock', value: 398, color: 'text-green-600' },
    { label: 'Low Stock', value: 42, color: 'text-yellow-600' },
    { label: 'Out of Stock', value: 16, color: 'text-red-600' },
  ];

  const products = [
    { id: 1, name: 'Laptop Pro 15"', sku: 'LAP-001', category: 'Electronics', price: '$1,299', stock: 45, status: 'in-stock' },
    { id: 2, name: 'Wireless Mouse', sku: 'MSE-002', category: 'Accessories', price: '$29', stock: 120, status: 'in-stock' },
    { id: 3, name: 'USB-C Cable', sku: 'CBL-003', category: 'Accessories', price: '$15', stock: 5, status: 'low-stock' },
    { id: 4, name: 'Monitor 27"', sku: 'MON-004', category: 'Electronics', price: '$399', stock: 0, status: 'out-of-stock' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product catalog</p>
        </div>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Add Product
        </button>
      </div>

      <StatsGrid stats={stats} columns={4} />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Product</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">SKU</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Category</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Price</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Stock</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50 transition">
                  <td className="py-4 px-6 font-medium text-gray-800">{product.name}</td>
                  <td className="py-4 px-6 text-gray-600">{product.sku}</td>
                  <td className="py-4 px-6 text-gray-600">{product.category}</td>
                  <td className="py-4 px-6 text-gray-800 font-medium">{product.price}</td>
                  <td className="py-4 px-6 text-gray-600">{product.stock}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      product.status === 'in-stock' ? 'bg-green-100 text-green-700' :
                      product.status === 'low-stock' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
