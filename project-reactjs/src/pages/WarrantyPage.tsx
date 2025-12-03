import { useState } from 'react';
import StatsGrid from '../components/StatsGrid';

interface WarrantyProduct {
  id: number;
  orderNumber: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  purchaseDate: string;
  warrantyPeriod: number; // months
  warrantyExpiry: string;
  daysRemaining: number;
  status: 'active' | 'expiring-soon' | 'expired' | 'claimed';
  serialNumber: string;
  claimCount: number;
  lastClaim?: string;
}

export default function WarrantyPage() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'expiring' | 'expired' | 'claimed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<WarrantyProduct | null>(null);

  const stats = [
    { label: 'Total Warranties', value: 1234, color: 'text-blue-600' },
    { label: 'Active', value: 892, color: 'text-green-600' },
    { label: 'Expiring Soon (30 days)', value: 156, color: 'text-yellow-600' },
    { label: 'Expired', value: 186, color: 'text-red-600' },
    { label: 'Claims Processed', value: 89, color: 'text-purple-600' },
  ];

  const warrantyProducts: WarrantyProduct[] = [
    {
      id: 1,
      orderNumber: '#ORD-1001',
      productName: 'Laptop Pro 15"',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+1 234 567 890',
      purchaseDate: '2024-11-01',
      warrantyPeriod: 12,
      warrantyExpiry: '2025-11-01',
      daysRemaining: 335,
      status: 'active',
      serialNumber: 'LAP-2024-001234',
      claimCount: 0,
    },
    {
      id: 2,
      orderNumber: '#ORD-0998',
      productName: 'Wireless Mouse',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      customerPhone: '+1 234 567 891',
      purchaseDate: '2024-01-15',
      warrantyPeriod: 12,
      warrantyExpiry: '2025-01-15',
      daysRemaining: 45,
      status: 'expiring-soon',
      serialNumber: 'MSE-2024-005678',
      claimCount: 0,
    },
    {
      id: 3,
      orderNumber: '#ORD-0956',
      productName: 'Monitor 27"',
      customerName: 'Bob Johnson',
      customerEmail: 'bob@example.com',
      customerPhone: '+1 234 567 892',
      purchaseDate: '2023-06-20',
      warrantyPeriod: 24,
      warrantyExpiry: '2025-06-20',
      daysRemaining: 200,
      status: 'claimed',
      serialNumber: 'MON-2023-009876',
      claimCount: 1,
      lastClaim: '2024-03-15',
    },
    {
      id: 4,
      orderNumber: '#ORD-0845',
      productName: 'Mechanical Keyboard',
      customerName: 'Alice Brown',
      customerEmail: 'alice@example.com',
      customerPhone: '+1 234 567 893',
      purchaseDate: '2023-10-10',
      warrantyPeriod: 12,
      warrantyExpiry: '2024-10-10',
      daysRemaining: -52,
      status: 'expired',
      serialNumber: 'KEY-2023-003456',
      claimCount: 0,
    },
    {
      id: 5,
      orderNumber: '#ORD-1023',
      productName: 'USB-C Hub',
      customerName: 'Charlie Wilson',
      customerEmail: 'charlie@example.com',
      customerPhone: '+1 234 567 894',
      purchaseDate: '2024-11-20',
      warrantyPeriod: 6,
      warrantyExpiry: '2025-05-20',
      daysRemaining: 170,
      status: 'active',
      serialNumber: 'HUB-2024-007890',
      claimCount: 0,
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      'expiring-soon': 'bg-yellow-100 text-yellow-700',
      expired: 'bg-red-100 text-red-700',
      claimed: 'bg-purple-100 text-purple-700',
    };
    const labels = {
      active: 'Active',
      'expiring-soon': 'Expiring Soon',
      expired: 'Expired',
      claimed: 'Claimed',
    };
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getDaysRemainingColor = (days: number) => {
    if (days < 0) return 'text-red-600';
    if (days <= 30) return 'text-yellow-600';
    return 'text-green-600';
  };

  const filteredProducts = warrantyProducts.filter(product => {
    const matchesSearch = 
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = selectedTab === 'all' || 
      (selectedTab === 'active' && product.status === 'active') ||
      (selectedTab === 'expiring' && product.status === 'expiring-soon') ||
      (selectedTab === 'expired' && product.status === 'expired') ||
      (selectedTab === 'claimed' && product.status === 'claimed');
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Warranty Management</h1>
          <p className="text-gray-500 mt-1">Track and manage product warranties</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Export Report
          </button>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Register Warranty
          </button>
        </div>
      </div>

      <StatsGrid stats={stats} columns={5} />

      {/* Tabs and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedTab === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedTab('active')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedTab === 'active' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setSelectedTab('expiring')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedTab === 'expiring' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Expiring Soon
            </button>
            <button
              onClick={() => setSelectedTab('expired')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedTab === 'expired' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Expired
            </button>
            <button
              onClick={() => setSelectedTab('claimed')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedTab === 'claimed' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Claimed
            </button>
          </div>
          <input
            type="text"
            placeholder="Search by product, customer, serial number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-96"
          />
        </div>
      </div>

      {/* Warranty Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Order #</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Product</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Serial Number</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Customer</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Purchase Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Warranty Period</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Expiry Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Days Remaining</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <span className="font-medium text-indigo-600">{product.orderNumber}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-800">{product.productName}</p>
                      {product.claimCount > 0 && (
                        <p className="text-xs text-purple-600 mt-1">
                          {product.claimCount} claim(s) processed
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600 font-mono">{product.serialNumber}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-800">{product.customerName}</p>
                      <p className="text-sm text-gray-500">{product.customerEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{product.purchaseDate}</td>
                  <td className="py-4 px-6 text-gray-600">{product.warrantyPeriod} months</td>
                  <td className="py-4 px-6 text-gray-600">{product.warrantyExpiry}</td>
                  <td className="py-4 px-6">
                    <span className={`font-semibold ${getDaysRemainingColor(product.daysRemaining)}`}>
                      {product.daysRemaining >= 0 ? `${product.daysRemaining} days` : 'Expired'}
                    </span>
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(product.status)}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium mr-3"
                    >
                      View
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 font-medium">
                      Claim
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warranty Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Warranty Details</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Product Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Product Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Product Name</p>
                    <p className="font-medium text-gray-800">{selectedProduct.productName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Serial Number</p>
                    <p className="font-medium text-gray-800 font-mono">{selectedProduct.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Order Number</p>
                    <p className="font-medium text-indigo-600">{selectedProduct.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedProduct.status)}</div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium text-gray-800">{selectedProduct.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{selectedProduct.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-gray-800">{selectedProduct.customerPhone}</p>
                  </div>
                </div>
              </div>

              {/* Warranty Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Warranty Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Purchase Date</p>
                    <p className="font-medium text-gray-800">{selectedProduct.purchaseDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Warranty Period</p>
                    <p className="font-medium text-gray-800">{selectedProduct.warrantyPeriod} months</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Expiry Date</p>
                    <p className="font-medium text-gray-800">{selectedProduct.warrantyExpiry}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Days Remaining</p>
                    <p className={`font-semibold ${getDaysRemainingColor(selectedProduct.daysRemaining)}`}>
                      {selectedProduct.daysRemaining >= 0 ? `${selectedProduct.daysRemaining} days` : 'Expired'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Claims</p>
                    <p className="font-medium text-gray-800">{selectedProduct.claimCount}</p>
                  </div>
                  {selectedProduct.lastClaim && (
                    <div>
                      <p className="text-gray-500">Last Claim Date</p>
                      <p className="font-medium text-gray-800">{selectedProduct.lastClaim}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium">
                  Process Warranty Claim
                </button>
                <button className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
                  Extend Warranty
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
                  Print Certificate
                </button>
              </div>

              {/* Claim History */}
              {selectedProduct.claimCount > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Claim History</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">Screen Replacement</p>
                          <p className="text-sm text-gray-500">Claim Date: {selectedProduct.lastClaim}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          Completed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
