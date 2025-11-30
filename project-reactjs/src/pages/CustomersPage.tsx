import StatsGrid from '../components/StatsGrid';

export default function CustomersPage() {
  const stats = [
    { 
      label: 'Total Customers', 
      value: '1,234',
      trend: { value: '12% from last month', isPositive: true }
    },
    { 
      label: 'Active Customers', 
      value: '1,098',
      trend: { value: '8% from last month', isPositive: true }
    },
    { 
      label: 'New This Month', 
      value: 156,
      trend: { value: '23% from last month', isPositive: true }
    },
    { 
      label: 'Avg. Lifetime Value', 
      value: '$1,890',
      trend: { value: '15% from last month', isPositive: true }
    },
  ];

  const customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', status: 'active', orders: 15, totalSpent: '$2,450' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234 567 891', status: 'active', orders: 8, totalSpent: '$1,200' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '+1 234 567 892', status: 'inactive', orders: 3, totalSpent: '$450' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '+1 234 567 893', status: 'active', orders: 22, totalSpent: '$3,890' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <p className="text-gray-500 mt-1">Manage your customer database</p>
        </div>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Add Customer
        </button>
      </div>

      <StatsGrid stats={stats} columns={4} />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Customer</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Contact</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Orders</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Total Spent</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-t hover:bg-gray-50 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold">{customer.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-gray-800">{customer.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-gray-800">{customer.email}</p>
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{customer.orders}</td>
                  <td className="py-4 px-6 text-gray-800 font-medium">{customer.totalSpent}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      customer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                      View Details
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
